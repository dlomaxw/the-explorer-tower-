import "server-only";

import { randomUUID } from "node:crypto";

import { data } from "./data";
import type { SessionUser } from "./auth";
import { can, leadScope } from "./roles";
import { STAGE_DEFINITIONS, isStage, type Stage } from "./pipeline";

/**
 * CRM read and write operations (spec §§5–6).
 *
 * Two rules hold throughout:
 *
 *   1. Visibility is applied in the query, not by the caller. `leadScope`
 *      decides whether a role sees everything or only its own assignments, and
 *      that becomes a WHERE clause — so a page that forgets to filter still
 *      cannot leak another agent's records.
 *
 *   2. A stage change, its timeline entry and its audit row are written in one
 *      batch. The timeline can never show a move with nothing behind it, and
 *      the audit can never miss one that happened.
 */

export interface LeadRow {
  id: string;
  reference: string;
  kind: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  preferred_channel: string | null;
  unit_interest: string | null;
  message: string | null;
  preferred_time: string | null;
  time_zone: string | null;
  marketing_consent: number;
  consent_notice_version: string;
  consent_recorded_at: string;
  source: string | null;
  landing_page: string | null;
  campaign: string;
  stage: Stage;
  stage_changed_at: string | null;
  previous_stage: Stage | null;
  owner_id: string | null;
  owner_name: string | null;
  priority: string;
  budget: string | null;
  buyer_profile: string | null;
  timeframe: string | null;
  qualification_notes: string | null;
  next_action: string | null;
  next_action_due: string | null;
  outcome_subtype: string | null;
  outcome_reason: string | null;
  archived: number;
}

export interface ActivityRow {
  id: string;
  lead_id: string;
  type: string;
  body: string | null;
  detail: string;
  actor_id: string | null;
  actor_name: string;
  created_at: string;
}

export interface TaskRow {
  id: string;
  lead_id: string;
  lead_reference: string | null;
  lead_name: string | null;
  title: string;
  type: string;
  owner_id: string | null;
  owner_name: string | null;
  due_at: string;
  priority: string;
  status: string;
  outcome: string | null;
  created_at: string;
  completed_at: string | null;
}

const LEAD_SELECT = `
  SELECT l.*, u.name AS owner_name
    FROM leads l
    LEFT JOIN users u ON u.id = l.owner_id
`;

/**
 * Adds the role's visibility rule to a query. Returns null when the role may
 * not read leads at all, which callers treat as an empty result rather than an
 * error — a content editor browsing to the leads screen sees nothing, not a crash.
 */
function scopeClause(user: SessionUser): { sql: string; params: string[] } | null {
  const scope = leadScope(user.role);
  if (scope === "none") return null;
  if (scope === "all") return { sql: "1 = 1", params: [] };
  return { sql: "l.owner_id = ?", params: [user.id] };
}

export interface LeadFilters {
  stage?: string;
  owner?: string;
  search?: string;
  priority?: string;
  overdue?: boolean;
  includeArchived?: boolean;
}

export async function listLeads(
  user: SessionUser,
  filters: LeadFilters = {},
): Promise<LeadRow[]> {
  const scope = scopeClause(user);
  if (!scope) return [];

  const db = await data();
  const where = [scope.sql];
  const params: (string | number)[] = [...scope.params];

  if (!filters.includeArchived) where.push("l.archived = 0");

  if (filters.stage && isStage(filters.stage)) {
    where.push("l.stage = ?");
    params.push(filters.stage);
  }

  if (filters.owner === "unassigned") {
    where.push("l.owner_id IS NULL");
  } else if (filters.owner) {
    where.push("l.owner_id = ?");
    params.push(filters.owner);
  }

  if (filters.priority) {
    where.push("l.priority = ?");
    params.push(filters.priority);
  }

  if (filters.overdue) {
    where.push("l.next_action_due IS NOT NULL AND l.next_action_due < ?");
    params.push(new Date().toISOString());
  }

  if (filters.search) {
    // Name, reference, email and phone. Never name alone for merging, but
    // searching across all four is what the sales team actually needs.
    where.push(
      "(l.full_name LIKE ? OR l.reference LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)",
    );
    const term = `%${filters.search.trim()}%`;
    params.push(term, term, term, term);
  }

  return db.query<LeadRow>(
    `${LEAD_SELECT} WHERE ${where.join(" AND ")} ORDER BY l.created_at DESC LIMIT 500`,
    params as string[],
  );
}

/** One lead, or null when it does not exist or this user may not see it. */
export async function getLead(
  user: SessionUser,
  id: string,
): Promise<LeadRow | null> {
  const scope = scopeClause(user);
  if (!scope) return null;

  const db = await data();
  return db.first<LeadRow>(
    `${LEAD_SELECT} WHERE l.id = ? AND ${scope.sql}`,
    [id, ...scope.params],
  );
}

export async function leadActivities(leadId: string): Promise<ActivityRow[]> {
  const db = await data();
  return db.query<ActivityRow>(
    "SELECT * FROM activities WHERE lead_id = ? ORDER BY created_at DESC",
    [leadId],
  );
}

export async function leadTasks(leadId: string): Promise<TaskRow[]> {
  const db = await data();
  return db.query<TaskRow>(
    `SELECT t.*, u.name AS owner_name, NULL AS lead_reference, NULL AS lead_name
       FROM tasks t
       LEFT JOIN users u ON u.id = t.owner_id
      WHERE t.lead_id = ?
      ORDER BY t.status = 'done', t.due_at`,
    [leadId],
  );
}

/** Counts per stage, for the board columns and the dashboard. */
export async function stageCounts(
  user: SessionUser,
): Promise<Record<string, number>> {
  const scope = scopeClause(user);
  if (!scope) return {};

  const db = await data();
  const rows = await db.query<{ stage: string; n: number }>(
    `SELECT l.stage, COUNT(*) AS n FROM leads l
      WHERE ${scope.sql} AND l.archived = 0
      GROUP BY l.stage`,
    scope.params,
  );

  return Object.fromEntries(rows.map((row) => [row.stage, row.n]));
}

function activityStatement(input: {
  leadId: string;
  type: string;
  body: string | null;
  detail?: Record<string, unknown>;
  actor: SessionUser | null;
  at: string;
}) {
  return {
    sql: `INSERT INTO activities (id, lead_id, type, body, detail, actor_id, actor_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    params: [
      randomUUID(),
      input.leadId,
      input.type,
      input.body,
      JSON.stringify(input.detail ?? {}),
      input.actor?.id ?? null,
      input.actor?.name ?? "System",
      input.at,
    ] as (string | null)[],
  };
}

function auditStatement(input: {
  actor: SessionUser | null;
  action: string;
  entity: string;
  entityId: string;
  detail?: Record<string, unknown>;
  at: string;
}) {
  return {
    sql: `INSERT INTO audit_events (id, created_at, actor_id, actor_name, action, entity, entity_id, detail)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    params: [
      randomUUID(),
      input.at,
      input.actor?.id ?? null,
      input.actor?.name ?? "System",
      input.action,
      input.entity,
      input.entityId,
      JSON.stringify(input.detail ?? {}),
    ] as (string | null)[],
  };
}

export class CrmError extends Error {}

/**
 * Moves a lead to a new stage.
 *
 * Skips and backward moves are allowed — spec §6 requires that, with an audit
 * trail — but the evidence the stage defines is mandatory, and stage 10 is
 * refused to anyone without `leads:confirm-commercial`: the client controls
 * reservation and sale confirmation, and Bright may coordinate but not decide.
 */
export async function changeStage(
  user: SessionUser,
  leadId: string,
  input: { to: Stage; note: string; subtype?: string },
): Promise<void> {
  if (!can(user.role, "leads:stage")) {
    throw new CrmError("You do not have permission to change the stage.");
  }

  const lead = await getLead(user, leadId);
  if (!lead) throw new CrmError("Lead not found.");

  const definition = STAGE_DEFINITIONS[input.to];
  if (!definition) throw new CrmError("Unknown stage.");

  if (definition.clientDecision && !can(user.role, "leads:confirm-commercial")) {
    throw new CrmError(
      "Only an authorised client approver can confirm a reservation or sale.",
    );
  }

  const note = input.note.trim();
  if (note.length < 3) {
    throw new CrmError(`This stage requires a note: ${definition.prompt}`);
  }

  if (definition.subtypes && !input.subtype) {
    throw new CrmError("Choose an outcome for this stage.");
  }

  if (
    input.subtype &&
    definition.subtypes &&
    !definition.subtypes.includes(input.subtype)
  ) {
    throw new CrmError("That outcome is not valid for this stage.");
  }

  const now = new Date().toISOString();

  // Stage 11 keeps the stage it came from so the lead can be handed back to it:
  // follow-up must not erase commercial progress. Any other move clears it.
  const previous =
    input.to === "11-follow-up" ? lead.stage : null;

  await (
    await data()
  ).batch([
    {
      sql: `UPDATE leads
               SET stage = ?, stage_changed_at = ?, previous_stage = ?,
                   outcome_subtype = ?, outcome_reason = ?, updated_at = ?
             WHERE id = ?`,
      params: [
        input.to,
        now,
        previous,
        input.subtype ?? null,
        input.to === "12-inactive-lost" ? note : lead.outcome_reason,
        now,
        leadId,
      ],
    },
    activityStatement({
      leadId,
      type: "stage-change",
      body: note,
      detail: {
        from: lead.stage,
        to: input.to,
        subtype: input.subtype ?? null,
        returnsTo: previous,
      },
      actor: user,
      at: now,
    }),
    auditStatement({
      actor: user,
      action: "lead.stage-change",
      entity: "lead",
      entityId: leadId,
      detail: { from: lead.stage, to: input.to, subtype: input.subtype ?? null },
      at: now,
    }),
  ]);
}

export async function addNote(
  user: SessionUser,
  leadId: string,
  input: { body: string; type?: string },
): Promise<void> {
  if (!can(user.role, "leads:edit")) {
    throw new CrmError("You do not have permission to add notes.");
  }

  const lead = await getLead(user, leadId);
  if (!lead) throw new CrmError("Lead not found.");

  const body = input.body.trim();
  if (!body) throw new CrmError("The note is empty.");

  const now = new Date().toISOString();
  const db = await data();

  await db.batch([
    activityStatement({
      leadId,
      // A logged call is a person's account of a call; it is not evidence the
      // call happened. The type keeps that distinction visible on the timeline.
      type: input.type ?? "note",
      body,
      actor: user,
      at: now,
    }),
    {
      sql: "UPDATE leads SET updated_at = ? WHERE id = ?",
      params: [now, leadId],
    },
  ]);
}

export async function assignLead(
  user: SessionUser,
  leadId: string,
  ownerId: string | null,
): Promise<void> {
  if (!can(user.role, "leads:assign")) {
    throw new CrmError("You do not have permission to reassign leads.");
  }

  const lead = await getLead(user, leadId);
  if (!lead) throw new CrmError("Lead not found.");

  const db = await data();
  const now = new Date().toISOString();

  const owner = ownerId
    ? await db.first<{ name: string }>("SELECT name FROM users WHERE id = ?", [
        ownerId,
      ])
    : null;

  if (ownerId && !owner) throw new CrmError("That user does not exist.");

  await db.batch([
    {
      sql: "UPDATE leads SET owner_id = ?, updated_at = ? WHERE id = ?",
      params: [ownerId, now, leadId],
    },
    activityStatement({
      leadId,
      type: "assignment",
      body: owner ? `Assigned to ${owner.name}` : "Assignment cleared",
      detail: { from: lead.owner_id, to: ownerId },
      actor: user,
      at: now,
    }),
    auditStatement({
      actor: user,
      action: "lead.assign",
      entity: "lead",
      entityId: leadId,
      detail: { from: lead.owner_id, to: ownerId },
      at: now,
    }),
  ]);
}

/** Qualification and next-action fields (spec §5). */
export async function updateLeadDetails(
  user: SessionUser,
  leadId: string,
  input: {
    priority?: string;
    budget?: string;
    buyerProfile?: string;
    timeframe?: string;
    qualificationNotes?: string;
    nextAction?: string;
    nextActionDue?: string;
    unitInterest?: string;
  },
): Promise<void> {
  if (!can(user.role, "leads:edit")) {
    throw new CrmError("You do not have permission to edit this lead.");
  }

  const lead = await getLead(user, leadId);
  if (!lead) throw new CrmError("Lead not found.");

  const now = new Date().toISOString();
  const clean = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  };

  const db = await data();
  await db.batch([
    {
      sql: `UPDATE leads SET
              priority = ?, budget = ?, buyer_profile = ?, timeframe = ?,
              qualification_notes = ?, next_action = ?, next_action_due = ?,
              unit_interest = ?, updated_at = ?
            WHERE id = ?`,
      params: [
        input.priority ?? lead.priority,
        clean(input.budget),
        clean(input.buyerProfile),
        clean(input.timeframe),
        clean(input.qualificationNotes),
        clean(input.nextAction),
        clean(input.nextActionDue),
        clean(input.unitInterest),
        now,
        leadId,
      ],
    },
    activityStatement({
      leadId,
      type: "details-updated",
      body: "Lead details updated",
      detail: { ...input },
      actor: user,
      at: now,
    }),
  ]);
}

export async function createTask(
  user: SessionUser,
  leadId: string,
  input: {
    title: string;
    type: string;
    dueAt: string;
    ownerId?: string | null;
    priority?: string;
  },
): Promise<void> {
  if (!can(user.role, "tasks:write")) {
    throw new CrmError("You do not have permission to create tasks.");
  }

  const lead = await getLead(user, leadId);
  if (!lead) throw new CrmError("Lead not found.");

  const title = input.title.trim();
  if (!title) throw new CrmError("The task needs a title.");
  if (!input.dueAt) throw new CrmError("The task needs a due date.");

  const now = new Date().toISOString();
  const db = await data();

  await db.batch([
    {
      sql: `INSERT INTO tasks (id, lead_id, title, type, owner_id, due_at, priority, status, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
      params: [
        randomUUID(),
        leadId,
        title,
        input.type,
        input.ownerId ?? lead.owner_id ?? user.id,
        new Date(input.dueAt).toISOString(),
        input.priority ?? "normal",
        now,
        user.id,
      ],
    },
    activityStatement({
      leadId,
      type: "task-created",
      body: title,
      detail: { dueAt: input.dueAt, type: input.type },
      actor: user,
      at: now,
    }),
  ]);
}

export async function completeTask(
  user: SessionUser,
  taskId: string,
  outcome: string,
): Promise<void> {
  if (!can(user.role, "tasks:write")) {
    throw new CrmError("You do not have permission to complete tasks.");
  }

  const db = await data();
  const task = await db.first<{ lead_id: string; title: string }>(
    "SELECT lead_id, title FROM tasks WHERE id = ?",
    [taskId],
  );
  if (!task) throw new CrmError("Task not found.");

  // Re-checks visibility: a task id alone must not reach another agent's lead.
  const lead = await getLead(user, task.lead_id);
  if (!lead) throw new CrmError("Task not found.");

  const now = new Date().toISOString();
  await db.batch([
    {
      sql: "UPDATE tasks SET status = 'done', outcome = ?, completed_at = ? WHERE id = ?",
      params: [outcome.trim() || null, now, taskId],
    },
    activityStatement({
      leadId: task.lead_id,
      type: "task-completed",
      body: `${task.title}${outcome.trim() ? ` — ${outcome.trim()}` : ""}`,
      actor: user,
      at: now,
    }),
  ]);
}

/** Open tasks across every lead this user can see, soonest first. */
export async function openTasks(user: SessionUser): Promise<TaskRow[]> {
  const scope = scopeClause(user);
  if (!scope) return [];

  const db = await data();
  return db.query<TaskRow>(
    `SELECT t.*, u.name AS owner_name, l.reference AS lead_reference, l.full_name AS lead_name
       FROM tasks t
       JOIN leads l ON l.id = t.lead_id
       LEFT JOIN users u ON u.id = t.owner_id
      WHERE t.status = 'open' AND ${scope.sql}
      ORDER BY t.due_at
      LIMIT 100`,
    scope.params,
  );
}

export async function recentAudit(limit = 100) {
  const db = await data();
  return db.query<{
    id: string;
    created_at: string;
    actor_name: string;
    action: string;
    entity: string;
    entity_id: string;
    detail: string;
  }>(
    "SELECT * FROM audit_events ORDER BY created_at DESC LIMIT ?",
    [limit],
  );
}
