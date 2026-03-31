import os
import json
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timedelta
from google import genai
from dotenv import load_dotenv

# Load environment
load_dotenv()

# Configure Google AI
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_ID = 'gemini-2.0-flash'

def get_emails(user, password, host, folder="INBOX", limit=5):
    """Fetches and parses recent unread emails."""
    reports = []
    try:
        mail = imaplib.IMAP4_SSL(host)
        mail.login(user, password)
        mail.select(folder)
        
        # Search for unread emails from the last 24 hours
        date = (datetime.now() - timedelta(days=1)).strftime("%d-%b-%Y")
        _, search_data = mail.search(None, f'(UNSEEN SINCE {date})')
        
        ids = search_data[0].split()
        for i in ids[-limit:]: # Get the latest N
            _, data = mail.fetch(i, "(RFC822)")
            raw_email = data[0][1]
            msg = email.message_from_bytes(raw_email)
            
            subject, encoding = decode_header(msg["Subject"])[0]
            if isinstance(subject, bytes):
                subject = subject.decode(encoding if encoding else "utf-8")
            
            sender = msg.get("From")
            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain":
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = msg.get_payload(decode=True).decode()
            
            reports.append({
                "from": sender,
                "subject": subject,
                "body_snippet": body[:500] # Snippet for LLM
            })
            
        mail.logout()
    except Exception as e:
        print(f"Error fetching emails for {user}: {e}")
    return reports

def summarize_intel(items, context_type="Emails"):
    """Uses Gemini to summarize the gathered intel."""
    if not items:
        return f"No new {context_type} to report."
        
    prompt = f"Summarize the following {context_type} into a high-octane morning briefing for the Architect. Focus on actionable items and critical alerts. Keep it concise (max 3-5 bullets).\n\nData:\n{json.dumps(items, indent=2)}"
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Summary failed: {e}"

def audit_all_accounts():
    print("Starting Imperial Email Audit...")
    results = {}
    
    # Audit Personal
    personal = get_emails(
        os.getenv("IMAP_USER_PERSONAL"),
        os.getenv("IMAP_PASS_PERSONAL"),
        os.getenv("IMAP_HOST")
    )
    results["personal"] = summarize_intel(personal, "Personal Emails")
    
    # Audit Business
    business = get_emails(
        os.getenv("IMAP_USER_BUSINESS"),
        os.getenv("IMAP_PASS_BUSINESS"),
        os.getenv("IMAP_HOST")
    )
    results["business"] = summarize_intel(business, "Business Emails")
    
    return results

if __name__ == "__main__":
    audit = audit_all_accounts()
    with open("memory/daily_email_brief.json", "w", encoding="utf-8") as f:
        json.dump(audit, f, indent=4)
    print("Vault: daily_email_brief.json updated.")
