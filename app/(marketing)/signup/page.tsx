"use client";
import { AuthState, login } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, { error: null });

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-muted-foreground mt-2">Sign up to start your learning journey.</p>
        </div>

        <div className="bg-card border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Email</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/50" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary/50" 
                required 
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                {state.error}
              </p>
            )}

            <Button className="w-full h-12 rounded-xl font-bold text-black bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Sign Up
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}