import os
import json
from google.cloud import firestore
from google.oauth2 import service_account


def get_firestore_client():
    """
    Returns a Firestore client using a JSON string stored in
    GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON.
    Mirrors the JS logic: trims junk, cleans escaped newlines,
    and initializes Firestore.
    """
    creds_raw = os.getenv("GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON")

    if not creds_raw:
        raise ValueError("Missing GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON in environment.")

    # Trim whitespace and extra characters
    creds_raw = creds_raw.strip()

    # Handle accidental trailing \n or extra quotes
    if creds_raw.endswith("\\n") or creds_raw.endswith('"'):
        creds_raw = creds_raw.rstrip('"').rstrip("\\n")

    # Normalize line endings and escaped sequences
    normalized_json = creds_raw.replace("\r", "")

    # Try parsing
    try:
        credentials_dict = json.loads(normalized_json)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON: {str(e)}")

    # Build credentials and Firestore client
    creds = service_account.Credentials.from_service_account_info(credentials_dict)

    project_id = credentials_dict.get("project_id")
    database_id = os.getenv("GOOGLE_CLOUD_FIRESTORE_DB", "(default)")

    try:
        client = firestore.Client(
            project=project_id,
            credentials=creds,
            database=database_id,
        )
        print("[firebaseAdmin] Firestore initialized successfully")
        return client
    except Exception as e:
        print("[firebaseAdmin] Failed to initialize Firestore:", e)
        raise
