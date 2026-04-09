import os
import json
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv('.env', override=True)
API_KEY = os.environ.get('GEMINI_API_KEY')

CONV_ID = 'A2A_LIVE_TEST_001'

def ask_specialist(prompt):
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}'
    headers = {'Content-Type': 'application/json'}
    payload = {
        'contents': [{
            'parts': [{
                'text': (
                    'SYSTEM: You are CLINE, Tier-2 Coding Specialist in the Antigravity Digital Empire. '
                    'JARVIS (Primary Controller) has dispatched a task directive. '
                    'Respond with clean, production-ready Python code only. No preamble.\n\n'
                    f'JARVIS DIRECTIVE: {prompt}'
                )
            }]
        }]
    }
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    if 'candidates' in data:
        return data['candidates'][0]['content']['parts'][0]['text']
    return f'ERROR: {json.dumps(data)}'

if __name__ == '__main__':
    print(f'[JARVIS→CLINE] Reading vortex for conv: {CONV_ID}')
    
    with open('workspace/comms/vortex_state.json', 'r', encoding='utf-8-sig') as f:
        vortex = json.load(f)

    conv = vortex.get('active_conversations', {}).get(CONV_ID, {})
    directives = [d for d in conv.get('history', []) if d['sender'] == 'jarvis']
    
    if not directives:
        print('[ERROR] No JARVIS directives found in vortex.')
        exit(1)

    latest = directives[-1]
    print(f'[JARVIS→CLINE] Task received. Calling Gemini...')
    answer = ask_specialist(latest['content'])

    # Write response back to vortex
    conv['history'].append({
        'sender': 'cline',
        'recipient': 'jarvis',
        'type': 'RESPONSE',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'content': answer
    })
    vortex['active_conversations'][CONV_ID] = conv
    vortex['last_updated'] = datetime.now(timezone.utc).isoformat()

    with open('workspace/comms/vortex_state.json', 'w', encoding='utf-8') as f:
        json.dump(vortex, f, indent=2)

    # Also write to outbox
    outbox = {
        'conv_id': CONV_ID,
        'sender': 'cline',
        'recipient': 'jarvis',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'content': answer
    }
    with open('workspace/comms/cline_outbox.json', 'w', encoding='utf-8') as f:
        json.dump(outbox, f, indent=2)

    print(f'\n[CLINE→JARVIS] Response written to vortex + outbox.')
    print(f'\n{"="*60}\nCLINE OUTPUT:\n{"="*60}')
    print(answer)
    print(f'{"="*60}')
