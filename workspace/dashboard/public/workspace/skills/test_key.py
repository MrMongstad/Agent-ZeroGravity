import os
import requests
import json

def test_google_api_key():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables.")
        return

    print(f"Testing GOOGLE_API_KEY: {api_key[:5]}...{api_key[-5:]}")
    
    # Try to list models to verify the key
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Success! The API key is valid.")
            models = response.json().get('models', [])
            print(f"Successfully retrieved {len(models)} models.")
            if models:
                print("First few models:")
                for m in models[:5]:
                    print(f" - {m['name']}")
        else:
            print(f"Failed. Status code: {response.status_code}")
            print("Response:", response.text)
            
            # If 404, maybe the endpoint is slightly different or the key has restricted access
            if response.status_code == 404:
                print("\nAttempting alternative 'v1' endpoint...")
                url_v1 = f"https://generativelanguage.googleapis.com/v1/models?key={api_key}"
                response_v1 = requests.get(url_v1)
                print(f"v1 Status code: {response_v1.status_code}")
                print(f"v1 Response: {response_v1.text}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_google_api_key()
