# from google.cloud import firestore

# def get_firestore_doc_id(project_id: str, database_id: str, collection_name: str) -> str:
#     """
#     Fetches the single Firestore document ID from a given collection.
#     Assumes the collection contains exactly one document.

#     Args:
#         project_id (str): GCP project ID
#         database_id (str): Firestore database ID (e.g., 'niyam-ai-db')
#         collection_name (str): Firestore collection name (e.g., 'users')

#     Returns:
#         str: The Firestore document ID

#     Raises:
#         ValueError: If the collection is empty or multiple docs found
#     """
#     # Initialize Firestore client
#     db = firestore.Client(project=project_id, database=database_id)

#     # Get all documents from the collection
#     docs = list(db.collection(collection_name).stream())

#     if not docs:
#         raise ValueError(f"No documents found in collection '{collection_name}'.")

#     #Need to ensure only one document exists
#     #Write Custom Logic
#     if len(docs) > 1:
#         raise ValueError(
#             f"Multiple documents found in '{collection_name}'. Expected only one."
#         )

#     doc_id = docs[0].id
#     print(f"✅ Found Firestore Document ID: {doc_id}")
#     return doc_id
