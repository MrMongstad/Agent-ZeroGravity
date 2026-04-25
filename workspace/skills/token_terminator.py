import os
import json
import logging
import sys
import argparse
from datetime import datetime

# Protocol Config
FLAGSHIP_MODELS = ["claude-3-opus", "gemini-1.5-pro", "gemini-2.5-pro", "gpt-4"]
COST_EFFICIENT_MODELS = ["claude-3-haiku", "gemini-1.5-flash", "gemini-2.0-flash", "gpt-3.5-turbo"]

STATE_FILE = "workspace/state.json"

def update_state_status(status_message):
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            state = json.load(f)
        
        state["agent_status"]["cline"] = status_message
        state["last_updated"] = datetime.now().isoformat()
        
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)

def token_terminator_audit(mission_description, active_model, override_budget=False):
    logging.info("Initiating Pre-Task Audit (Token-Terminator)")
    
    # 1. Check Model Tier against standard operations
    if any(m in active_model.lower() for m in FLAGSHIP_MODELS) and not override_budget:
        error_msg = f"PAUSED (BUDGET OVERRIDE NEEDED): Flagship model detected ({active_model}) for standard operation."
        print(f"ERROR: {error_msg}")
        update_state_status(error_msg)
        sys.exit(1)
        
    # 2. Calculate Estimated Tokens (stub for actual tokenizer)
    estimated_input_tokens = len(mission_description.split()) * 1.5
    estimated_output_tokens = estimated_input_tokens * 0.5
    # Dummy calculation based on average pricing
    estimated_cost = (estimated_input_tokens * 0.01 / 1000) + (estimated_output_tokens * 0.03 / 1000)
    
    print(f"Token-Terminator Pass. Model: {active_model}")
    print(f"Estimated Token Burn: Input ~{int(estimated_input_tokens)}, Output ~{int(estimated_output_tokens)}")
    print(f"Estimated Cost: ${estimated_cost:.4f}")
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Token Terminator - Budget Enforcement")
    parser.add_argument("--check", action="store_true", help="Perform pre-task budget check")
    parser.add_argument("--mission", type=str, default="Standard Operation", help="Mission description")
    parser.add_argument("--model", type=str, help="Active model name")
    parser.add_argument("--override", action="store_true", help="Override budget restrictions")
    
    args = parser.parse_args()
    
    logging.basicConfig(level=logging.INFO)
    
    model = args.model or os.environ.get("A0_SET_CHAT_MODEL_NAME") or os.environ.get("PLANNING_MODEL") or os.environ.get("CODING_MODEL") or "unknown"
    
    if args.check:
        token_terminator_audit(args.mission, model, args.override)
        print("Pre-Task Audit Complete. Ready for Execution.")
    else:
        print("Usage: python token_terminator.py --check --mission 'task description'")
