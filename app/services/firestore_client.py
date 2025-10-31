# services/firestore_client.py
import os
import json
from google.cloud import firestore
from google.oauth2 import service_account

def get_firestore_client():
    """
    Returns a Firestore client using explicit service account credentials.
    Mirrors your Node.js setup exactly.
    """
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    client_email = os.getenv("GCP_CLIENT_EMAIL")
    private_key = os.getenv("GCP_PRIVATE_KEY")

    if not all([project_id, client_email, private_key]):
        raise ValueError("Missing one or more Firestore environment variables.")

    # Fix escaped newlines in private key (same as Node.js)
    private_key = private_key.replace("\\n", "\n").replace("\r", "").strip()

    credentials_dict = {
        "type": "service_account",
        "project_id": project_id,
        "private_key": private_key,
        "client_email": client_email,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email}",
    }

    creds = service_account.Credentials.from_service_account_info(credentials_dict)

    # Important: specify databaseId to match Node
    return firestore.Client(project=project_id, database=os.getenv("GCP_FIRESTORE_DB", "(default)"), credentials=creds)
