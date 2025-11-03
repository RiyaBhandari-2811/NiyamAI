import requests
import time
import os
from dotenv import load_dotenv
from ..tools.firestore_decrypt_tool import FirestoreDecryptTool

# Load .env from root/app/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
database_id = os.getenv("GCP_FIRESTORE_DB")
collection_name = "users"


class JiraTokenManager:
    def __init__(self, collection="users", doc_id=None):
        self.collection = collection
        self.doc_id = doc_id
        self.token_url = "https://auth.atlassian.com/oauth/token"
        self.api_base = "https://api.atlassian.com/ex/jira"
        self.firestore_tool = FirestoreDecryptTool()
        self._load_tokens()

        # https://api.atlassian.com/ex/jira/<cloudId>/rest/api/3/<resource-name>

    def _load_tokens(self):
        decrypted_data = self.firestore_tool.run(self.collection, self.doc_id)

        if not decrypted_data:
            print("[DEBUG] No decrypted data returned from Firestore")
            self.access_token = None
            self.refresh_token = None
            self.token_expiry = 0.0
            self.cloud_id = None
            return

        print("[DEBUG] Decrypted keys fetched:", list(decrypted_data.keys()))
        self.access_token = decrypted_data.get("accessToken")
        self.refresh_token = decrypted_data.get("refreshToken")
        self.cloud_id = decrypted_data.get("cloudId") 
        self.scope = decrypted_data.get("scope")

        # Load secrets from env
        self.client_id = os.getenv("NEXT_PUBLIC_ATLASSIAN_CLIENT_ID")
        self.client_secret = os.getenv("ATLASSIAN_CLIENT_SECRET")

        # Parse expiry safely
        try:
            self.token_expiry = float(decrypted_data.get("expiresAt", 0))
            print(f"[DEBUG] token_expiry: {self.token_expiry}")
        except (ValueError, TypeError):
            self.token_expiry = 0.0

    def is_token_valid(self):
        valid = bool(self.access_token and time.time() < self.token_expiry)
        print(f"[DEBUG] Access token valid: {valid}")
        return valid

    def refresh_access_token(self):
        print("[DEBUG] Attempting to refresh Jira access token...")

        if not all([self.refresh_token, self.client_id, self.client_secret]):
            print("[DEBUG] Missing refresh credentials")
            return False

        payload = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": self.refresh_token,
        }

        response = requests.post(self.token_url, json=payload)
        if response.status_code != 200:
            print(f"[DEBUG] Refresh failed: {response.text}")
            return False

        token_data = response.json()
        self.access_token = token_data.get("access_token")
        expires_in = token_data.get("expires_in", 3600)
        self.token_expiry = time.time() + expires_in
        print("[DEBUG] Token refreshed successfully")
        return True

    def get_valid_token(self):
        if self.is_token_valid():
            return self.access_token
        if self.refresh_access_token():
            return self.access_token
        print("[DEBUG] Failed to obtain valid token")
        return None

    def get_jira_context(self):
        """Return all data required for Jira REST API"""
        access_token = self.get_valid_token()
        if not access_token:
            raise Exception("Unable to get valid access token")

        if not self.cloud_id:
            raise Exception("Missing cloudId in Firestore document")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        return {
            "access_token": access_token,
            "cloud_id": self.cloud_id,
            "scope": self.scope,
            "api_base": self.api_base,
            "headers": headers,
        }
