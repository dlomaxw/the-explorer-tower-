import "server-only";

import { createHash, createHmac } from "node:crypto";

/**
 * Cloudflare R2 through its S3-compatible API.
 *
 * SigV4 is implemented here rather than pulling in the AWS SDK: the signing
 * algorithm is small and fully specified, and the SDK would add several
 * megabytes of dependency for three operations (put, delete, signed get).
 *
 * R2 uses region `auto` and the payload is always signed — no unsigned-payload
 * shortcut — so an object cannot be altered in flight without the signature
 * failing.
 *
 * Credentials never leave the server. Uploaded objects are served through
 * `/api/media/[id]`, not from a public bucket URL, so access follows the same
 * permission rules as everything else.
 */

const SERVICE = "s3";
const REGION = "auto";

function config() {
  const endpoint = process.env.R2_S3_ENDPOINT;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  if (!endpoint || !accessKey || !secretKey || !bucket) {
    throw new Error(
      "R2 is not configured: set R2_S3_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET.",
    );
  }

  return { endpoint: endpoint.replace(/\/$/, ""), accessKey, secretKey, bucket };
}

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_S3_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

const sha256 = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");

const hmac = (key: Buffer | string, value: string) =>
  createHmac("sha256", key).update(value).digest();

/** Each path segment is encoded, but the separators are not. */
function encodeKey(key: string): string {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

interface SignedRequest {
  url: string;
  headers: Record<string, string>;
}

function sign(
  method: string,
  key: string,
  body: Buffer,
  extraHeaders: Record<string, string> = {},
): SignedRequest {
  const { endpoint, accessKey, secretKey, bucket } = config();
  const host = new URL(endpoint).host;
  const path = `/${bucket}/${encodeKey(key)}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256(body);

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders,
  };

  // Canonical headers must be lowercase, sorted, and match SignedHeaders exactly.
  const sortedKeys = Object.keys(headers)
    .map((name) => name.toLowerCase())
    .sort();
  const canonicalHeaders = sortedKeys
    .map((name) => `${name}:${String(headers[name] ?? headers[name.toLowerCase()]).trim()}\n`)
    .join("");
  const signedHeaders = sortedKeys.join(";");

  const canonicalRequest = [
    method,
    path,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), REGION), SERVICE),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  headers.Authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { url: `${endpoint}${path}`, headers };
}

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const { url, headers } = sign("PUT", key, body, {
    "content-type": contentType,
  });

  // Buffer is a Uint8Array subclass, but fetch's BodyInit type does not
  // accept it directly; the view shares the same memory, so this is free.
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: new Uint8Array(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `R2 upload failed: ${response.status} ${response.statusText} — ${detail.slice(0, 200)}`,
    );
  }
}

export async function getObject(
  key: string,
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const { url, headers } = sign("GET", key, Buffer.alloc(0));
  const response = await fetch(url, { method: "GET", headers });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`R2 read failed: ${response.status} ${response.statusText}`);
  }

  return {
    body: await response.arrayBuffer(),
    contentType:
      response.headers.get("content-type") ?? "application/octet-stream",
  };
}

export async function deleteObject(key: string): Promise<void> {
  const { url, headers } = sign("DELETE", key, Buffer.alloc(0));
  const response = await fetch(url, { method: "DELETE", headers });

  // 404 is success for our purposes: the object is not there either way.
  if (!response.ok && response.status !== 404) {
    throw new Error(
      `R2 delete failed: ${response.status} ${response.statusText}`,
    );
  }
}
