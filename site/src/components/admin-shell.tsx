"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { LogoMark } from "@/components/logo";

/**
 * The admin navigation rail and command palette.
 *
 * The rail collapses to a header bar below `lg`, so the console is usable on a
 * phone — an agent checking a lead between viewings should not need a laptop.
 *
 * The palette (Ctrl/Cmd-K) is the fast path for people who live in this screen
 * all day. It is an accelerator, never the only route: every destination in it
 * is also a link in the rail, so nothing depends on knowing a shortcut.
 */

export interface NavItem {
  href: string;
  label: string;
  hint: string;
  group: string;
}

export function AdminShell({
  items,
  user,
  children,
  footer,
}: {
  items: NavItem[];
  user: { name: string; role: string };
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Reset the mobile menu on navigation, during render rather than in an
  // effect, so the new page never paints with the old menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setPaletteOpen(false);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const item of items) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="admin lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Rail */}
      <aside className="sticky top-0 z-40 lg:h-svh lg:border-r lg:border-[var(--line)] lg:bg-[var(--surface-1)]">
        <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 lg:border-b-0 lg:px-5 lg:py-5">
          <LogoMark className="h-7 w-auto shrink-0 text-[var(--accent)]" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-medium">Explorer Towers</p>
            <p className="text-[10px] tracking-[0.18em] text-[var(--ink-3)] uppercase">
              Console
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="ml-auto rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-xs lg:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/*
          Visibility is a class, not the `hidden` attribute: Tailwind's preflight
          sets `[hidden] { display: none !important }`, which would beat the
          `lg:block` that keeps the rail open on wide screens.
        */}
        <nav
          aria-label="Console"
          className={`border-b border-[var(--line)] bg-[var(--surface-1)] px-3 py-3 lg:block lg:border-b-0 lg:px-3 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          {groups.map(([group, groupItems]) => (
            <div key={group} className="mb-4">
              <p className="mb-1 px-2 text-[10px] tracking-[0.16em] text-[var(--ink-3)] uppercase">
                {group}
              </p>
              <ul className="grid gap-0.5">
                {groupItems.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                          active
                            ? "bg-[var(--surface-3)] text-[var(--ink-1)]"
                            : "text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink-1)]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="mt-2 flex w-full items-center justify-between rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-[12px] text-[var(--ink-3)] transition-colors hover:text-[var(--ink-1)]"
          >
            Search
            <kbd className="rounded border border-[var(--line-strong)] px-1.5 py-0.5 font-sans text-[10px]">
              ⌘K
            </kbd>
          </button>
        </nav>

        <div className="hidden border-t border-[var(--line)] px-5 py-4 lg:block">
          <p className="truncate text-[12px] text-[var(--ink-1)]">{user.name}</p>
          <p className="text-[11px] text-[var(--ink-3)]">{user.role}</p>
        </div>
      </aside>

      <div className="flex min-h-svh min-w-0 flex-col">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        <footer className="border-t border-[var(--line)] px-4 py-4 text-[11px] text-[var(--ink-3)] md:px-8">
          {footer}
        </footer>
      </div>

      {paletteOpen ? (
        <CommandPalette items={items} onClose={() => setPaletteOpen(false)} />
      ) : null}
    </div>
  );
}

function CommandPalette({
  items,
  onClose,
}: {
  items: NavItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const matches = items.filter((item) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      item.label.toLowerCase().includes(needle) ||
      item.hint.toLowerCase().includes(needle) ||
      item.group.toLowerCase().includes(needle)
    );
  });

  const clamped = Math.min(index, Math.max(matches.length - 1, 0));

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] shadow-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIndex((i) => Math.min(i + 1, matches.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            } else if (event.key === "Enter" && matches[clamped]) {
              event.preventDefault();
              router.push(matches[clamped].href);
              onClose();
            }
          }}
          placeholder="Jump to…"
          aria-label="Jump to"
          className="!rounded-none !border-0 !border-b !border-[var(--line)] !bg-transparent !px-4 !py-3 !text-sm"
        />

        <ul className="max-h-80 overflow-y-auto p-1.5">
          {matches.length === 0 ? (
            <li className="px-3 py-6 text-center text-[12px] text-[var(--ink-3)]">
              Nothing matches “{query}”.
            </li>
          ) : (
            matches.map((item, position) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setIndex(position)}
                  className={`flex items-baseline justify-between gap-4 rounded-lg px-3 py-2 text-[13px] ${
                    position === clamped
                      ? "bg-[var(--surface-3)] text-[var(--ink-1)]"
                      : "text-[var(--ink-2)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="truncate text-[11px] text-[var(--ink-3)]">
                    {item.hint}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
