import "server-only";

import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";

import { data } from "./data";
import type { Role } from "./roles";

/**
 * Staff authentication (spec §12).
 *
 * Passwords are stored as scrypt hashes with a per-user salt and compared in
 * constant time. Sessions are opaque random tokens; only their SHA-256 hash is
 * stored, so a leaked database cannot be replayed as a login. The cookie is
 * HttpOnly, SameSite=Lax and Secure outside development, and every session has
 * a hard expiry that the server checks on each request.
 *
 * MFA for privileged roles is required by the spec and is **not** implemented
 * here — see the handover notes. It is the one part of §12 that this build
 * leaves open rather than approximating.
 */

const COOKIE = "et_session";
const SESSION_DAYS = 7;
const SCRYPT_KEYLEN = 64;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  password_hash: string;
  password_salt: string;
  disabled: number;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
}

function verifyPassword(password: string, row: UserRow): boolean {
  const attempt = Buffer.from(hashPassword(password, row.password_salt), "hex");
  const stored = Buffer.from(row.password_hash, "hex");
  // Length check first: timingSafeEqual throws on a mismatch.
  if (attempt.length !== stored.length) return false;
  return timingSafeEqual(attempt, stored);
}

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createUser(input: {
  email: string;
  name: string;
  role: Role;
  password: string;
}): Promise<SessionUser> {
  const salt = randomBytes(16).toString("hex");
  const id = randomUUID();
  const db = await data();

  await db.execute(
    `INSERT INTO users (id, email, name, role, password_hash, password_salt, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.email.trim().toLowerCase(),
      input.name.trim(),
      input.role,
      hashPassword(input.password, salt),
      salt,
      new Date().toISOString(),
    ],
  );

  return {
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    role: input.role,
  };
}

/**
 * Verifies credentials and opens a session. Returns null for a bad email, a bad
 * password or a disabled account alike — the caller shows one message for all
 * three, so the form cannot be used to discover which addresses exist.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const db = await data();
  const row = await db.first<UserRow>("SELECT * FROM users WHERE email = ?", [
    email.trim().toLowerCase(),
  ]);

  if (!row || row.disabled === 1 || !verifyPassword(password, row)) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);

  await db.execute(
    "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    [hashToken(token), row.id, now.toISOString(), expires.toISOString()],
  );

  await db.execute("UPDATE users SET last_login_at = ? WHERE id = ?", [
    now.toISOString(),
    row.id,
  ]);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });

  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;

  if (token) {
    // Revoked server-side as well as cleared client-side, so a copied cookie
    // stops working immediately (spec §12: immediate access revocation).
    const db = await data();
    await db.execute("UPDATE sessions SET revoked = 1 WHERE token_hash = ?", [
      hashToken(token),
    ]);
  }

  store.delete(COOKIE);
}

/** The signed-in user, or null. Checks revocation and expiry on every call. */
export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const db = await data();
  return db.first<SessionUser>(
    `SELECT u.id, u.email, u.name, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.revoked = 0
        AND s.expires_at > ?
        AND u.disabled = 0`,
    [hashToken(token), new Date().toISOString()],
  );
}

export async function userCount(): Promise<number> {
  const db = await data();
  const row = await db.first<{ n: number }>("SELECT COUNT(*) AS n FROM users");
  return row?.n ?? 0;
}

export async function listUsers(): Promise<
  (SessionUser & {
    createdAt: string;
    lastLoginAt: string | null;
    disabled: boolean;
  })[]
> {
  const db = await data();
  const rows = await db.query<{
    id: string;
    email: string;
    name: string;
    role: Role;
    created_at: string;
    last_login_at: string | null;
    disabled: number;
  }>(
    `SELECT id, email, name, role, created_at, last_login_at, disabled
       FROM users ORDER BY created_at`,
  );

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
    disabled: row.disabled === 1,
  }));
}
