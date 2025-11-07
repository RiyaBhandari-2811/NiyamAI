import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

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

const client = new SecretManagerServiceClient({ credentials });

export async function getAesKey() {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${process.env.GOOGLE_CLOUD_AES_KEY}/versions/latest`,
  });

  const data = version?.payload?.data;
  if (!data) {
    throw new Error("Secret payload missing");
  }

  let b64: string;
  if (typeof data === "string") {
    b64 = data;
  } else if (Buffer.isBuffer(data) || data instanceof Uint8Array) {
    b64 = Buffer.from(data).toString("utf8");
  } else {
    b64 = String(data);
  }

  return Buffer.from(b64, "base64");
}
