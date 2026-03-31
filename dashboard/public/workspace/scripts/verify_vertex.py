import os
from google.cloud import aiplatform
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

project_id = os.getenv("VERTEX_AI_PROJECT_ID")
location = os.getenv("VERTEX_AI_LOCATION")

print(f"Initializing Vertex AI for project: {project_id} in {location}...")

try:
    aiplatform.init(project=project_id, location=location)
    print("✅ Vertex AI initialized successfully.")
    
    # Try to list models (this confirms API access and permissions)
    # Note: This might fail if the service account doesn't have the broad 'Viewer' or 'Vertex AI User' role,
    # but the initialization itself is a good first step.
    print("Testing API connectivity (listing models)...")
    # Using a simple check that doesn't consume many tokens/resources
    models = aiplatform.Model.list(filter='display_name="gemini-1.5-pro"')
    print(f"✅ Found {len(models)} Gemini 1.5 Pro instances (or access verified).")
    
except Exception as e:
    print(f"❌ Error verifying Vertex AI: {str(e)}")
    # If it fails due to ADC, we can suggest running 'gcloud auth application-default login'
    if "RefreshError" in str(e) or "Default Credentials" in str(e):
        print("💡 Suggestion: Run 'gcloud auth application-default login' to sync local credentials.")
