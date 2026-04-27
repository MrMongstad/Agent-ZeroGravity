#!/bin/bash
# scripts/setup-ci.sh
# Workaround for GitHub Actions actions/checkout not respecting .lfsconfig

if [ -z "$LFS_PROXY_URL" ]; then
  echo "❌ Error: LFS_PROXY_URL environment variable is not set."
  exit 1
fi

echo "🔧 Configuring Git LFS for CI runner..."

# Inject the proxy URL into the local git config
# This ensures that 'git lfs fetch' uses the correct endpoint
git config lfs.url "$LFS_PROXY_URL"
git config lfs.locksverify false

echo "📦 Fetching LFS objects..."
git lfs fetch --all
git lfs checkout

echo "✅ LFS Setup Complete."
