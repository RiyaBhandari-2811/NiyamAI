import requests
from tools.jira_token_manager import JiraTokenManager


class JiraRestTool:
    """
    JiraRestTool provides authenticated access to Jira Cloud REST APIs.
    It retrieves encrypted credentials via JiraTokenManager, decrypts them,
    and handles token-based authorization for API calls.
    """

    def __init__(self, collection="users", doc_id=None):
        print(
            f"[DEBUG] Initializing JiraRestTool with collection={collection}, doc_id={doc_id}"
        )
        self.manager = JiraTokenManager(collection=collection, doc_id=doc_id)
        self.ctx = self.manager.get_jira_context()
        print("[DEBUG] Jira context loaded successfully.")
        print(f"[DEBUG] Context keys: {list(self.ctx.keys())}")

        # Ensure headers have Bearer prefix
        access_token = self.ctx.get("access_token")
        if not access_token:
            raise Exception("[ERROR] Missing access token in Jira context")

        self.ctx["headers"] = {
            "Authorization": f"Bearer {access_token.strip()}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    # ---------------------------------------------------------------------
    # List Jira Projects
    # ---------------------------------------------------------------------
    def list_projects(self):
        url = f"{self.ctx['api_base']}/{self.ctx['cloud_id']}/rest/api/3/project/search"
        print(f"[DEBUG] Listing projects from URL: {url}")
        print(
            f"[DEBUG] Headers: {{'Authorization': 'Bearer ***', 'Accept': 'application/json'}}"
        )

        res = requests.get(url, headers=self.ctx["headers"])

        print(f"[DEBUG] Response Status: {res.status_code}")
        print(f"[DEBUG] Response Text: {res.text[:400]}")

        if res.status_code == 401:
            raise Exception("Unauthorized: Access token may be invalid or expired.")
        if res.status_code != 200:
            raise Exception(f"Failed to list projects: {res.text}")

        data = res.json()
        values = data.get("values", [])
        print(f"[DEBUG] Total projects fetched: {len(values)}")
        return values

    # ---------------------------------------------------------------------
    # Create Jira Issue
    # ---------------------------------------------------------------------
    def create_issue(self, project_key, summary, description, issue_type="Task"):
        url = f"{self.ctx['api_base']}/{self.ctx['cloud_id']}/rest/api/3/issue"
        payload = {
            "fields": {
                "project": {"key": project_key},
                "summary": summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": description}],
                        }
                    ],
                },
                "issuetype": {"name": issue_type},
            }
        }
        print(f"[DEBUG] Creating issue at URL: {url}")
        print(f"[DEBUG] Payload: {payload}")
        res = requests.post(url, json=payload, headers=self.ctx["headers"])
        print(f"[DEBUG] Response Status: {res.status_code}")
        print(f"[DEBUG] Response Text: {res.text[:400]}")
        if res.status_code == 401:
            raise Exception("Unauthorized: Access token may be invalid or expired.")
        if res.status_code != 201:
            raise Exception(f"Failed to create issue: {res.text}")
        print("[DEBUG] Issue created successfully.")
        return res.json()

    # ---------------------------------------------------------------------
    # Get Jira Issue by Key
    # ---------------------------------------------------------------------
    def get_issue(self, issue_key):
        url = f"{self.ctx['api_base']}/{self.ctx['cloud_id']}/rest/api/3/issue/{issue_key}"
        print(f"[DEBUG] Fetching issue details for {issue_key}")
        print(f"[DEBUG] URL: {url}")

        res = requests.get(url, headers=self.ctx["headers"])
        print(f"[DEBUG] Response Status: {res.status_code}")
        print(f"[DEBUG] Response Text: {res.text[:400]}")

        if res.status_code == 401:
            raise Exception("Unauthorized: Access token may be invalid or expired.")
        if res.status_code != 200:
            raise Exception(f"Failed to fetch issue: {res.text}")

        print(f"[DEBUG] Issue {issue_key} fetched successfully.")
        return res.json()
