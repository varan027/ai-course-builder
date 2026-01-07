"use client";

import Link from "next/link";
import Button from "./ui/Button";
import Logo from "./ui/Logo";
import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const { data: session, status } = useSession();

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

        {status === "authenticated" ? (
          <div className="flex items-center gap-2">
            <p>{session.user.name}</p>
            <p className="bg-amber-600 h-9 w-9 flex items-center justify-center rounded-full">
              {session.user.name?.charAt(0)}
            </p>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to logout?")) {
                  signOut({ callbackUrl: "/" });
                }
              }}
              className="border border-red-900 p-2 rounded-lg hover:text-red-500 text-xs cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href={"/auth/signin"}>
              <Button>Login</Button>
            </Link>
            <Link href={"/auth/signup"}>
              <Button className="border-2 border-primary bg-primary/5 text-primary hover:text-black">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
