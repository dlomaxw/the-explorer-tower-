import { redirect } from "next/navigation";

import { currentUser, userCount } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  if (await currentUser()) redirect("/admin");

  // Nobody exists yet: send the first visitor to setup rather than to a login
  // screen that no password could satisfy.
  if ((await userCount()) === 0) redirect("/admin/setup");

  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";

  return <LoginForm next={next} />;
}
