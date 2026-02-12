"use client";
import { AuthState, Signup } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [state, formAction] = useActionState(Signup, { error: null });

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Forge your path</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join PathForge and start learning with AI</p>
        </div>

        <div className="bg-card/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Email Address</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="name@example.com"
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/50 transition-all outline-none"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Create Password</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••"
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/50 transition-all outline-none"
                required 
              />
            </div>

            {state?.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs text-center animate-in fade-in zoom-in-95">
                {state.error}
              </div>
            )}

            <Button className="w-full h-12 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all mt-4 shadow-lg shadow-primary/20 group">
              <span className="flex items-center gap-2">
                Create Account <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}