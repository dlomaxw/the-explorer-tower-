"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createUser, signIn, signOut, userCount } from "@/lib/auth";
import { requireUser } from "@/lib/guard";
import {
  addNote,
  assignLead,
  changeStage,
  completeTask,
  createTask,
  CrmError,
  updateLeadDetails,
} from "@/lib/crm";
import { isStage } from "@/lib/pipeline";
import { ROLES, type Role } from "@/lib/roles";

/**
 * Server actions for the admin area.
 *
 * Each one re-establishes who is acting from the session cookie rather than
 * trusting anything the form sent, then delegates to `crm.ts`, which applies
 * the capability and visibility rules. A crafted form post is checked exactly
 * as hard as a click.
 */

export type ActionState = { error?: string; ok?: boolean };

/**
 * Minimum password length. Length is the only composition rule: current NIST
 * guidance is that forced character classes push people towards predictable
 * substitutions without adding real strength.
 */
const MIN_PASSWORD = 10;

const text = (form: FormData, key: string) =>
  typeof form.get(key) === "string" ? (form.get(key) as string) : "";

export async function loginAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await signIn(text(form, "email"), text(form, "password"));

  // One message for a wrong address, a wrong password and a disabled account
  // alike, so the form cannot be used to discover which accounts exist.
  if (!user) return { error: "Those details do not match an active account." };

  const next = text(form, "next");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/** First-run only: creates the initial system administrator. */
export async function setupAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  if ((await userCount()) > 0) {
    return { error: "Setup has already been completed." };
  }

  const email = text(form, "email").trim();
  const name = text(form, "name").trim();
  const password = text(form, "password");

  if (!email || !name) return { error: "Name and email are both required." };
  if (password.length < MIN_PASSWORD) {
    return { error: `Use a password of at least ${MIN_PASSWORD} characters.` };
  }

  await createUser({ email, name, role: "system-admin", password });
  await signIn(email, password);
  redirect("/admin");
}

export async function createUserAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const actor = await requireUser();
  if (actor.role !== "system-admin") {
    return { error: "Only a system administrator can add users." };
  }

  const role = text(form, "role") as Role;
  if (!ROLES.includes(role)) return { error: "Choose a role." };

  const password = text(form, "password");
  if (password.length < MIN_PASSWORD) {
    return { error: `Use a password of at least ${MIN_PASSWORD} characters.` };
  }

  try {
    await createUser({
      email: text(form, "email").trim(),
      name: text(form, "name").trim(),
      role,
      password,
    });
  } catch {
    return { error: "That email address is already in use." };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function changeStageAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const leadId = text(form, "leadId");
  const to = text(form, "stage");

  if (!isStage(to)) return { error: "Choose a stage." };

  try {
    await changeStage(user, leadId, {
      to,
      note: text(form, "note"),
      subtype: text(form, "subtype") || undefined,
    });
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not change the stage." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function addNoteAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const leadId = text(form, "leadId");

  try {
    await addNote(user, leadId, {
      body: text(form, "body"),
      type: text(form, "type") || undefined,
    });
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not save the note." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function assignAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const leadId = text(form, "leadId");
  const ownerId = text(form, "ownerId");

  try {
    await assignLead(user, leadId, ownerId || null);
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not reassign." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function updateDetailsAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const leadId = text(form, "leadId");

  try {
    await updateLeadDetails(user, leadId, {
      priority: text(form, "priority"),
      budget: text(form, "budget"),
      buyerProfile: text(form, "buyerProfile"),
      timeframe: text(form, "timeframe"),
      qualificationNotes: text(form, "qualificationNotes"),
      nextAction: text(form, "nextAction"),
      nextActionDue: text(form, "nextActionDue"),
      unitInterest: text(form, "unitInterest"),
    });
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not save." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function createTaskAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const leadId = text(form, "leadId");

  try {
    await createTask(user, leadId, {
      title: text(form, "title"),
      type: text(form, "type") || "follow-up",
      dueAt: text(form, "dueAt"),
      priority: text(form, "priority") || "normal",
    });
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not create the task." };
  }

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/tasks");
  return { ok: true };
}

export async function completeTaskAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  try {
    await completeTask(user, text(form, "taskId"), text(form, "outcome"));
  } catch (error) {
    return { error: error instanceof CrmError ? error.message : "Could not complete the task." };
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  return { ok: true };
}
