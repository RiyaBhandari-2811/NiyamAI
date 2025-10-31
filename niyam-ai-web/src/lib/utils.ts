import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface EncryptedObject {
  iv: string;
  data: string;
}

export function encryptObject(obj: Record<string, any>, key: Buffer): EncryptedObject {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const json = JSON.stringify(obj);
  let encrypted = cipher.update(json, "utf8", "base64");
  encrypted += cipher.final("base64");
  return { iv: iv.toString("base64"), data: encrypted };
}

export function decryptObject<T = any>(encrypted: string, iv: string, key: Buffer): T {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "base64"));
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted) as T;
}

