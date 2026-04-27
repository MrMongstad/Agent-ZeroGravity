/**
 * LFS-R2-Proxy
 * Elite, stateless Git LFS Batch API proxy for Cloudflare Workers.
 * Routes LFS traffic directly to Cloudflare R2 via signed AWS v4 headers.
 *
 * URL format for .lfsconfig:
 *   https://<ACCESS_KEY>:<SECRET_KEY>@<worker-host>/<ACCOUNT_ID>.r2.cloudflarestorage.com/<BUCKET>
 */

import { Hono } from 'hono';
import { AwsClient } from 'aws4fetch';

type Bindings = {
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
};

interface LFSObject {
  oid: string;
  size: number;
}

interface LFSBatchRequest {
  operation: 'upload' | 'download';
  transfers?: string[];
  objects: LFSObject[];
}

const LFS_CONTENT_TYPE = 'application/vnd.git-lfs+json';
const EXPIRES_IN = 3600;
// Headers that must NOT be forwarded back to the LFS client
const SKIP_HEADERS = new Set(['host', 'content-length', 'content-type']);

const app = new Hono<{ Bindings: Bindings }>();

/**
 * Extract credentials from Basic Auth header.
 * Correctly handles secrets containing ':' by splitting only on the first colon.
 */
function getCredentials(
  authHeader: string | undefined,
  env: Bindings
): { accessKeyId: string; secretAccessKey: string } | null {
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const colonIndex = decoded.indexOf(':');
    if (colonIndex !== -1) {
      return {
        accessKeyId: decoded.slice(0, colonIndex),
        secretAccessKey: decoded.slice(colonIndex + 1),
      };
    }
  }
  if (env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    };
  }
  return null;
}

/**
 * Extract signed headers, filtering out anything the LFS client shouldn't set.
 */
function extractHeaders(signedRequest: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  signedRequest.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });
  return headers;
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch API Endpoint
// Path: /<R2_ENDPOINT>/<BUCKET>/objects/batch
// ─────────────────────────────────────────────────────────────────────────────
app.post('/:endpoint/:bucket/objects/batch', async (c) => {
  const { endpoint, bucket } = c.req.param();
  const s3Base = `https://${endpoint}/${bucket}`;

  // ── Auth ──────────────────────────────────────────────────────────────────
  const creds = getCredentials(c.req.header('Authorization'), c.env);
  if (!creds) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Git LFS"' },
    });
  }

  const aws = new AwsClient({
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    service: 's3',
    region: 'auto',
  });

  // ── Parse Body ────────────────────────────────────────────────────────────
  let body: LFSBatchRequest;
  try {
    body = await c.req.json<LFSBatchRequest>();
  } catch {
    return c.json({ message: 'Invalid JSON body' }, 400);
  }

  const { operation, objects } = body;

  if (operation !== 'upload' && operation !== 'download') {
    return c.json({ message: `Unsupported operation: ${operation}` }, 422);
  }

  // ── Sign each object ──────────────────────────────────────────────────────
  const responseObjects = await Promise.all(
    objects.map(async (obj: LFSObject) => {
      const objectUrl = `${s3Base}/objects/${obj.oid}`;

      try {
        if (operation === 'download') {
          const signed = await aws.sign(
            new Request(objectUrl, { method: 'GET' })
          );
          return {
            oid: obj.oid,
            size: obj.size,
            authenticated: true,
            actions: {
              download: {
                href: objectUrl,
                header: extractHeaders(signed),
                expires_in: EXPIRES_IN,
              },
            },
          };
        }

        // upload: sign a PUT. Use UNSIGNED-PAYLOAD so we don't need body hash upfront.
        const signed = await aws.sign(
          new Request(objectUrl, {
            method: 'PUT',
            headers: {
              'Content-Length': String(obj.size),
              'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
            },
          })
        );

        return {
          oid: obj.oid,
          size: obj.size,
          authenticated: true,
          actions: {
            upload: {
              href: objectUrl,
              header: extractHeaders(signed),
              expires_in: EXPIRES_IN,
            },
          },
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return {
          oid: obj.oid,
          size: obj.size,
          error: { code: 500, message },
        };
      }
    })
  );

  return c.json(
    { transfer: 'basic', objects: responseObjects },
    200,
    { 'Content-Type': LFS_CONTENT_TYPE }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Verify Endpoint
// Called by LFS client after an upload to confirm the object exists in R2.
// ─────────────────────────────────────────────────────────────────────────────
app.post('/:endpoint/:bucket/verify', async (c) => {
  const { endpoint, bucket } = c.req.param();

  const creds = getCredentials(c.req.header('Authorization'), c.env);
  if (!creds) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: LFSObject;
  try {
    body = await c.req.json<LFSObject>();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const aws = new AwsClient({
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    service: 's3',
    region: 'auto',
  });

  const objectUrl = `https://${endpoint}/${bucket}/objects/${body.oid}`;
  const headRequest = await aws.sign(new Request(objectUrl, { method: 'HEAD' }));
  const r2Response = await fetch(headRequest);

  if (!r2Response.ok) {
    return c.json({ message: 'Object not found in storage' }, 404);
  }

  const r2Size = parseInt(r2Response.headers.get('content-length') || '0', 10);
  if (r2Size !== body.size) {
    return c.json({ message: `Size mismatch: expected ${body.size}, got ${r2Size}` }, 422);
  }

  return new Response(null, { status: 200 });
});

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/', (c) => c.text('LFS-R2-Proxy: Online ✅'));

export default app;
