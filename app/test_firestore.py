# from services.firestore_client import get_firestore_client

# from dotenv import load_dotenv
# load_dotenv()


# def test_firestore_read():
#     try:
#         client = get_firestore_client()
#         print("✅ Firestore client initialized successfully!")

#         # Reference your actual collection
#         users_ref = client.collection("users")

#         # Get all user documents (limit to 5 for testing)
#         docs = users_ref.limit(5).stream()

#         print("\nReading users from Firestore:")
#         found_any = False
#         for doc in docs:
#             found_any = True
#             print(f"- {doc.id}: {doc.to_dict()}")

#         if not found_any:
#             print("⚠️ No user documents found in 'users' collection.")

#     except Exception as e:
#         print("❌ Error reading Firestore:", e)

# if __name__ == "__main__":
#     test_firestore_read()


# app/test_firestore_decrypt.py
# from tools.firestore_decrypt_tool import FirestoreDecryptTool
# import json

# if __name__ == "__main__":
#     collection = "users"
#     doc_id = "137aadf4-84f2-41b8-b569-c63a14b21fb1"  # replace with your test user ID

#     tool = FirestoreDecryptTool()

#     try:
#         decrypted = tool.run(collection, doc_id)
#         print("\n✅ Decrypted Document:")
#         print(json.dumps(decrypted, indent=2))
#     except Exception as e:
#         print("\n❌ Error:", e)


# from tools.jira_token_manager import JiraTokenManager

# if __name__ == "__main__":
#     doc_id = "137aadf4-84f2-41b8-b569-c63a14b21fb1"  # test user ID

#     token_manager = JiraTokenManager(collection="users", doc_id=doc_id)
#     token = token_manager.get_valid_token()

#     if token:
#         print("\n✅ Valid Jira access token available.")
#     else:
#         print("\n❌ Failed to get a valid Jira access token.")


# from tools.jira_connector_tool import JiraConnectorTool

# if __name__ == "__main__":
#     collection = "users"
#     doc_id = "137aadf4-84f2-41b8-b569-c63a14b21fb1"  # replace with your test user id

#     try:
#         jira_tool = JiraConnectorTool(collection=collection, doc_id=doc_id)
#         connector = jira_tool.get_connector()
#         print("\n✅ Connector initialized successfully with fresh access token.")
#     except Exception as e:
#         print("\n❌ Error initializing connector:", e)

# import time
# from tools.jira_token_manager import JiraTokenManager

# tm = JiraTokenManager("users", "137aadf4-84f2-41b8-b569-c63a14b21fb1")
# tokens = tm.get_tokens()
# print("Expires at:", tokens["expiresAt"])
# print("Current time:", int(time.time() * 1000))
# print("Expired?", int(time.time() * 1000) > tokens["expiresAt"])


# from tools.jira_rest_tool import JiraRestTool

# if __name__ == "__main__":
#     collection = "users"
#     doc_id = "2cd3f460-60db-49fd-9044-b08e8cad05bd"  # replace with your Firestore user ID

#     try:
#         jira_tool = JiraRestTool(collection=collection, doc_id=doc_id)
#         projects = jira_tool.list_projects()

#         print("\n✅ Projects fetched successfully:")
#         for project in projects:
#             print(f"- {project['name']} ({project['key']})")

#     except Exception as e:
#         print("\n❌ Error listing projects:", e)

from tools.jira_rest_tool import JiraRestTool

if __name__ == "__main__":
    collection = "users"
    doc_id = "e1d7c978-1d27-4964-898c-10456198a650"  # replace with your Firestore user ID

    try:
        # Initialize Jira REST Tool (this loads credentials + context)
        jira_tool = JiraRestTool(collection=collection, doc_id=doc_id)

        # Project and issue details
        project_key = "SCRUM"  # replace with your actual project key
        summary = "ADK Test Issue via create_issue( RIYAAAAA)"
        description = "This issue was created for testing the ADK Jira integration."
        issue_type = "Story"  # can be Task, Story, Bug, etc.

        # Create the issue
        print("\n[TEST] Creating Jira issue...")
        issue = jira_tool.create_issue(
            project_key=project_key,
            summary=summary,
            description=description,
            issue_type=issue_type,
        )

        print("\n✅ Issue created successfully:")
        print(f"- issue: {issue}")
        print(f"- Key: {issue.get('key')}")
        print(f"- ID: {issue.get('id')}")
        print(f"- URL: {issue.get('self')}")

    except Exception as e:
        print("\n❌ Error creating Jira issue:", e)






