import os
import requests
import json
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

class SupabaseClient:
    def __init__(self):
        self.url = SUPABASE_URL
        self.key = SUPABASE_SERVICE_ROLE_KEY
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def get_conversations(self):
        """Fetches active conversations from Supabase."""
        response = requests.get(f"{self.url}/rest/v1/conversations?status=eq.OPEN", headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return []

    def get_history(self, conversation_id):
        """Fetches message history for a conversation."""
        response = requests.get(
            f"{self.url}/rest/v1/messages?conversation_id=eq.{conversation_id}&order=timestamp.asc",
            headers=self.headers
        )
        if response.status_code == 200:
            return response.json()
        return []

    def push_message(self, conversation_id, sender, msg_type, content):
        """Pushes a new message to Supabase."""
        data = {
            "conversation_id": conversation_id,
            "sender": sender,
            "type": msg_type,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        response = requests.post(f"{self.url}/rest/v1/messages", headers=self.headers, json=data)
        return response.status_code in [200, 201]

    def update_conversation_status(self, conversation_id, status):
        """Updates the status of a conversation."""
        data = {"status": status, "last_update": datetime.now(timezone.utc).isoformat()}
        response = requests.patch(
            f"{self.url}/rest/v1/conversations?id=eq.{conversation_id}",
            headers=self.headers,
            json=data
        )
        return response.status_code in [200, 204]

    def upsert_conversation(self, conversation_id, participants, status="OPEN"):
        """Upserts a conversation record."""
        data = {
            "id": conversation_id,
            "participants": participants,
            "status": status,
            "last_update": datetime.now(timezone.utc).isoformat()
        }
        # Using upsert logic via Prefer header
        headers = self.headers.copy()
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        response = requests.post(f"{self.url}/rest/v1/conversations", headers=headers, json=data)
        return response.status_code in [200, 201]
