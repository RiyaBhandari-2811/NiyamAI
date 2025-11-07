import os
import json
from google.cloud import firestore
from google.oauth2 import service_account


def get_firestore_client():
    """
    Returns a Firestore client using a full service account JSON
    stored as an environment variable (GOOGLE_APPLICATION_CREDENTIALS_JSON).
    This mirrors Node.js behavior with a single JSON env.
    """
    creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

    if not creds_json:
        raise ValueError("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON in environment.")

    # Parse the JSON string into a dictionary
    try:
        credentials_dict = json.loads(creds_json)
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format in GOOGLE_APPLICATION_CREDENTIALS_JSON.")

    creds = service_account.Credentials.from_service_account_info(credentials_dict)

    return firestore.Client(
        project=credentials_dict["project_id"],
        database=os.getenv("GOOGLE_CLOUD_FIRESTORE_DB"),
        credentials=creds,
    )
