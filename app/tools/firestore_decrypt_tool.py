# tools/firestore_decrypt_tool.py
import json
import os
import base64
from google.cloud import secretmanager
from services.crypto import decrypt_object 
from services.firestore_client import get_firestore_client
from google.oauth2 import service_account
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

class FirestoreDecryptTool:
    name = "FirestoreDecryptTool"
    description = "Fetches encrypted doc from Firestore and decrypts using AES-256-CBC key from Secret Manager"

    creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    print("DEBUG: creds_json loaded:", bool(creds_json)) 
    
    # creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    creds_dict = json.loads(creds_json)
    credentials = service_account.Credentials.from_service_account_info(creds_dict)

    def __init__(self, project_id=None, secret_name="AES256_KEY", credentials=None):
        self.project = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
        print("DEBUG: Using GOOGLE_CLOUD_PROJECT project:", self.project)
        self.secret_name = secret_name
        creds = credentials or self.credentials
        self._sm_client = secretmanager.SecretManagerServiceClient(credentials=creds)
        self._fs_client = get_firestore_client()  

    def _get_key_bytes(self):
        name = f"projects/{self.project}/secrets/{self.secret_name}/versions/latest"
        response = self._sm_client.access_secret_version(request={"name": name})
        secret_data = response.payload.data.decode("utf-8")
        try:
            return base64.b64decode(secret_data)
        except Exception:
            return secret_data.encode("utf-8")

    def fetch_encrypted(self, collection: str, doc_id: str):
        doc_ref = self._fs_client.collection(collection).document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise ValueError(f"Document {collection}/{doc_id} not found")
        data = doc.to_dict()
        print("DEBUG: Full Firestore document:", json.dumps(data, indent=2))
        # Since encrypted fields are nested under "jira"
        jira_data = data.get("jira", {})
        encrypted_b64 = jira_data.get("data")
        iv_b64 = jira_data.get("iv")
        print("DEBUG: Encrypted fetch_encrypted :", encrypted_b64 is not None)
        print("DEBUG: IV fetch_encrypted :", iv_b64 is not None)
        return encrypted_b64, iv_b64

    def run(self, collection: str, doc_id: str):
        encrypted_b64, iv_b64 = self.fetch_encrypted(collection, doc_id)
        print("DEBUG: Encrypted run:", encrypted_b64 is not None)
        print("DEBUG: IV run:", iv_b64 is not None)
        key = self._get_key_bytes()
        print("DEBUG: Key loaded:", bool(key))
        return decrypt_object(encrypted_b64, iv_b64, key)
    
