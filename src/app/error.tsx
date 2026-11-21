"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="wrap py-32">
      <h1 className="h-section">Something broke.</h1>
      <p className="mt-4 text-ink-2">An unexpected error occurred. It’s not you.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </section>
  );
}
