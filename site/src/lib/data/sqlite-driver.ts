import "server-only";

import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

import type { Driver, SqlValue } from "./driver";

/**
 * Local development driver.
 *
 * A SQLite file on the app instance's own disk, through Node's built-in module.
 * Real transactions and real constraints, so behaviour matches D1 closely
 * enough to develop against — but it does not survive a redeploy and does not
 * work across instances, which is why it is development-only.
 *
 * `node:sqlite` is still marked experimental in Node and prints a warning on
 * first use.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "explorer.db");

let handle: DatabaseSync | null = null;

function connection(): DatabaseSync {
  if (handle) return handle;
  mkdirSync(DATA_DIR, { recursive: true });
  const instance = new DatabaseSync(DB_FILE);
  instance.exec("PRAGMA journal_mode = WAL");
  instance.exec("PRAGMA foreign_keys = ON");
  handle = instance;
  return instance;
}

export const sqliteDriver: Driver = {
  name: "sqlite",

  async query<T>(sql: string, params: SqlValue[] = []): Promise<T[]> {
    return connection().prepare(sql).all(...params) as T[];
  },

  async first<T>(sql: string, params: SqlValue[] = []): Promise<T | null> {
    const row = connection().prepare(sql).get(...params);
    return (row as T) ?? null;
  },

  async execute(sql: string, params: SqlValue[] = []): Promise<number> {
    const result = connection()
      .prepare(sql)
      .run(...params);
    return Number(result.changes ?? 0);
  },

  async batch(statements) {
    const instance = connection();
    instance.exec("BEGIN");
    try {
      for (const statement of statements) {
        instance.prepare(statement.sql).run(...(statement.params ?? []));
      }
      instance.exec("COMMIT");
    } catch (error) {
      instance.exec("ROLLBACK");
      throw error;
    }
  },
};
