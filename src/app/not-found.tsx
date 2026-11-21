import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-32">
      <p className="display text-8xl text-cobalt dark:text-accent">404</p>
      <h1 className="h-section mt-6">That page isn’t here.</h1>
      <p className="mt-4 text-ink-2">It may have moved, or the link may be wrong.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to the portfolio
      </Link>
    </section>
  );
}
