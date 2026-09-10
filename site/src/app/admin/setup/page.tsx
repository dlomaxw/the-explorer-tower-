import { redirect } from "next/navigation";

import { userCount } from "@/lib/auth";
import { SetupForm } from "./setup-form";

export const metadata = { title: "First-run setup" };

/**
 * Creates the first system administrator, and only that.
 *
 * Available exclusively while the user table is empty, so it closes itself the
 * moment it has been used and cannot be revisited to mint another account.
 */
export default async function SetupPage() {
  if ((await userCount()) > 0) redirect("/admin/login");
  return <SetupForm />;
}
