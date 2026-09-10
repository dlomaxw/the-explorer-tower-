import type { Metadata } from "next";

import { currentUser } from "@/lib/auth";
import { driverName } from "@/lib/data";
import { r2Configured } from "@/lib/r2";
import { SITE_INDEXABLE } from "@/lib/seo";
import { ROLE_LABELS, can, canReadLeads, type Capability } from "@/lib/roles";
import { AdminShell, type NavItem } from "@/components/admin-shell";

import "./admin.css";

/**
 * The private team area.
 *
 * `noindex, nofollow`: internal screens must not appear in navigation, search
 * indexes or public APIs (spec §2). The public site never links here, and the
 * route group means none of the public chrome is inherited either.
 */
export const metadata: Metadata = {
  title: {
    default: "Console — Explorer Towers",
    template: "%s — Explorer Towers console",
  },
  robots: { index: false, follow: false, nocache: true },
};

/** `capability: null` means every signed-in user sees it. */
const NAV: { item: NavItem; capability: Capability | null }[] = [
  {
    item: { href: "/admin", label: "Overview", hint: "Today at a glance", group: "Sales" },
    capability: null,
  },
  {
    item: { href: "/admin/leads", label: "Leads", hint: "Pipeline and records", group: "Sales" },
    capability: "leads:read:all",
  },
  {
    item: { href: "/admin/tasks", label: "Tasks", hint: "Follow-ups due", group: "Sales" },
    capability: "tasks:read",
  },
  {
    item: {
      href: "/admin/analytics",
      label: "Analytics",
      hint: "Traffic, sources, conversion",
      group: "Audience",
    },
    capability: null,
  },
  {
    item: {
      href: "/admin/content",
      label: "Content",
      hint: "Edit the words on every page",
      group: "Website",
    },
    capability: null,
  },
  {
    item: {
      href: "/admin/media",
      label: "Media",
      hint: "Images, video and documents",
      group: "Website",
    },
    capability: null,
  },
  {
    item: {
      href: "/admin/seo",
      label: "SEO",
      hint: "Titles, descriptions, indexing",
      group: "Website",
    },
    capability: null,
  },
  {
    item: { href: "/admin/audit", label: "Audit", hint: "Who changed what", group: "Admin" },
    capability: "audit:read",
  },
  {
    item: { href: "/admin/users", label: "Users", hint: "Roles and access", group: "Admin" },
    capability: "users:manage",
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Login and setup render bare. They are the only admin routes reachable
  // while signed out, and they guard themselves.
  if (!user) {
    return <div className="admin min-h-svh">{children}</div>;
  }

  const items = NAV.filter(({ item, capability }) => {
    if (capability === null) return true;
    if (item.href === "/admin/leads") return canReadLeads(user.role);
    return can(user.role, capability);
  }).map(({ item }) => item);

  return (
    <AdminShell
      items={items}
      user={{ name: user.name, role: ROLE_LABELS[user.role] }}
      footer={
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Storage:{" "}
            {driverName() === "d1"
              ? "Cloudflare D1"
              : "local SQLite (development)"}
          </span>
          <span>Media: {r2Configured() ? "Cloudflare R2" : "not configured"}</span>
          <span>
            Search:{" "}
            {SITE_INDEXABLE ? "indexable" : "held back — noindex site-wide"}
          </span>
          <span>Times in Africa/Kampala.</span>
        </span>
      }
    >
      {children}
    </AdminShell>
  );
}
