"use client";

import { loginAction } from "../actions";
import {
  ActionForm,
  Field,
  FormMessage,
  SubmitButton,
  inputClass,
} from "@/components/admin-ui";

export function LoginForm({ next }: { next: string }) {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Explorer Towers CRM
        </h1>
        <p className="mt-1 mb-6 text-sm text-slate-600">
          Sign in to continue. This area is for the project team.
        </p>

        <ActionForm
          action={loginAction}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          {({ pending, state }) => (
            <>
              <FormMessage state={state} />
              <input type="hidden" name="next" value={next} />
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Password">
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                />
              </Field>
              <SubmitButton pending={pending}>Sign in</SubmitButton>
            </>
          )}
        </ActionForm>
      </div>
    </div>
  );
}
