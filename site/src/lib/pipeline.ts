/**
 * The twelve-stage pipeline (spec §6).
 *
 * All twelve stages from the proposal are preserved exactly. Follow-up is also
 * a task that can fall due at any stage, so stage 11 records the stage it came
 * from and can hand the lead back to it — moving to follow-up must not erase a
 * prospect's commercial progress.
 *
 * `evidence` is what the person moving the lead has to record for the move to
 * be accepted. It is enforced server-side in `crm.ts`, not just prompted for in
 * the form, so the timeline can never show a stage change with nothing behind it.
 */

export const STAGES = [
  "01-new-inquiry",
  "02-contacted",
  "03-qualified",
  "04-information-shared",
  "05-meeting-scheduled",
  "06-meeting-completed",
  "07-visit-scheduled",
  "08-visit-completed",
  "09-negotiation",
  "10-reservation",
  "11-follow-up",
  "12-inactive-lost",
] as const;

export type Stage = (typeof STAGES)[number];

export interface StageDefinition {
  id: Stage;
  /** Shown in the UI. */
  label: string;
  /** The proposal's number, for cross-reference with the specification. */
  ordinal: number;
  /** What must be recorded to move a lead into this stage. */
  evidence: string;
  /** Prompt on the required note field. */
  prompt: string;
  /** A subtype must be chosen as well as a note. */
  subtypes?: readonly string[];
  /**
   * Only a role holding `leads:confirm-commercial` may move a lead here. The
   * client controls reservation approval and sale confirmation.
   */
  clientDecision?: boolean;
  /** Colour token used by the board and the stage pill. */
  tone: "new" | "active" | "meeting" | "commercial" | "paused" | "closed";
}

export const STAGE_DEFINITIONS: Record<Stage, StageDefinition> = {
  "01-new-inquiry": {
    id: "01-new-inquiry",
    label: "New inquiry",
    ordinal: 1,
    evidence: "Saved inquiry, source and assignment; first-response task raised.",
    prompt: "Why is this lead being returned to new?",
    tone: "new",
  },
  "02-contacted": {
    id: "02-contacted",
    label: "Contacted",
    ordinal: 2,
    evidence:
      "Contact attempt and outcome, and the next action. Record an attempt as an attempt — reaching someone is a different thing.",
    prompt: "What happened on the contact attempt, and what happens next?",
    subtypes: ["Reached", "Attempted, no answer", "Left message"],
    tone: "active",
  },
  "03-qualified": {
    id: "03-qualified",
    label: "Qualified",
    ordinal: 3,
    evidence: "Requirements, budget, unit interest and qualification outcome.",
    prompt: "Record requirements, budget, unit interest and the outcome.",
    tone: "active",
  },
  "04-information-shared": {
    id: "04-information-shared",
    label: "Information shared",
    ordinal: 4,
    evidence: "What approved material was shared, on what channel, and when.",
    prompt: "What was shared, and how?",
    tone: "active",
  },
  "05-meeting-scheduled": {
    id: "05-meeting-scheduled",
    label: "Meeting scheduled",
    ordinal: 5,
    evidence:
      "A confirmed meeting, or a clearly labelled pending request. Never present an unconfirmed slot as booked.",
    prompt: "Meeting date, attendees, and whether it is confirmed or pending.",
    subtypes: ["Confirmed", "Requested, awaiting confirmation"],
    tone: "meeting",
  },
  "06-meeting-completed": {
    id: "06-meeting-completed",
    label: "Meeting completed",
    ordinal: 6,
    evidence: "Attendance, notes, feedback and the next step.",
    prompt: "Who attended, what was said, and what happens next?",
    subtypes: ["Attended", "No-show"],
    tone: "meeting",
  },
  "07-visit-scheduled": {
    id: "07-visit-scheduled",
    label: "Site visit scheduled",
    ordinal: 7,
    evidence: "Representative, date, location and confirmation status.",
    prompt: "Visit date, representative, location, confirmation status.",
    subtypes: ["Confirmed", "Requested, awaiting confirmation"],
    tone: "meeting",
  },
  "08-visit-completed": {
    id: "08-visit-completed",
    label: "Site visit completed",
    ordinal: 8,
    evidence: "Attendance, interest level, feedback and the next action.",
    prompt: "Who attended, how interested are they, what happens next?",
    subtypes: ["Attended", "No-show"],
    tone: "meeting",
  },
  "09-negotiation": {
    id: "09-negotiation",
    label: "Negotiation or decision",
    ordinal: 9,
    evidence:
      "Terms and pending decisions, escalated to an authorised client representative.",
    prompt: "What terms are on the table, and what decision is pending?",
    tone: "commercial",
  },
  "10-reservation": {
    id: "10-reservation",
    label: "Reservation or conversion",
    ordinal: 10,
    evidence:
      "Outcome subtype and the client's written confirmation. A reservation is not a completed sale.",
    prompt: "What has the client confirmed, in writing, and when?",
    subtypes: ["Reservation confirmed", "Sale confirmed"],
    clientDecision: true,
    tone: "commercial",
  },
  "11-follow-up": {
    id: "11-follow-up",
    label: "Follow-up required",
    ordinal: 11,
    evidence:
      "Due action, owner and reason. The previous stage is retained so the lead can return to it.",
    prompt: "What needs following up, by when, and why?",
    tone: "paused",
  },
  "12-inactive-lost": {
    id: "12-inactive-lost",
    label: "Inactive or lost",
    ordinal: 12,
    evidence: "Subtype and reason. Reactivation keeps the history.",
    prompt: "Why is this lead inactive or lost?",
    subtypes: [
      "Not interested",
      "Budget",
      "Timing",
      "Bought elsewhere",
      "Unreachable",
      "Duplicate",
    ],
    tone: "closed",
  },
};

export const STAGE_LIST: readonly StageDefinition[] = STAGES.map(
  (id) => STAGE_DEFINITIONS[id],
);

export function isStage(value: unknown): value is Stage {
  return typeof value === "string" && (STAGES as readonly string[]).includes(value);
}

export function stageLabel(stage: string): string {
  return isStage(stage) ? STAGE_DEFINITIONS[stage].label : stage;
}

/**
 * Stages the pipeline suggests moving to next. Spec §6 allows justified skips
 * and backward moves with an audit trail, so this orders the picker rather than
 * restricting it — every stage stays reachable, and the move is recorded either
 * way.
 */
export function suggestedNext(current: Stage): Stage[] {
  const index = STAGES.indexOf(current);
  const forward = STAGES.slice(index + 1, index + 3);
  const always: Stage[] = ["11-follow-up", "12-inactive-lost"];
  return [...forward, ...always.filter((stage) => !forward.includes(stage))];
}
