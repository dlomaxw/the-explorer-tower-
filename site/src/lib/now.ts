import "server-only";

/**
 * The current time, read once per request.
 *
 * Reading the clock during render is fine in a *server* component — it renders
 * once, on the server, for one request. It is not fine in a client component,
 * where the value would differ between the server pass and hydration and
 * produce a mismatch. This helper exists so that distinction is explicit at
 * every call site: server pages read the clock here and pass the value down to
 * client components as a prop, rather than each of them reaching for it.
 */
export function requestNow(): number {
  return Date.now();
}
