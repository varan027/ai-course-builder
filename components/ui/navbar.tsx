import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#0b0b0b]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight text-white">
              Syllarc
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Learning Architecture
            </span>
          </div>
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
    </header>
  );
}
