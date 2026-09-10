"use client";

import { createUserAction } from "../actions";
import {
  ActionForm,
  Field,
  FormMessage,
  SubmitButton,
  inputClass,
} from "@/components/admin-ui";
import { ROLE_LABELS, ROLES } from "@/lib/roles";

export function NewUserForm() {
  return (
    <ActionForm action={createUserAction} className="space-y-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />
          <Field label="Full name">
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Role">
            <select name="role" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Choose a role
              </option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Temporary password"
            hint="At least 10 characters. Share it separately and have them change it."
          >
            <input
              name="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
          </Field>
          <SubmitButton pending={pending}>Create user</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
