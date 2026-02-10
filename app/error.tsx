"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h2 className="font-heading text-2xl tracking-wide text-navy">
        Something went wrong
      </h2>
      <p className="mt-2 text-center text-navy/80">
        We couldn’t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-navy px-5 py-2.5 font-medium text-white transition hover:bg-navy/90"
      >
        Try again
      </button>
    </div>
  );
}
