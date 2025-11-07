import { Firestore } from "@google-cloud/firestore";

let firestore: Firestore;

try {
  let credsRaw = process.env.GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON;
  if (!credsRaw)
    throw new Error("Missing GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON");

  // Remove any trailing junk (like extra quotes or newlines)
  credsRaw = credsRaw.trim();

  // Sometimes Vercel adds an extra literal \n at the end, so clean it
  if (credsRaw.endsWith("\\n") || credsRaw.endsWith('"')) {
    credsRaw = credsRaw.replace(/\\n"$/, "").replace(/"$/, "");
  }

  // Now normalize the JSON for parsing
  const normalizedJson = credsRaw
    .replace(/\n/g, "\\n") // turn real newlines into literal '\n'
    .replace(/\r/g, ""); // drop carriage returns

  // Try parsing
  const credentials = JSON.parse(normalizedJson);

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
