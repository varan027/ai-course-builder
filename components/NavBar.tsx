"use client";

import Link from "next/link";
import Button from "./ui/Button";
import Logo from "./ui/Logo";

const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-cardbgclr/80 border-b-2 rounded-b-2xl border-borderclr">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#898A8B]">
          <Link className="hover:text-primary" href="#features">
            Features
          </Link>
          <Link className="hover:text-primary" href="#how">
            How it works
          </Link>
          <Link className="hover:text-primary" href="#examples">
            Examples
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button className="hidden md:inline-flex rounded-md border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold">
            Sign in
          </Button>
          <Link href="/create-course">
            <Button className="font-semibold">Generate</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
