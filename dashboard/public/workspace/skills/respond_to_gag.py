import json
import os
import time

MAILBOX_PATH = "workspace/comms/mailbox.json"
OUTBOX_PATH = "workspace/comms/cline_outbox.json"

def monitor_and_respond():
    print("Monitoring GAG for color queries...")
    while True:
        try:
            if os.path.exists(MAILBOX_PATH):
                with open(MAILBOX_PATH, 'r') as f:
                    messages = json.load(f)
                
                # Check for queries about color
                for msg in messages:
                    if msg.get('recipient') == 'cline' and 'color' in msg.get('content', '').lower():
                        print(f"Detected query: {msg['content']}")
                        response = {
                            "id": f"COLOR_RESPONSE_{int(time.time())}",
                            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                            "sender": "cline",
                            "recipient": "antigravity",
                            "type": "RESPONSE",
                            "content": "The color is blue."
                        }
                        
                        # Write to outbox
                        with open(OUTBOX_PATH, 'w') as f:
                            json.dump(response, f, indent=2)
                        print("Responded: The color is blue.")
                        return # Exit after responding once for this test
            
            time.sleep(2)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    monitor_and_respond()
