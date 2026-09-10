import "server-only";

import type { Driver, SqlValue, Statement } from "./driver";

/**
 * Cloudflare D1 over the REST API.
 *
 * Used when the app runs somewhere that is not the developer's machine. The
 * HTTP API is used rather than a Workers binding because the site runs on Node;
 * if it later moves onto Workers, only this file changes.
 *
 * Credentials are read from the environment at call time and never leave the
 * server. None of them may be exposed through a NEXT_PUBLIC_ variable — the
 * D1 token can read and write every lead in the database.
 */

interface D1Response {
  success: boolean;
  errors: { code: number; message: string }[];
  result: {
    success: boolean;
    results: unknown[];
    meta: { changes?: number; rows_written?: number };
  }[];
}

function config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !token) {
    throw new Error(
      "D1 driver selected but CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID or CLOUDFLARE_API_TOKEN is missing.",
    );
  }

  return {
    token,
    url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`,
  };
}

async function call(
  path: "/query" | "/raw",
  body: unknown,
): Promise<D1Response> {
  const { url, token } = config();

  const response = await fetch(url + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // Lead data must never be served from a cache.
    cache: "no-store",
  });

  // Read the body before deciding: D1 returns its real complaint in the JSON
  // even on a 4xx, and discarding it leaves nothing to debug with.
  const raw = await response.text();
  let payload: D1Response;
  try {
    payload = JSON.parse(raw) as D1Response;
  } catch {
    throw new Error(
      `D1 request failed: ${response.status} ${response.statusText} — ${raw.slice(0, 300)}`,
    );
  }

  if (!response.ok && !payload.errors?.length) {
    throw new Error(`D1 request failed: ${response.status} ${response.statusText}`);
  }

  if (!payload.success) {
    const detail = payload.errors?.map((e) => e.message).join("; ") || "unknown";
    throw new Error(`D1 error: ${detail}`);
  }

  return payload;
}

export const d1Driver: Driver = {
  name: "d1",

  async query<T>(sql: string, params: SqlValue[] = []): Promise<T[]> {
    const payload = await call("/query", { sql, params });
    return (payload.result[0]?.results ?? []) as T[];
  },

  async first<T>(sql: string, params: SqlValue[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  },

  async execute(sql: string, params: SqlValue[] = []): Promise<number> {
    const payload = await call("/query", { sql, params });
    return payload.result[0]?.meta?.changes ?? 0;
  },

  /**
   * Applies statements in order, one request each.
   *
   * NOT ATOMIC, and it cannot be made atomic through this API. D1's REST
   * endpoint accepts either several statements with no parameters, or one
   * statement with parameters — never both: it answers a mixed request with
   * "params with multiple statements is not supported". Since no value is ever
   * interpolated into SQL here, sequential execution is the only safe option
   * left.
   *
   * Callers must therefore order statements so the row that matters most is
   * written first and treat the rest as derived. `saveLead` writes the lead
   * before its timeline entry, so a failure part-way leaves a real lead with a
   * thin history rather than a lost enquiry.
   *
   * The fix is to run D1 through a Workers binding, whose `db.batch()` is a
   * genuine transaction. That is a deployment change; only this file and the
   * handover note change with it.
   */
  async batch(statements: Statement[]): Promise<void> {
    for (const statement of statements) {
      await call("/query", {
        sql: statement.sql,
        params: statement.params ?? [],
      });
    }
  },
};
