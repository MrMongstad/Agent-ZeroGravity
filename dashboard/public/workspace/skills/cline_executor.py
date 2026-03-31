import os
import json
import subprocess
import hashlib
from datetime import datetime, timezone
from google import genai
from google.genai import types
from dotenv import load_dotenv

# ─── Config ──────────────────────────────────────────────────────────────────
load_dotenv('.env', override=True)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
MODEL_ID       = 'gemini-2.0-flash'
VORTEX_PATH    = 'workspace/comms/vortex_state.json'
OUTBOX_PATH    = 'workspace/comms/cline_outbox.json'
LOG_DIR        = 'workspace/memory/logs/vault'
WORKSPACE_ROOT = os.path.abspath('.')
MAX_TURNS      = 10

client = genai.Client(api_key=GEMINI_API_KEY)

# ─── Tool Definitions (SDK Native) ───────────────────────────────────────────
def read_file(path: str) -> str:
    """Read the contents of a file relative to the workspace root."""
    try:
        full_path = os.path.join(WORKSPACE_ROOT, path)
        if not os.path.exists(full_path):
            return f"ERROR: File not found: {path}"
        with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()[:8000]
    except Exception as e:
        return f"ERROR: {str(e)}"

def write_file(path: str, content: str, append: bool = False) -> str:
    """Write content to a file. Creates parent dirs if needed."""
    try:
        full_path = os.path.join(WORKSPACE_ROOT, path)
        os.makedirs(os.path.dirname(full_path) or '.', exist_ok=True)
        mode = 'a' if append else 'w'
        with open(full_path, mode, encoding='utf-8') as f:
            f.write(content)
        return f"OK: Written to {path}"
    except Exception as e:
        return f"ERROR: {str(e)}"

def run_command(command: str, timeout: int = 30) -> str:
    """Run a shell command in the workspace root. Returns stdout + stderr."""
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True,
            cwd=WORKSPACE_ROOT, timeout=timeout
        )
        return (result.stdout + result.stderr)[:4000] or "(no output)"
    except subprocess.TimeoutExpired:
        return "ERROR: Command timed out."
    except Exception as e:
        return f"ERROR: {str(e)}"

def list_directory(path: str) -> str:
    """List files in a directory relative to the workspace root."""
    try:
        full_path = os.path.join(WORKSPACE_ROOT, path)
        if not os.path.exists(full_path):
            return f"ERROR: Directory not found: {path}"
        return "\n".join(os.listdir(full_path))
    except Exception as e:
        return f"ERROR: {str(e)}"

# ─── Execution Logic ─────────────────────────────────────────────────────────
def execute_task(task_content: str, conv_id: str) -> dict:
    system_instruction = (
        "You are CLINE — Tier-2 Autonomous Execution Specialist in the Antigravity Digital Empire. "
        "JARVIS has dispatched a task. Execute it using your tools. Rules: "
        "Read files before writing (Read-Before-Write). All paths are relative to workspace root. "
        "When done, output a concise completion summary. Never ask questions — execute or report failure."
    )

    try:
        # Using automatic tool calling
        chat = client.chats.create(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=[read_file, write_file, run_command, list_directory],
                automatic_function_calling=types.AutomaticFunctionCallingConfig(
                    disable=False,
                    max_remote_calls=MAX_TURNS
                )
            )
        )

        response = chat.send_message(task_content)
        
        # Extract tool usage stats from the chat history if needed
        # For now, we'll just get the final text
        final_text = response.text
        
        # Log tool usage (simplified for SDK)
        tool_log = []
        for msg in chat.list_messages():
            if msg.role == 'model' and msg.parts:
                for part in msg.parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        tool_log.append({
                            "tool": part.function_call.name,
                            "args": part.function_call.args
                        })

        return {
            "status": "COMPLETE",
            "conv_id": conv_id,
            "model": MODEL_ID,
            "rounds": len(chat.list_messages()) // 2,
            "tool_calls": len(tool_log),
            "tool_log": tool_log,
            "output": final_text.strip()
        }

    except Exception as e:
        return {
            "status": "ERROR",
            "conv_id": conv_id,
            "model": MODEL_ID,
            "rounds": 0,
            "tool_calls": 0,
            "tool_log": [],
            "output": f"SDK ERROR: {str(e)}"
        }

# ─── Integrations (Same as legacy) ──────────────────────────────────────────
def write_result_to_vortex(conv_id: str, result: dict):
    try:
        with open(VORTEX_PATH, 'r', encoding='utf-8-sig') as f:
            vortex = json.load(f)

        conv = vortex.get('active_conversations', {}).get(conv_id, {"history": []})
        conv['history'].append({
            "sender": "cline",
            "recipient": "jarvis",
            "type": "STATUS",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": result["status"],
            "tool_calls": result["tool_calls"],
            "rounds": result["rounds"],
            "content": result["output"]
        })
        vortex['active_conversations'][conv_id] = conv
        vortex['last_updated'] = datetime.now(timezone.utc).isoformat()

        with open(VORTEX_PATH, 'w', encoding='utf-8') as f:
            json.dump(vortex, f, indent=2)

        done_dir = 'workspace/comms/queue'
        os.makedirs(done_dir, exist_ok=True)
        task_id = hashlib.md5(conv_id.encode()).hexdigest()
        with open(os.path.join(done_dir, f"{task_id}.done"), 'w') as f:
            json.dump({"conv_id": conv_id, "status": result["status"],
                       "summary": result["output"][:500]}, f, indent=2)

        with open(OUTBOX_PATH, 'w', encoding='utf-8') as f:
            json.dump({
                "conv_id": conv_id,
                "sender": "cline",
                "recipient": "jarvis",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": result["status"],
                "tool_calls": result["tool_calls"],
                "content": result["output"]
            }, f, indent=2)

    except Exception as e:
        print(f"[ERROR] Failed to write result to vortex: {e}")

def log_sentinel(event_type: str, details: str):
    today = datetime.now().strftime("%Y-%m-%d")
    os.makedirs(LOG_DIR, exist_ok=True)
    log_file = os.path.join(LOG_DIR, f"sentinel_{today}.jsonl")
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event": event_type,
            "agent": "cline_executor",
            "details": details
        }) + "\n")

def run(conv_id: str, task_content: str):
    print(f"\n[CLINE] Task received from JARVIS | Conv: {conv_id}")
    log_sentinel("TASK_START", f"conv={conv_id} task={task_content[:100]}")
    result = execute_task(task_content, conv_id)
    write_result_to_vortex(conv_id, result)
    log_sentinel("TASK_COMPLETE", f"conv={conv_id} tools={result['tool_calls']}")
    print(f"[CLINE] Complete. {result['tool_calls']} tool calls.")
    return result

if __name__ == '__main__':
    import sys
    target_conv = sys.argv[1] if len(sys.argv) > 1 else 'A2A_LIVE_TEST_001'
    try:
        with open(VORTEX_PATH, 'r', encoding='utf-8-sig') as f:
            vortex = json.load(f)
        conv = vortex.get('active_conversations', {}).get(target_conv)
        if conv:
            directives = [m for m in conv.get('history', []) if m['sender'] == 'jarvis']
            if directives:
                run(target_conv, directives[-1]['content'])
    except Exception as e:
        print(f"Error in direct run: {e}")
