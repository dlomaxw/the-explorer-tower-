import "server-only";

/**
 * The CRM schema, written to run unchanged on SQLite and on D1.
 *
 * D1 is SQLite, so one set of DDL serves both. Two constraints follow from
 * that: no `PRAGMA user_version` for migration tracking (D1's HTTP API will not
 * run pragmas), so a `schema_migrations` table records what has been applied;
 * and every statement is written to be safely re-runnable.
 *
 * Migrations are append-only. Never edit or reorder an applied entry — add a
 * new one.
 */

import type { Driver } from "./driver";

interface Migration {
  id: string;
  statements: string[];
}

const MIGRATIONS: Migration[] = [
  {
    id: "001-leads",
    statements: [
      `CREATE TABLE IF NOT EXISTS leads (
        id                     TEXT PRIMARY KEY,
        reference              TEXT NOT NULL UNIQUE,
        request_id             TEXT NOT NULL UNIQUE,
        kind                   TEXT NOT NULL,
        created_at             TEXT NOT NULL,
        updated_at             TEXT NOT NULL,
        full_name              TEXT NOT NULL,
        email                  TEXT,
        phone                  TEXT,
        preferred_channel      TEXT,
        unit_interest          TEXT,
        message                TEXT,
        preferred_time         TEXT,
        time_zone              TEXT,
        marketing_consent      INTEGER NOT NULL DEFAULT 0,
        consent_notice_version TEXT NOT NULL,
        consent_recorded_at    TEXT NOT NULL,
        source                 TEXT,
        landing_page           TEXT,
        campaign               TEXT NOT NULL DEFAULT '{}',
        stage                  TEXT NOT NULL DEFAULT '01-new-inquiry',
        stage_changed_at       TEXT,
        previous_stage         TEXT,
        owner_id               TEXT,
        priority               TEXT NOT NULL DEFAULT 'normal',
        budget                 TEXT,
        buyer_profile          TEXT,
        timeframe              TEXT,
        qualification_notes    TEXT,
        next_action            TEXT,
        next_action_due        TEXT,
        outcome_subtype        TEXT,
        outcome_reason         TEXT,
        archived               INTEGER NOT NULL DEFAULT 0
      )`,
      "CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at DESC)",
      "CREATE INDEX IF NOT EXISTS leads_stage ON leads (stage)",
      "CREATE INDEX IF NOT EXISTS leads_owner ON leads (owner_id)",
    ],
  },
  {
    id: "002-users-sessions",
    statements: [
      `CREATE TABLE IF NOT EXISTS users (
        id            TEXT PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        name          TEXT NOT NULL,
        role          TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at    TEXT NOT NULL,
        last_login_at TEXT,
        disabled      INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        revoked    INTEGER NOT NULL DEFAULT 0
      )`,
      "CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id)",
    ],
  },
  {
    id: "003-activities-tasks",
    statements: [
      `CREATE TABLE IF NOT EXISTS activities (
        id         TEXT PRIMARY KEY,
        lead_id    TEXT NOT NULL,
        type       TEXT NOT NULL,
        body       TEXT,
        detail     TEXT NOT NULL DEFAULT '{}',
        actor_id   TEXT,
        actor_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      "CREATE INDEX IF NOT EXISTS activities_lead ON activities (lead_id, created_at DESC)",
      `CREATE TABLE IF NOT EXISTS tasks (
        id           TEXT PRIMARY KEY,
        lead_id      TEXT NOT NULL,
        title        TEXT NOT NULL,
        type         TEXT NOT NULL,
        owner_id     TEXT,
        due_at       TEXT NOT NULL,
        priority     TEXT NOT NULL DEFAULT 'normal',
        status       TEXT NOT NULL DEFAULT 'open',
        outcome      TEXT,
        created_at   TEXT NOT NULL,
        created_by   TEXT,
        completed_at TEXT
      )`,
      "CREATE INDEX IF NOT EXISTS tasks_due ON tasks (status, due_at)",
      "CREATE INDEX IF NOT EXISTS tasks_lead ON tasks (lead_id)",
    ],
  },
  {
    id: "004-audit",
    statements: [
      `CREATE TABLE IF NOT EXISTS audit_events (
        id         TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        actor_id   TEXT,
        actor_name TEXT NOT NULL,
        action     TEXT NOT NULL,
        entity     TEXT NOT NULL,
        entity_id  TEXT NOT NULL,
        detail     TEXT NOT NULL DEFAULT '{}'
      )`,
      "CREATE INDEX IF NOT EXISTS audit_entity ON audit_events (entity, entity_id, created_at DESC)",
      "CREATE INDEX IF NOT EXISTS audit_created ON audit_events (created_at DESC)",
    ],
  },

  // Traffic measurement (spec §11).
  //
  // No cookie and no stable identifier. `visitor_hash` is a salted digest of
  // coarse request properties that rotates daily, so a visitor can be counted
  // once within a day without being recognised across days or joined to a lead.
  // Nothing personal is stored: no IP, no full user agent, no query strings that
  // could carry a name or an email.
  {
    id: "005-analytics",
    statements: [
      `CREATE TABLE IF NOT EXISTS page_views (
        id             TEXT PRIMARY KEY,
        created_at     TEXT NOT NULL,
        day            TEXT NOT NULL,
        path           TEXT NOT NULL,
        referrer_host  TEXT,
        channel        TEXT NOT NULL DEFAULT 'direct',
        utm_source     TEXT,
        utm_medium     TEXT,
        utm_campaign   TEXT,
        visitor_hash   TEXT NOT NULL,
        session_id     TEXT NOT NULL,
        country        TEXT,
        device         TEXT,
        is_entry       INTEGER NOT NULL DEFAULT 0
      )`,
      "CREATE INDEX IF NOT EXISTS views_day ON page_views (day)",
      "CREATE INDEX IF NOT EXISTS views_path ON page_views (path)",
      "CREATE INDEX IF NOT EXISTS views_channel ON page_views (channel)",
      "CREATE INDEX IF NOT EXISTS views_session ON page_views (session_id)",
      `CREATE TABLE IF NOT EXISTS site_events (
        id           TEXT PRIMARY KEY,
        created_at   TEXT NOT NULL,
        day          TEXT NOT NULL,
        name         TEXT NOT NULL,
        path         TEXT,
        session_id   TEXT,
        visitor_hash TEXT,
        detail       TEXT NOT NULL DEFAULT '{}'
      )`,
      "CREATE INDEX IF NOT EXISTS events_day ON site_events (day, name)",
      "CREATE INDEX IF NOT EXISTS events_name ON site_events (name)",
    ],
  },

  // Editable content and the media library (spec §4).
  //
  // `content_blocks` overlays the static defaults in `src/content/site.ts`: a
  // key absent here falls back to the code, so the site is never broken by an
  // empty database and the defaults stay reviewable in version control.
  {
    id: "006-cms",
    statements: [
      `CREATE TABLE IF NOT EXISTS content_blocks (
        key        TEXT PRIMARY KEY,
        value      TEXT NOT NULL,
        status     TEXT NOT NULL DEFAULT 'approved',
        updated_at TEXT NOT NULL,
        updated_by TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS content_revisions (
        id         TEXT PRIMARY KEY,
        key        TEXT NOT NULL,
        value      TEXT NOT NULL,
        status     TEXT NOT NULL,
        created_at TEXT NOT NULL,
        actor_id   TEXT,
        actor_name TEXT NOT NULL,
        summary    TEXT
      )`,
      "CREATE INDEX IF NOT EXISTS revisions_key ON content_revisions (key, created_at DESC)",
      `CREATE TABLE IF NOT EXISTS media_assets (
        id          TEXT PRIMARY KEY,
        storage_key TEXT NOT NULL UNIQUE,
        kind        TEXT NOT NULL DEFAULT 'render',
        category    TEXT NOT NULL DEFAULT 'exterior',
        title       TEXT NOT NULL,
        alt         TEXT NOT NULL,
        caption     TEXT,
        mime        TEXT NOT NULL,
        bytes       INTEGER NOT NULL,
        width       INTEGER,
        height      INTEGER,
        approved    INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT NOT NULL,
        created_by  TEXT,
        archived    INTEGER NOT NULL DEFAULT 0
      )`,
      "CREATE INDEX IF NOT EXISTS media_category ON media_assets (category, created_at DESC)",
    ],
  },

  // Per-page SEO (spec §5: CMS-editable SEO fields).
  {
    id: "007-seo",
    statements: [
      `CREATE TABLE IF NOT EXISTS seo_meta (
        path         TEXT PRIMARY KEY,
        title        TEXT,
        description  TEXT,
        og_media_id  TEXT,
        canonical    TEXT,
        noindex      INTEGER NOT NULL DEFAULT 0,
        updated_at   TEXT NOT NULL,
        updated_by   TEXT
      )`,
    ],
  },
];

let applied: Promise<void> | null = null;

/**
 * Applies any outstanding migrations.
 *
 * Memoised so requests sharing a module instance wait on one run. That is not
 * enough on its own: the dev server can instantiate this module once per route
 * bundle, and a deployment can start several instances at once, so two runners
 * may genuinely race. The runner below is therefore written to be safe when
 * that happens rather than relying on the memo to prevent it.
 *
 * A failed run is not cached — clearing the memo lets the next request retry,
 * which matters when the cause was transient (a network blip, or credentials
 * that were wrong at boot and have since been fixed).
 */
export function migrate(driver: Driver): Promise<void> {
  applied ??= run(driver).catch((error: unknown) => {
    applied = null;
    throw error;
  });
  return applied;
}

async function run(driver: Driver): Promise<void> {
  await driver.execute(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       id         TEXT PRIMARY KEY,
       applied_at TEXT NOT NULL
     )`,
  );

  const done = new Set(
    (
      await driver.query<{ id: string }>("SELECT id FROM schema_migrations")
    ).map((row) => row.id),
  );

  for (const migration of MIGRATIONS) {
    if (done.has(migration.id)) continue;

    for (const statement of migration.statements) {
      await driver.execute(statement);
    }

    // OR IGNORE: if a concurrent runner recorded this migration first, that is
    // the expected outcome, not an error. Every statement above is written
    // IF NOT EXISTS, so applying one twice is harmless.
    await driver.execute(
      "INSERT OR IGNORE INTO schema_migrations (id, applied_at) VALUES (?, ?)",
      [migration.id, new Date().toISOString()],
    );
  }
}
