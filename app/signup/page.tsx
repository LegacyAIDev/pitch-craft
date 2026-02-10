"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    location: "",
    niche: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            company_name: form.companyName,
            location: form.location,
            niche: form.niche,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      router.refresh();
      router.push("/login?signup=success");
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
            href="/login"
            className="text-navy/80 hover:text-navy font-medium"
          >
            Log in
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <h1 className="font-heading text-3xl tracking-wide text-navy sm:text-4xl text-center">
            Create your account
          </h1>
          <p className="mt-2 text-center text-navy/80">
            Start your free trial. No credit card required.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-beige-dark bg-white p-6 shadow-sm sm:p-8"
          >
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
                  minLength={6}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-navy"
                >
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Acme Agency"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-navy"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label
                  htmlFor="niche"
                  className="block text-sm font-medium text-navy"
                >
                  Niche
                </label>
                <input
                  id="niche"
                  type="text"
                  required
                  value={form.niche}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, niche: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="e.g. Web development, Marketing, Consulting"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="mt-4 text-center text-sm text-navy/70">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-navy hover:underline">
                Log in
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
