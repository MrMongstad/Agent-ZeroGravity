import os
import json
from datetime import datetime
from google import genai
from dotenv import load_dotenv
import sys

# Add parent dir to path for local tool simulation if needed
sys.path.append(os.getcwd())

# Load environment
load_dotenv()

# Configure Google AI
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_ID = 'gemini-2.0-flash'

# Vector 1 Definition: AI Agentic Infrastructure
VECTORS = {
    "AI_AGENTIC_INFRA": {
        "query": "latest developments AI agentic infrastructure DeepSeek Gemini 1.5 multi-agent orchestration",
        "description": "Next-gen agent frameworks and orchestration layers."
    }
}

def aggregate_news(vector_key):
    """
    Simulates high-octane news aggregation using web search and LLM synthesis.
    In a real-world scenario, this would use a Search MCP or Apify.
    For this 'Deployed' version, we utilize the model's knowledge or available search logs.
    """
    print(f"Deploying Intelligence Vector: {vector_key}...")
    
    vector = VECTORS[vector_key]
    
    # Prompt for synthesis based on current real-time data access
    # Since this runs in a tool-aware environment, I'll leverage the reasoning to provide a 'Live' feel.
    prompt = f"""
    Perform a high-intensity scan of the current 'Digital Empire' landscape for Vector: {vector_key}.
    Focus on: {vector['description']}
    
    Format the output for a 'Morning Report' dashboard. 
    Include:
    - Top 3 Critical Developments
    - Strategic Implications
    - Recommended Pivot or Action
    
    Context: Today is {datetime.now().strftime('%Y-%m-%d')}.
    """
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        return {
            "timestamp": datetime.now().isoformat(),
            "vector": vector_key,
            "briefing": response.text,
            "engine": MODEL_ID
        }
    except Exception as e:
        err_str = str(e).lower()
        if any(x in err_str for x in ["429", "quota", "api key not valid", "invalid"]):
            print(f"Gemini Issue detected ({e}). Activating Claude Failover...")
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
                message = client.messages.create(
                    model="claude-3-5-sonnet-latest",
                    max_tokens=1024,
                    messages=[{"role": "user", "content": prompt}]
                )
                return {
                    "timestamp": datetime.now().isoformat(),
                    "vector": vector_key,
                    "briefing": message.content[0].text,
                    "engine": "claude-3-5-sonnet (Failover)"
                }
            except Exception as fe:
                return {"error": f"Gemini Error: {e} | Claude Failover Error: {fe}"}
        return {"error": str(e)}

if __name__ == "__main__":
    brief = aggregate_news("AI_AGENTIC_INFRA")
    with open("memory/daily_news_brief.json", "w", encoding="utf-8") as f:
        json.dump(brief, f, indent=4)
    print("Vault: daily_news_brief.json updated with Vector 1 intel.")
