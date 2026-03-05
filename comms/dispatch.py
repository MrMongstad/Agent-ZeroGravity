"""
Antigravity → Agent Zero Dispatcher
────────────────────────────────────
Sends a message to Agent Zero's REST API at localhost:5000.
Used by Antigravity to delegate tasks to Agent Zero.

Usage (from terminal):
  python dispatch.py "Your task message here"
  python dispatch.py --file task.md
"""

import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

A0_TOKEN = "NvCmoB_r-bV9A-35" # Corrected from 'antigravity'
A0_URL = "http://localhost:5000"
MAILBOX_PATH = r"C:\Users\steph\Desktop\Antigravity & Agent 0\comms\mailbox.json"


def check_health() -> bool:
    """Check if Agent Zero is running."""
    try:
        r = urllib.request.urlopen(f"{A0_URL}/health", timeout=5)
        return r.status == 200
    except Exception:
        return False


def send_message(message: str, context_id: str = "") -> dict:
    """Send a message to Agent Zero via its REST API."""
    payload = json.dumps({
        "message": message,
        "context_id": context_id,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{A0_URL}/api_message",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-API-KEY": A0_TOKEN
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            result = json.loads(resp.read().decode())
            return result
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}: {e.read().decode()[:500]}"}
    except Exception as e:
        return {"error": str(e)}


def log_to_mailbox(direction: str, message: str, result: dict | None = None):
    """Append an entry to the shared mailbox log."""
    try:
        with open(MAILBOX_PATH, "r", encoding="utf-8") as f:
            mailbox = json.load(f)

        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "direction": direction,
            "message": message[:500],
            "result": str(result)[:500] if result else None,
        }
        mailbox["log"].append(entry)

        # Keep log trimmed to last 50 entries
        mailbox["log"] = mailbox["log"][-50:]

        with open(MAILBOX_PATH, "w", encoding="utf-8") as f:
            json.dump(mailbox, f, indent=2, ensure_ascii=False)
    except Exception:
        pass  # Non-critical


def main():
    if len(sys.argv) < 2:
        print("Usage: python dispatch.py \"Your message here\"")
        print("       python dispatch.py --file path/to/task.md")
        sys.exit(1)

    if sys.argv[1] == "--file":
        with open(sys.argv[2], "r", encoding="utf-8") as f:
            message = f.read()
    else:
        message = " ".join(sys.argv[1:])

    print(f"[Dispatch] Checking Agent Zero health...")
    if not check_health():
        print("[Dispatch] Agent Zero is NOT running. Start it first.")
        sys.exit(1)

    print(f"[Dispatch] Sending to Agent Zero...")
    print(f"[Dispatch] Message: {message[:100]}...")

    log_to_mailbox("antigravity→a0", message)
    result = send_message(message)

    if "error" in result:
        print(f"[Dispatch] ERROR: {result['error']}")
    else:
        print(f"[Dispatch] Response: {str(result.get('response', 'no response'))[:500]}")
        log_to_mailbox("a0→antigravity", message, result)

    return result


if __name__ == "__main__":
    main()
