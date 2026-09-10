"use client";

import { setupAction } from "../actions";
import {
  ActionForm,
  Field,
  FormMessage,
  SubmitButton,
  inputClass,
} from "@/components/admin-ui";

export function SetupForm() {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-lg font-semibold tracking-tight">First-run setup</h1>
        <p className="mt-1 mb-6 text-sm text-slate-600">
          No accounts exist yet. Create the system administrator. This screen
          closes itself once that is done.
        </p>

        <ActionForm
          action={setupAction}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          {({ pending, state }) => (
            <>
              <FormMessage state={state} />
              <Field label="Full name">
                <input name="name" required className={inputClass} />
              </Field>
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Password" hint="At least 10 characters.">
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  className={inputClass}
                />
              </Field>
              <SubmitButton pending={pending}>
                Create administrator
              </SubmitButton>
            </>
          )}
        </ActionForm>
      </div>
    </div>
  );
}
