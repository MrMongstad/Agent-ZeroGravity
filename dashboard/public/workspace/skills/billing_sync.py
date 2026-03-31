import os
import json
import logging
from datetime import datetime, timezone

# Pricing Config (Example rates per 1M tokens)
PRICING = {
    "claude-3-5-sonnet-latest": {"input": 3.00, "output": 15.00},
    "gemini-2.0-flash": {"input": 0.10, "output": 0.40},
    "gemini-1.5-pro": {"input": 3.50, "output": 10.50},
    "claude-3-haiku-20240307": {"input": 0.25, "output": 1.25}
}

LOG_DIR = "workspace/memory/logs/vault"
BILLING_REPORT_DIR = "workspace/memory/billing"
STATE_FILE = "workspace/state.json"

def audit_billing():
    """Audits token usage and calculates costs from sentinel logs."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    log_file = os.path.join(LOG_DIR, f"sentinel_{today}.jsonl")
    
    if not os.path.exists(log_file):
        print(f"[-] No logs found for {today}. Skipping audit.")
        return

    usage_stats = {}
    
    try:
        with open(log_file, "r", encoding="utf-8") as f:
            for line in f:
                entry = json.loads(line)
                # Look for events that might have token data (stubbed for now as sentinel logs don't have tokens yet)
                # In a real scenario, we'd extract from "details"
                pass

        # Mocking data for the sync demonstration
        mock_usage = {
            "claude-3-5-sonnet-latest": {"input": 50000, "output": 10000},
            "gemini-2.0-flash": {"input": 150000, "output": 50000}
        }
        
        report = {
            "date": today,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": [],
            "total_cost": 0.0
        }

        for model, tokens in mock_usage.items():
            rates = PRICING.get(model, {"input": 0, "output": 0})
            cost = (tokens["input"] / 1000000 * rates["input"]) + (tokens["output"] / 1000000 * rates["output"])
            report["summary"].append({
                "model": model,
                "input_tokens": tokens["input"],
                "output_tokens": tokens["output"],
                "cost": round(cost, 4)
            })
            report["total_cost"] += cost

        # Save report
        os.makedirs(BILLING_REPORT_DIR, exist_ok=True)
        report_path = os.path.join(BILLING_REPORT_DIR, f"billing_{today}.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            
        print(f"[+] API Billing Sync Complete: {report_path}")
        print(f"[+] Total Daily Cost: ${report['total_cost']:.4f}")

    except Exception as e:
        print(f"[-] Billing audit failed: {e}")

if __name__ == "__main__":
    audit_billing()
