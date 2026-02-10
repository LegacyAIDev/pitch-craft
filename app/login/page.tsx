"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (searchParams.get("signup") === "success") setSignupSuccess(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.refresh();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige/30 flex flex-col">
      <header className="border-b border-beige-dark/30 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-heading text-2xl tracking-wide text-navy sm:text-3xl"
          >
            PitchCraft
          </Link>
          <Link
            href="/signup"
            className="text-navy/80 hover:text-navy font-medium"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <h1 className="font-heading text-3xl tracking-wide text-navy sm:text-4xl text-center">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-navy/80">
            Sign in to your PitchCraft account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-beige-dark bg-white p-6 shadow-sm sm:p-8"
          >
            {signupSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                Account created. Sign in below. If your project requires email
                confirmation, check your inbox first.
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-navy"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-navy"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="mt-4 text-center text-sm text-navy/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-navy hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          <div
            role="note"
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900"
          >
            <strong className="font-medium">Beta notice:</strong> This tool uses
            an ML model fine-tuned on LegacyAI&apos;s quote data for beta
            version testing.
          </div>
        </div>
      </main>
    </div>
  );
}
