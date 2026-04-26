# GCP Environment Setup for NorCast
# This script automates Phase 0 of the Deployment Plan

$TIMESTAMP = Get-Date -Format "yyyyMMdd"
$DEV_PROJECT = "norcast-dev-sm-$TIMESTAMP"
$PROD_PROJECT = "norcast-prod-sm-$TIMESTAMP"
$SCRATCH_DIR = "C:\Users\steph\.gemini\antigravity\brain\e2572981-ad6e-4836-b889-e0f82cb0ee70\scratch"

Write-Host "🚀 Starting GCP Environment Setup..." -ForegroundColor Cyan

# 1. Create Projects
Write-Host "→ Creating Projects..." -ForegroundColor Yellow
gcloud projects create $DEV_PROJECT --name="NorCast Dev"
gcloud projects create $PROD_PROJECT --name="NorCast Prod"

# 2. Setup Dev
Write-Host "→ Setting up DEV Project ($DEV_PROJECT)..." -ForegroundColor Yellow
gcloud config set project $DEV_PROJECT
gcloud services enable secretmanager.googleapis.com run.googleapis.com artifactregistry.googleapis.com

gcloud iam service-accounts create github-deployer --display-name="GitHub Actions Deployer"
gcloud projects add-iam-policy-binding $DEV_PROJECT --member="serviceAccount:github-deployer@$DEV_PROJECT.iam.gserviceaccount.com" --role="roles/owner"

Write-Host "→ Generating Dev Key..." -ForegroundColor Green
gcloud iam service-accounts keys create "$SCRATCH_DIR\gcp_dev_key.json" --iam-account="github-deployer@$DEV_PROJECT.iam.gserviceaccount.com"

# 3. Setup Prod
Write-Host "→ Setting up PROD Project ($PROD_PROJECT)..." -ForegroundColor Yellow
gcloud config set project $PROD_PROJECT
gcloud services enable secretmanager.googleapis.com run.googleapis.com artifactregistry.googleapis.com

gcloud iam service-accounts create github-deployer --display-name="GitHub Actions Deployer"
gcloud projects add-iam-policy-binding $PROD_PROJECT --member="serviceAccount:github-deployer@$PROD_PROJECT.iam.gserviceaccount.com" --role="roles/owner"

Write-Host "→ Generating Prod Key..." -ForegroundColor Green
gcloud iam service-accounts keys create "$SCRATCH_DIR\gcp_prod_key.json" --iam-account="github-deployer@$PROD_PROJECT.iam.gserviceaccount.com"

Write-Host "✅ Setup Complete!" -ForegroundColor Cyan
Write-Host "Keys are located in: $SCRATCH_DIR"
Write-Host "1. gcp_dev_key.json"
Write-Host "2. gcp_prod_key.json"
