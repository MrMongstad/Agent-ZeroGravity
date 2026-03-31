import os
import json
import hashlib
from datetime import datetime
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_embedding(text):
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return _fallback_embedding(text, "Missing GEMINI_API_KEY")

    try:
        client = genai.Client(api_key=gemini_key)
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=text,
            config={"task_type": "RETRIEVAL_QUERY"}
        )
        return result.embeddings[0].values
    except Exception as e:
        return _fallback_embedding(text, str(e))

def _fallback_embedding(text, reason):
    print(f"SDK Warning: Falling back to local hash embedding ({reason})")
    h = hashlib.sha256(text.encode()).digest()
    base_vec = [float(b) / 255.0 for b in h]
    return (base_vec * (768 // len(base_vec) + 1))[:768]

def check_cache(task_description):
    pinecone_key = os.getenv("PINECONE_API_KEY")
    if not pinecone_key:
        print("ERROR: Missing PINECONE_API_KEY. Cache check disabled.")
        return False, None

    embedding = get_embedding(task_description)
    
    try:
        from pinecone import Pinecone
        pc = Pinecone(api_key=pinecone_key)
        index_name = "antigravity-tasks"
        index = pc.Index(index_name)
        
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
            task_id = hashlib.md5(task_description.encode()).hexdigest()
            index.upsert(vectors=[{
                "id": task_id,
                "values": embedding,
                "metadata": {"description": task_description, "timestamp": str(datetime.now())}
            }])
            print(f"NEW_TASK_CACHED: {task_id}")

        _log_sentinel(task_description, match_found, task_id, results.matches[0].score if results.matches else 0.0)
        return match_found, task_id
    except Exception as e:
        print(f"Cache Warning: Pinecone connection failed ({e}). Proceeding without cache.")
        return False, None

def _log_sentinel(task_description, match_found, task_id, score):
    log_dir = "workspace/memory/logs/vault"
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, f"sentinel_{datetime.now().strftime('%Y-%m-%d')}.jsonl")
    
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "task_description": task_description,
        "match": match_found,
        "task_id": task_id,
        "score": float(score)
    }
    
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        description = " ".join(sys.argv[1:])
        check_cache(description)
    else:
        print("Usage: python cache_check.py 'task description'")
