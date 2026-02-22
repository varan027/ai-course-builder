import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />
      <Navbar />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-40 pb-32 text-center">
        <h1 className="text-6xl font-semibold tracking-tight leading-tight mb-6">
          Structured learning.
          <br />
          <span className="text-primary">Intelligently generated.</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
          Syllarc builds structured learning arcs for any topic — tailored to
          your level and validated for clarity.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 rounded-xl font-medium">
              Get Started
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-8 rounded-xl font-medium text-muted-foreground hover:text-white"
            >
              View Demo
            </Button>
          </Link>
        </div>
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="h-64 bg-[#121212] rounded-2xl flex items-center justify-center text-muted-foreground">
              Dashboard Preview
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="border-t border-white/5" />

      {/* FEATURES */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-10">
            <h3 className="text-xl font-semibold mb-4">
              AI-generated learning arcs
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Describe your goal. Syllarc generates a structured, logical
              curriculum built for progression.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-10">
            <h3 className="text-xl font-semibold mb-4">Validated structure</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every AI response is parsed and validated using strict schemas to
              ensure structural integrity and consistency.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-10">
            <h3 className="text-xl font-semibold mb-4">Trackable mastery</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor progress chapter by chapter as you complete your learning
              arc.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-xs text-muted-foreground tracking-wide">
          © 2026 Syllarc. Intelligent Learning Architecture.
        </p>
      </footer>
    </main>
  );
}
