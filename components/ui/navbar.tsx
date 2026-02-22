import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-black font-black text-3xl">∬</span>
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            Syllarc
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link href="/signup">
            <Button className="h-10 px-5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all">
              Join for Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
