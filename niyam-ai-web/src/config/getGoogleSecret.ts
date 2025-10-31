import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string);
const client = new SecretManagerServiceClient({ credentials });

export async function getAesKey() {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}/secrets/AES256_KEY/versions/latest`,
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
