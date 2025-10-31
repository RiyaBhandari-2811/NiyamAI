from tools.firestore_decrypt_tool import FirestoreDecryptTool
import os
from dotenv import load_dotenv
load_dotenv()

tool = FirestoreDecryptTool()
data = tool.run("users", "137aadf4-84f2-41b8-b569-c63a14b21fb1")
print(data)
