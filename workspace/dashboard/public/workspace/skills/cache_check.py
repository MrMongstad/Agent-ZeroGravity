import os
import json
import hashlib
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not PINECONE_API_KEY or not GEMINI_API_KEY:
    print("ERROR: Missing PINECONE_API_KEY or GEMINI_API_KEY in .env")
    exit(1)

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
INDEX_NAME = "antigravity-tasks"

# Ensure index exists
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=768, # Dimension for models/text-embedding-004
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(INDEX_NAME)

# Initialize Gemini for embeddings
genai.configure(api_key=GEMINI_API_KEY)

def get_embedding(text):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']

def check_cache(task_description):
    embedding = get_embedding(task_description)
    
    # Query Pinecone
    results = index.query(
        vector=embedding,
        top_k=1,
        include_metadata=True
    )
    
    match_found = False
    task_id = None
    
    if results.matches and results.matches[0].score > 0.95:
        match_found = True
        task_id = results.matches[0].id
        print(f"MATCH: {task_id}")
    else:
        # No match, add to cache (simplification: using hash of description as ID)
        task_id = hashlib.md5(task_description.encode()).hexdigest()
        index.upsert(vectors=[{
            "id": task_id,
            "values": embedding,
            "metadata": {"description": task_description, "timestamp": str(datetime.now())}
        }])
        print(f"NEW_TASK_CACHED: {task_id}")

    # Log result
    log_dir = "workspace/memory/logs/vault"
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, f"sentinel_{datetime.now().strftime('%Y-%m-%d')}.jsonl")
    
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "task_description": task_description,
        "match": match_found,
        "task_id": task_id,
        "score": float(results.matches[0].score) if results.matches else 0.0
    }
    
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
        
    return match_found, task_id

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        description = " ".join(sys.argv[1:])
        check_cache(description)
    else:
        print("Usage: python cache_check.py 'task description'")
