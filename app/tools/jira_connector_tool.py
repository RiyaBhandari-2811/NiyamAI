import os
from dotenv import load_dotenv
from app.tools.jira_token_manager import JiraTokenManager
import json
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


class JiraConnectorTool:
    def __init__(self, collection="users", doc_id=None):
        self.token_manager = JiraTokenManager(collection=collection, doc_id=doc_id)
        self.connector = None
        self._init_connector()

    def _get_google_access_token(self):
        creds = service_account.Credentials.from_service_account_info(
            json.loads(os.getenv("GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON"))
        )
        creds = creds.with_scopes(["https://www.googleapis.com/auth/cloud-platform"])
        creds.refresh(Request())
        return creds.token

    def _create_dynamic_connection(self, user_id, access_token, cloud_id):
        print(f"[DEBUG] Creating dynamic Jira connection for {user_id}...")
        project = os.getenv("GOOGLE_CLOUD_PROJECT")
        location = os.getenv("GOOGLE_CLOUD_LOCATION")
        parent = f"projects/{project}/locations/{location}"
        connection_id = f"jira-connection-{user_id}"

        # Use your service account token for GCP
        gcp_token = self._get_google_access_token()
        url = f"https://connectors.googleapis.com/v1/{parent}/connections?connectionId={connection_id}"

        payload = {
            "connectorVersion": f"{parent}/providers/jira/connectorVersions/jira-1",
            "authConfig": {
                "authType": "OAUTH2_JWT_BEARER",
                "oauth2JwtBearer": {"clientKey": "jira", "jwtToken": access_token},
            },
            "destinationConfig": [
                {
                    "key": "instance_url",
                    "value": f"https://api.atlassian.com/ex/jira/{cloud_id}",
                }
            ],
            "description": f"Dynamic Jira connection for {user_id}",
            "labels": {"user": user_id},
        }

        headers = {
            "Authorization": f"Bearer {gcp_token}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, headers=headers, json=payload)
        print(f"[DEBUG] Connection creation response: {response.status_code}")
        print(response.text)

        if response.status_code in [200, 201]:
            print(f"✅ Jira connection {connection_id} created successfully.")
            return connection_id
        elif "already exists" in response.text:
            print(f"[DEBUG] Jira connection {connection_id} already exists.")
            return connection_id
        else:
            raise Exception(f"Failed to create Jira connection: {response.text}")

    def _init_connector(self):
        decrypted_data = self.token_manager.firestore_tool.run(
            self.token_manager.collection, self.token_manager.doc_id
        )
        user_id = self.token_manager.doc_id
        access_token = decrypted_data.get("accessToken")
        cloud_id = decrypted_data.get("cloudId")

        if not access_token or not cloud_id:
            raise ValueError("Missing Jira token or cloudId from Firestore")

        connection_id = self._create_dynamic_connection(user_id, access_token, cloud_id)
        print(f"[DEBUG] Connection ready: {connection_id}")

    def get_connector(self):
        if not self.token_manager.is_token_valid():
            print(
                "[DEBUG] Jira token expired — refreshing and reinitializing connector..."
            )
            self._init_connector()
        return f"jira-connection-{self.token_manager.doc_id}"
        # Ensure token is valid before returning connector
        if not self.token_manager.is_token_valid():
            print(
                "[DEBUG] Jira token expired — refreshing and reinitializing connector..."
            )
            self._init_connector()
        return self.connector
