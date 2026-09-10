import "server-only";

import { d1Driver } from "./d1-driver";
import { sqliteDriver } from "./sqlite-driver";
import { migrate } from "./schema";
import type { Driver } from "./driver";

export type { Driver, SqlValue, Statement } from "./driver";

/**
 * Chooses the storage driver and guarantees the schema is present.
 *
 * D1 is used whenever it is fully configured; otherwise local SQLite. Set
 * `DATA_DRIVER=sqlite` to force local even with D1 credentials in the
 * environment, which is how you develop without writing to the shared database.
 */
function select(): Driver {
  const forced = process.env.DATA_DRIVER;
  if (forced === "sqlite") return sqliteDriver;
  if (forced === "d1") return d1Driver;

  const configured =
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_D1_DATABASE_ID &&
    process.env.CLOUDFLARE_API_TOKEN;

  return configured ? d1Driver : sqliteDriver;
}

let chosen: Driver | null = null;

/** The driver, with migrations applied. Every data module goes through this. */
export async function data(): Promise<Driver> {
  chosen ??= select();
  await migrate(chosen);
  return chosen;
}

/** Which backend is in use — surfaced in the admin footer so it is never a guess. */
export function driverName(): "sqlite" | "d1" {
  chosen ??= select();
  return chosen.name;
}
