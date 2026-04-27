# NorCast Deployment Makefile
# ===========================

SERVICE_NAME = norcast-planner
REGION = europe-west1
DEV_PROJECT = norcast-dev-sm-20260426
PROD_PROJECT = norcast-prod-sm-20260426

.PHONY: build deploy-dev deploy-prod help

help:
	@echo "Available commands:"
	@echo "  make deploy-dev   - Build and deploy to Development"
	@echo "  make deploy-prod  - Build and deploy to Production"

# Helper to ensure we are in the right project
set-dev:
	gcloud config set project $(DEV_PROJECT)

set-prod:
	gcloud config set project $(PROD_PROJECT)

# Unified Deployment Logic
# We use Cloud Build to build and push to Artifact Registry in one go.
deploy-dev: set-dev
	gcloud builds submit --tag gcr.io/$(DEV_PROJECT)/$(SERVICE_NAME) .
	gcloud run deploy $(SERVICE_NAME) \
		--image gcr.io/$(DEV_PROJECT)/$(SERVICE_NAME) \
		--platform managed \
		--region $(REGION) \
		--allow-unauthenticated

deploy-prod: set-prod
	gcloud builds submit --tag gcr.io/$(PROD_PROJECT)/$(SERVICE_NAME) .
	gcloud run deploy $(SERVICE_NAME) \
		--image gcr.io/$(PROD_PROJECT)/$(SERVICE_NAME) \
		--platform managed \
		--region $(REGION) \
		--allow-unauthenticated
