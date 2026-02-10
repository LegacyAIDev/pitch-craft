"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
  onLogout: () => void;
};

export function DashboardHeader({
  user,
  userMenuOpen,
  setUserMenuOpen,
  onLogout,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-beige-dark/30 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-heading text-2xl tracking-wide text-navy sm:text-3xl"
          >
            PitchCraft
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <span className="font-accent text-sm text-navy/70">Dashboard</span>
          </nav>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-beige-dark bg-white px-3 py-2 text-navy hover:bg-beige/30"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/20 font-heading text-navy">
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
              {user?.email ?? "Account"}
            </span>
            <svg
              className="h-4 w-4 text-navy/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-beige-dark bg-white py-1 shadow-lg">
                <div className="border-b border-beige-dark px-4 py-3">
                  <p className="truncate text-sm font-medium text-navy">
                    {((): string => {
                      const meta = user?.user_metadata as Record<string, unknown> | undefined;
                      const name = meta?.company_name;
                      return typeof name === "string" ? name : "Account";
                    })()}
                  </p>
                  <p className="truncate text-xs text-navy/70">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-navy hover:bg-beige/30"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-navy hover:bg-beige/30"
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
