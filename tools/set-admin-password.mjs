#!/usr/bin/env node
/**
 * Set the password on an existing console account.
 *
 *   node tools/set-admin-password.mjs --email 969dev@explorertowers.ug
 *   node tools/set-admin-password.mjs --email ... --dry-run
 *
 * Why this exists: passwords are stored as one-way scrypt hashes, so a lost one
 * cannot be read back by anyone, including whoever runs the database. The only
 * way back into an account is to replace it. This does that without the
 * password ever being printed, logged, put on a command line or pasted into a
 * chat: it is typed at a hidden prompt on the machine you run this on.
 *
 * It uses the same Cloudflare D1 credentials as the site (site/.env.local) and
 * the same hashing as src/lib/auth.ts, so a password set here is accepted by the
 * login form.
 *
 * What it changes: that one user's password and salt, and it revokes that
 * user's open sessions so a signed-in browser cannot outlive a reset. Nothing
 * else is touched, and it re-reads the row afterwards to prove the new password
 * verifies before reporting success.
 */

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Must match SCRYPT_KEYLEN in src/lib/auth.ts, or the login form rejects it.
const SCRYPT_KEYLEN = 64;
const MIN_LENGTH = 12;

export function hashPassword(password, salt) {
  return scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
}

export function verifies(password, saltHex, hashHex) {
  const attempt = Buffer.from(hashPassword(password, saltHex), "hex");
  const stored = Buffer.from(hashHex, "hex");
  return attempt.length === stored.length && timingSafeEqual(attempt, stored);
}

function loadEnv() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const file = path.join(here, "..", "site", ".env.local");
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    throw new Error(`Cannot read ${file}. It holds the Cloudflare credentials.`);
  }
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !line.trim().startsWith("#")) {
      env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  for (const key of [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_D1_DATABASE_ID",
    "CLOUDFLARE_API_TOKEN",
  ]) {
    if (!env[key]) throw new Error(`${key} is missing from site/.env.local`);
  }
  return env;
}

function d1(env) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_D1_DATABASE_ID}/query`;
  return async function query(sql, params = []) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });
    const body = await response.json();
    if (!body.success) {
      throw new Error(`Database error: ${JSON.stringify(body.errors)}`);
    }
    return body.result[0];
  };
}

function prompter() {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, done) {
      if (!muted) process.stdout.write(chunk, encoding);
      done();
    },
  });
  const rl = createInterface({
    input: process.stdin,
    output,
    terminal: Boolean(process.stdin.isTTY),
  });
  // An async iterator, not rl.question: with piped input, lines that arrive
  // before the next question() is asked are silently dropped.
  const lines = rl[Symbol.asyncIterator]();

  return {
    async ask(question, { hidden = false } = {}) {
      process.stdout.write(question);
      muted = hidden;
      const { value } = await lines.next();
      muted = false;
      if (hidden) process.stdout.write("\n");
      return (value ?? "").trim();
    },
    close: () => rl.close(),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => {
    const at = args.indexOf(name);
    return at === -1 ? null : (args[at + 1] ?? null);
  };
  const email = (flag("--email") ?? "").trim().toLowerCase();
  const dryRun = args.includes("--dry-run");

  if (!email) {
    console.error("Usage: node tools/set-admin-password.mjs --email <address> [--dry-run]");
    process.exitCode = 2;
    return;
  }

  const query = d1(loadEnv());

  const found = await query(
    "SELECT id, name, role, disabled FROM users WHERE email = ?",
    [email],
  );
  const user = found.results[0];
  if (!user) {
    console.error(`No account with the email ${email}.`);
    const all = await query("SELECT email, role FROM users ORDER BY created_at");
    console.error("Accounts that exist:");
    for (const row of all.results) console.error(`  ${row.email}  (${row.role})`);
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log(`  Account : ${email}`);
  console.log(`  Name    : ${user.name}`);
  console.log(`  Role    : ${user.role}`);
  console.log(`  Database: Cloudflare D1 (the live site)${dryRun ? "  [dry run, nothing will be written]" : ""}`);
  if (user.disabled === 1) {
    console.log("  Note    : this account is disabled; it will be re-enabled.");
  }
  console.log("");

  const prompt = prompter();
  try {
    const first = await prompt.ask("New password (min 12 characters, hidden): ", { hidden: true });
    if (first.length < MIN_LENGTH) {
      console.error(`Too short. Use at least ${MIN_LENGTH} characters.`);
      process.exitCode = 1;
      return;
    }
    const again = await prompt.ask("Type it again: ", { hidden: true });
    if (first !== again) {
      console.error("The two entries do not match. Nothing was changed.");
      process.exitCode = 1;
      return;
    }
    const sure = await prompt.ask(
      `Replace the password for ${email} and sign out its open sessions? (yes/no): `,
    );
    if (sure.toLowerCase() !== "yes") {
      console.log("Cancelled. Nothing was changed.");
      return;
    }

    const salt = randomBytes(16).toString("hex");
    const hash = hashPassword(first, salt);

    if (dryRun) {
      console.log("Dry run: password checks passed, nothing written.");
      return;
    }

    await query(
      "UPDATE users SET password_hash = ?, password_salt = ?, disabled = 0 WHERE id = ?",
      [hash, salt, user.id],
    );
    const revoked = await query(
      "UPDATE sessions SET revoked = 1 WHERE user_id = ? AND revoked = 0",
      [user.id],
    );

    // Prove it: read the row back and check the typed password against it.
    const stored = (
      await query("SELECT password_hash, password_salt FROM users WHERE id = ?", [user.id])
    ).results[0];
    if (!stored || !verifies(first, stored.password_salt, stored.password_hash)) {
      console.error(
        "The password was written but did not verify on read-back. Run this again before relying on it.",
      );
      process.exitCode = 1;
      return;
    }

    console.log("");
    console.log("Done. The new password is set and verified.");
    console.log(`Open sessions signed out: ${revoked.meta?.changes ?? 0}`);
    console.log("Sign in at https://www.explorertower.ug/admin/login");
  } finally {
    prompt.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
