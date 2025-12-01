import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start justify-center py-16">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">
        404 - Page Not Found
      </h1>

      <p className="mb-8 text-base text-neutral-600 dark:text-neutral-400">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
      >
        Go back home →
      </Link>
    </section>
  );
}
