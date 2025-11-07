import { Firestore } from "@google-cloud/firestore";

let firestore: Firestore;

try {
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credsJson) {
    throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON in environment");
  }

  const credentials = JSON.parse(credsJson);

  firestore = new Firestore({
    projectId: credentials.project_id,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    databaseId: process.env.GOOGLE_CLOUD_FIRESTORE_DB || "(default)",
  });

  console.log("[firebaseAdmin] Firestore initialized successfully");
} catch (error) {
  console.error("[firebaseAdmin] Failed to initialize Firestore", error);
  throw error;
}

export const db = firestore;
