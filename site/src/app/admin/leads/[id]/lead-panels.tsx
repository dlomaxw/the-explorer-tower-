"use client";

import { useState } from "react";

import {
  addNoteAction,
  assignAction,
  changeStageAction,
  createTaskAction,
  updateDetailsAction,
} from "../../actions";
import {
  ActionForm,
  Field,
  FormMessage,
  SubmitButton,
  inputClass,
} from "@/components/admin-ui";
import { STAGE_DEFINITIONS, STAGE_LIST, type Stage } from "@/lib/pipeline";

interface Person {
  id: string;
  name: string;
}

/**
 * Moving a lead through the pipeline.
 *
 * The evidence prompt and the outcome list come from the stage definition and
 * change as soon as a different stage is picked, so the person recording the
 * move can see what is required before writing it. The same rules are applied
 * again server-side — this is guidance, not the gate.
 */
export function StagePanel({
  leadId,
  current,
  canConfirmCommercial,
}: {
  leadId: string;
  current: Stage;
  canConfirmCommercial: boolean;
}) {
  const [target, setTarget] = useState<Stage>(current);
  const definition = STAGE_DEFINITIONS[target];
  const blocked = definition.clientDecision && !canConfirmCommercial;

  return (
    <ActionForm action={changeStageAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <input type="hidden" name="leadId" value={leadId} />

          <Field label="Move to stage">
            <select
              name="stage"
              value={target}
              onChange={(event) => setTarget(event.target.value as Stage)}
              className={inputClass}
            >
              {STAGE_LIST.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.ordinal}. {stage.label}
                  {stage.id === current ? " (current)" : ""}
                </option>
              ))}
            </select>
          </Field>

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
            {definition.evidence}
          </p>

          {blocked ? (
            <p
              role="alert"
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
            >
              Only an authorised client approver can confirm a reservation or
              sale. Record the position as a note and escalate it instead.
            </p>
          ) : null}

          {definition.subtypes ? (
            <Field label="Outcome">
              <select name="subtype" className={inputClass} required>
                <option value="">Choose…</option>
                {definition.subtypes.map((subtype) => (
                  <option key={subtype} value={subtype}>
                    {subtype}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          <Field label="Evidence" hint={definition.prompt}>
            <textarea
              name="note"
              rows={3}
              required
              minLength={3}
              className={inputClass}
            />
          </Field>

          <SubmitButton pending={pending}>Record stage change</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function NotePanel({ leadId }: { leadId: string }) {
  return (
    <ActionForm action={addNoteAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <input type="hidden" name="leadId" value={leadId} />

          <Field label="Kind">
            <select name="type" className={inputClass} defaultValue="note">
              <option value="note">Note</option>
              {/*
                A logged call is somebody's account of a call, not proof one
                happened. The timeline keeps the two apart.
              */}
              <option value="call-logged">Call (logged manually)</option>
              <option value="message-logged">Message (logged manually)</option>
              <option value="info-shared">Information shared</option>
              <option value="feedback">Feedback</option>
            </select>
          </Field>

          <Field label="Note">
            <textarea name="body" rows={3} required className={inputClass} />
          </Field>

          <SubmitButton pending={pending} variant="secondary">
            Add to timeline
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function AssignPanel({
  leadId,
  people,
  ownerId,
}: {
  leadId: string;
  people: Person[];
  ownerId: string | null;
}) {
  return (
    <ActionForm action={assignAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <input type="hidden" name="leadId" value={leadId} />
          <Field label="Owner">
            <select
              name="ownerId"
              defaultValue={ownerId ?? ""}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </Field>
          <SubmitButton pending={pending} variant="secondary">
            Save owner
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function DetailsPanel({
  leadId,
  lead,
}: {
  leadId: string;
  lead: {
    priority: string;
    budget: string | null;
    buyer_profile: string | null;
    timeframe: string | null;
    qualification_notes: string | null;
    next_action: string | null;
    next_action_due: string | null;
    unit_interest: string | null;
  };
}) {
  return (
    <ActionForm action={updateDetailsAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <input type="hidden" name="leadId" value={leadId} />

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Priority">
              <select
                name="priority"
                defaultValue={lead.priority}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </Field>

            <Field label="Residence interest">
              <input
                name="unitInterest"
                defaultValue={lead.unit_interest ?? ""}
                className={inputClass}
              />
            </Field>

            <Field label="Budget">
              <input
                name="budget"
                defaultValue={lead.budget ?? ""}
                placeholder="Amount and currency"
                className={inputClass}
              />
            </Field>

            <Field label="Buyer profile">
              <input
                name="buyerProfile"
                defaultValue={lead.buyer_profile ?? ""}
                placeholder="Owner-occupier, investor, diaspora…"
                className={inputClass}
              />
            </Field>

            <Field label="Timeframe">
              <input
                name="timeframe"
                defaultValue={lead.timeframe ?? ""}
                className={inputClass}
              />
            </Field>

            <Field label="Next action due">
              <input
                name="nextActionDue"
                type="datetime-local"
                defaultValue={
                  lead.next_action_due
                    ? lead.next_action_due.slice(0, 16)
                    : ""
                }
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Next action">
            <input
              name="nextAction"
              defaultValue={lead.next_action ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Qualification notes">
            <textarea
              name="qualificationNotes"
              rows={3}
              defaultValue={lead.qualification_notes ?? ""}
              className={inputClass}
            />
          </Field>

          <SubmitButton pending={pending} variant="secondary">
            Save details
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function TaskPanel({ leadId }: { leadId: string }) {
  return (
    <ActionForm action={createTaskAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <input type="hidden" name="leadId" value={leadId} />

          <Field label="Task">
            <input name="title" required className={inputClass} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Type">
              <select name="type" className={inputClass} defaultValue="follow-up">
                <option value="first-response">First response</option>
                <option value="follow-up">Follow-up</option>
                <option value="call">Call</option>
                <option value="send-information">Send information</option>
                <option value="meeting">Meeting</option>
                <option value="site-visit">Site visit</option>
              </select>
            </Field>

            <Field label="Due">
              <input
                name="dueAt"
                type="datetime-local"
                required
                className={inputClass}
              />
            </Field>
          </div>

          <SubmitButton pending={pending} variant="secondary">
            Create task
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
