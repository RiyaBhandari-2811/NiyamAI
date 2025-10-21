import { Firestore } from "@google-cloud/firestore";

console.log(`[firebaseAdmin] Initializing Firestore `);

console.log(`privateKeyPresent=${!!process.env.GCP_PRIVATE_KEY}`);

const projectId = process.env.GCP_PROJECT_ID ?? "undefined";
const clientEmail = process.env.GCP_CLIENT_EMAIL ?? "undefined";
const privateKeyPresent = !!process.env.GCP_PRIVATE_KEY;

console.log(
  `[firebaseAdmin] Initializing Firestore with projectId=${projectId}, clientEmail=${clientEmail}, privateKeyPresent=${privateKeyPresent}`
);

let firestore: Firestore;

const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n")
  .replace(/\r/g, "")
  .trim();

try {
  firestore = new Firestore({
    projectId: projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });

  console.log("[firebaseAdmin] Firestore initialized successfully");
} catch (error) {
  console.error("[firebaseAdmin] Failed to initialize Firestore", error);
  throw error;
}

export const db = firestore;
