import "server-only";

import { redirect } from "next/navigation";

import { currentUser, type SessionUser } from "./auth";
import { can, type Capability } from "./roles";

/**
 * Server-side access control (spec §7, acceptance test A07).
 *
 * Every admin page and every admin API route begins with one of these. The
 * navigation hides what a user cannot do, but hiding is a courtesy — this is
 * the control. A sales agent who types another agent's lead URL, or calls the
 * export endpoint directly, is stopped here rather than in the UI.
 */

export class Forbidden extends Error {
  constructor(public readonly capability: Capability) {
    super(`Missing capability: ${capability}`);
    this.name = "Forbidden";
  }
}

/** The signed-in user, or a redirect to the login screen. */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await currentUser();
  if (user) return user;

  const target = returnTo
    ? `/admin/login?next=${encodeURIComponent(returnTo)}`
    : "/admin/login";
  redirect(target);
}

/** The signed-in user, provided they hold `capability`. */
export async function requireCapability(
  capability: Capability,
  returnTo?: string,
): Promise<SessionUser> {
  const user = await requireUser(returnTo);
  if (!can(user.role, capability)) throw new Forbidden(capability);
  return user;
}

/**
 * The API equivalent: returns the user, or the Response to send back. Routes
 * check for a Response rather than relying on a thrown redirect, so an API
 * caller gets a status code instead of an HTML login page.
 */
export async function apiUser(
  capability?: Capability,
): Promise<{ user: SessionUser } | { response: Response }> {
  const user = await currentUser();

  if (!user) {
    return {
      response: Response.json(
        { ok: false, error: "Not signed in." },
        { status: 401 },
      ),
    };
  }

  if (capability && !can(user.role, capability)) {
    return {
      response: Response.json(
        { ok: false, error: "You do not have permission to do that." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
