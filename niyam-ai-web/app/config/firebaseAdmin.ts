import { Firestore } from "@google-cloud/firestore";

let firestore: Firestore;

try {
  firestore = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n")
        .replace(/\r/g, "")
        .trim(),
    },
    databaseId: "niyam-ai-db",
  });

  console.log("[firebaseAdmin] Firestore initialized successfully");
} catch (error) {
  console.error("[firebaseAdmin] Failed to initialize Firestore", error);
  throw error;
}

export const db = firestore;
