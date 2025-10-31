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
from tools.firestore_decrypt_tool import FirestoreDecryptTool
import json

if __name__ == "__main__":
    collection = "users"
    doc_id = "137aadf4-84f2-41b8-b569-c63a14b21fb1"  # replace with your test user ID

    tool = FirestoreDecryptTool()

    try:
        decrypted = tool.run(collection, doc_id)
        print("\n✅ Decrypted Document:")
        print(json.dumps(decrypted, indent=2))
    except Exception as e:
        print("\n❌ Error:", e)

