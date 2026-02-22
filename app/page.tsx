import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { Sparkles, Youtube, BarChart3, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      <Navbar />
      
      {/* Immersive Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)] -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Powered by Gemini 2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Stop searching. <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-400">Start mastering.</span>
        </h1>

        <p className="max-w-xl mx-auto text-md md:text-lg text-muted-foreground mb-10 leading-relaxed">
          Syllarc transforms any topic into a structured learning arc - intelligently generated, carefully validated.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-black font-bold text-md hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-md transition-all">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl bg-white/3 border border-white/5 hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Path Generation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tell us what you want to learn. Our AI builds a logical, step-by-step roadmap tailored to your level.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/3 border border-white/5 hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Curated Content</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No more random searching. We fetch the highest-rated YouTube tutorials for every single chapter.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/3 border border-white/5 hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Trackable Progress</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize your journey. Mark chapters as complete and watch your progress bar move toward mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Footer Minimal */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
          Designed for Lifelong Learners • 2026 LearnPathAI
        </p>
      </footer>
    </main>
  );
}