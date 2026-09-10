/**
 * Roles and capabilities (spec §7).
 *
 * The default access table from the specification, expressed as capabilities so
 * every check is one lookup rather than a scatter of role comparisons. This
 * module is deliberately free of server-only imports so the admin UI can hide
 * what a user cannot do — but hiding is never the control. Every capability is
 * checked again on the server before anything is read or written, which is what
 * acceptance test A07 exercises.
 */

export const ROLES = [
  "system-admin",
  "bright-manager",
  "sales-agent",
  "content-editor",
  "client-approver",
  "client-viewer",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  "system-admin": "System administrator",
  "bright-manager": "Bright manager",
  "sales-agent": "Sales / inquiry agent",
  "content-editor": "Content editor",
  "client-approver": "Client approver",
  "client-viewer": "Client viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  "system-admin":
    "Manages users, roles, configuration and integrations. Security-sensitive changes are audited.",
  "bright-manager":
    "Team CRM, assignments, campaigns, content and reports. No final sale approval.",
  "sales-agent":
    "Assigned leads, communications, tasks and bookings only.",
  "content-editor":
    "Pages, assets and content drafts. No prospect contact data.",
  "client-approver":
    "Project dashboard, agreed lead visibility, approvals and commercial confirmations.",
  "client-viewer":
    "Read-only project activity and reports. No edits, exports or contact details.",
};

export type Capability =
  /** See every lead in the project. */
  | "leads:read:all"
  /** See only leads assigned to you. */
  | "leads:read:assigned"
  /** See the contact details on a lead, rather than the record alone. */
  | "leads:read:contact"
  | "leads:create"
  | "leads:edit"
  | "leads:assign"
  | "leads:stage"
  | "leads:export"
  /**
   * Confirm a reservation or sale. Spec §6 reserves the commercial decision to
   * the client: Bright can record and coordinate, but cannot mark an
   * unconfirmed sale as completed.
   */
  | "leads:confirm-commercial"
  | "tasks:read"
  | "tasks:write"
  | "users:manage"
  | "audit:read";

const CAPABILITIES: Record<Role, readonly Capability[]> = {
  "system-admin": [
    "leads:read:all",
    "leads:read:contact",
    "leads:create",
    "leads:edit",
    "leads:assign",
    "leads:stage",
    "leads:export",
    "leads:confirm-commercial",
    "tasks:read",
    "tasks:write",
    "users:manage",
    "audit:read",
  ],
  "bright-manager": [
    "leads:read:all",
    "leads:read:contact",
    "leads:create",
    "leads:edit",
    "leads:assign",
    "leads:stage",
    "leads:export",
    "tasks:read",
    "tasks:write",
    "audit:read",
  ],
  "sales-agent": [
    "leads:read:assigned",
    "leads:read:contact",
    "leads:create",
    "leads:edit",
    "leads:stage",
    "tasks:read",
    "tasks:write",
  ],
  // Content work must not reach prospect contact data.
  "content-editor": [],
  "client-approver": [
    "leads:read:all",
    "leads:read:contact",
    "leads:stage",
    "leads:confirm-commercial",
    "tasks:read",
    "audit:read",
  ],
  // Read-only, and without contact details unless separately granted.
  "client-viewer": ["leads:read:all", "tasks:read"],
};

export function can(role: Role, capability: Capability): boolean {
  return CAPABILITIES[role].includes(capability);
}

/** True when the role can reach a lead record at all, assigned or otherwise. */
export function canReadLeads(role: Role): boolean {
  return can(role, "leads:read:all") || can(role, "leads:read:assigned");
}

/**
 * How far a role's lead visibility reaches. `assigned` means the query must be
 * narrowed to that user's own records — enforced in the data layer, not by the
 * caller remembering to filter.
 */
export function leadScope(role: Role): "all" | "assigned" | "none" {
  if (can(role, "leads:read:all")) return "all";
  if (can(role, "leads:read:assigned")) return "assigned";
  return "none";
}
