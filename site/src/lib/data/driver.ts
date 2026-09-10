import "server-only";

/**
 * The storage interface every part of the CRM talks to.
 *
 * Two drivers implement it: local SQLite for development, and Cloudflare D1 for
 * deployment. D1 is reached over HTTP, so every operation here is async even
 * where the local driver could answer synchronously — that way moving between
 * them is a configuration change rather than a rewrite of every caller.
 *
 * All parameters are bound, never interpolated. No caller builds SQL by
 * concatenating a value.
 */

export type SqlValue = string | number | null;

export interface Driver {
  readonly name: "sqlite" | "d1";
  /** Rows for a SELECT. */
  query<T>(sql: string, params?: SqlValue[]): Promise<T[]>;
  /** A single row, or null. */
  first<T>(sql: string, params?: SqlValue[]): Promise<T | null>;
  /** INSERT/UPDATE/DELETE. Returns rows affected. */
  execute(sql: string, params?: SqlValue[]): Promise<number>;
  /**
   * Several statements as one unit.
   *
   * SQLite runs them in a real transaction. D1's HTTP batch is atomic on the
   * server side. Either way a partial write cannot be observed — which is what
   * the pipeline needs, since a stage change writes the lead, its activity and
   * its audit entry together or not at all.
   */
  batch(statements: { sql: string; params?: SqlValue[] }[]): Promise<void>;
}

export interface Statement {
  sql: string;
  params?: SqlValue[];
}
