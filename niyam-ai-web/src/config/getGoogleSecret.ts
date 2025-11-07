import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

if (!process.env.GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON) {
  throw new Error(
    "Missing GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON environment variable"
  );
}

const jsonString =
  process.env.GOOGLE_CLOUD_APPLICATION_CREDENTIALS_JSON.replace(/\n/g, "\\n");
const credentials = JSON.parse(jsonString);
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
