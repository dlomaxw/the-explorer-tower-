"use client";

import { completeTaskAction } from "../actions";
import { ActionForm, SubmitButton } from "@/components/admin-ui";

/**
 * Completing a task records an outcome, not just a tick. Spec §6 wants the
 * result of the work, so the field is offered inline rather than behind a
 * second screen — but it is optional, so a quick close stays quick.
 */
export function CompleteTaskForm({ taskId }: { taskId: string }) {
  return (
    <ActionForm action={completeTaskAction} className="flex items-center gap-2">
      {({ pending, state }) => (
        <>
          <input type="hidden" name="taskId" value={taskId} />
          <input
            name="outcome"
            placeholder="Outcome (optional)"
            aria-label="Outcome"
            className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-900"
          />
          <SubmitButton pending={pending} variant="secondary">
            Done
          </SubmitButton>
          {state.error ? (
            <span role="alert" className="text-xs text-red-700">
              {state.error}
            </span>
          ) : null}
        </>
      )}
    </ActionForm>
  );
}
