# Migrate-LFS.ps1
# Automates the migration of LFS objects to the R2 Proxy

param (
    [Parameter(Mandatory=$true)]
    [string]$ProxyUrl,
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "🚀 Starting LFS Migration to R2 Proxy..." -ForegroundColor Cyan

# 1. Fetch all existing LFS objects from current source (GitHub)
Write-Host "📦 Fetching all LFS objects locally..."
git lfs fetch --all
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to fetch LFS objects."; exit 1 }

# 2. Configure the new LFS URL in .lfsconfig
Write-Host "🔗 Redirecting LFS to $ProxyUrl..."
git config -f .lfsconfig lfs.url $ProxyUrl
git config -f .lfsconfig lfs.locksverify false

# 3. Push all objects to the new Proxy
Write-Host "📤 Pushing LFS objects to R2 Proxy..."
git lfs push --all origin
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to push LFS objects to Proxy."; exit 1 }

Write-Host "✅ Migration Complete!" -ForegroundColor Green
Write-Host "Next steps: Commit the .lfsconfig file to your repository."
