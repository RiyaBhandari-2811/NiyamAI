import { Firestore } from "@google-cloud/firestore";

let firestore: Firestore;

try {
  firestore = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n")
        .replace(/\r/g, "")
        .trim(),
    },
    databaseId: process.env.GOOGLE_CLOUD_FIRESTORE_DB,
  });

  console.log("[firebaseAdmin] Firestore initialized successfully");
} catch (error) {
  console.error("[firebaseAdmin] Failed to initialize Firestore", error);
  throw error;
}

export const db = firestore;