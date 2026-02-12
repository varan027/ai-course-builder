import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      {/* subtle background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />

      <div className="max-w-4xl text-center mx-auto py-32 px-6">
        <h1 className="text-6xl font-semibold tracking-tight leading-tight">
          Build Structured Learning Systems.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          AI-generated roadmaps. Curated videos. Measurable progress. No more
          random YouTube hopping.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link href="/signup">
            <Button size="lg" className="cursor-pointer">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="cursor-pointer">
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
