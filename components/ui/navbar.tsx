import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          PathForge
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="cursor-pointer">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="cursor-pointer">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
