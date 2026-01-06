"use client";

import Link from "next/link";
import Button from "./ui/Button";
import Logo from "./ui/Logo";
import Login from "./Login";

const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-borderclr/60">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#898A8B]">
          <Link className="hover:text-primary" href="#features">
            Features 
          </Link>
          <Link className="hover:text-primary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-primary" href="#examples">
            Examples
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Login/>
          <Link href="/create-course">
            <Button className="font-semibold bg-primary/75">Generate</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
