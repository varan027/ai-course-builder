import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold mb-4">
        AI Course Builder
      </h1>

      <p className="text-gray-600 max-w-xl mx-auto mb-10">
        Generate structured learning paths from unstructured content using AI.
        Stop guessing what to learn next.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/signup"
          className="px-5 py-2 rounded-md bg-white text-black text-sm"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="px-5 py-2 rounded-md border text-sm"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
