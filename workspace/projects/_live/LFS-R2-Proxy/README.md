# LFS-R2-Proxy

A stateless Git LFS Batch API proxy for Cloudflare Workers, allowing you to use Cloudflare R2 as your Git LFS backend.

## Deployment

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Deploy to Cloudflare**:
    ```bash
    npm run deploy
    ```
    Note: You'll be prompted to log in to Cloudflare if not already.

3.  **Get your Worker URL**:
    It will look like `https://lfs-r2-proxy.<your-subdomain>.workers.dev`.

## Repository Configuration

In the repository where you want to use R2 for LFS:

1.  **Configure LFS URL**:
    ```bash
    git config -f .lfsconfig lfs.url "https://<R2_ACCESS_KEY>:<R2_SECRET_KEY>@<WORKER_URL>/<ACCOUNT_ID>.r2.cloudflarestorage.com/<BUCKET_NAME>"
    ```

2.  **Fetch & Push**:
    If you have existing LFS files:
    ```bash
    git lfs fetch --all
    git lfs push --all origin
    ```

## Security Note
This proxy is stateless and uses Basic Auth (Access Key:Secret Key) in the URL. For public repositories, use **Read-Only** R2 tokens in `.lfsconfig` and keep your **Read-Write** tokens in your local `.git/config`.
