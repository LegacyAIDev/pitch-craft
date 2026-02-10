"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { DashboardHeader } from "../DashboardHeader";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    getSession();
  }, [router]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        user={user}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        onLogout={handleLogout}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-navy/80 hover:text-navy"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="font-heading text-3xl tracking-wide text-navy">
          Settings
        </h1>
        <p className="mt-2 text-navy/80">
          Account and app settings will appear here.
        </p>
      </div>
    </>
  );
}
