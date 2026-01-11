"use client";

import React, { useState } from "react";
import Logo from "./ui/Logo";
import { signOut, useSession } from "next-auth/react";
import { IoClose, IoLogOutOutline, IoMenu, IoRocket } from "react-icons/io5";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCoursePage = pathname?.includes("/dashboard/") && pathname?.split("/").length > 2;
  
  if (isCoursePage) return null;

  return (
<>
      <nav
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out
          ${
            isVisible
              ? "top-4 opacity-100 scale-100"
              : "-top-24 opacity-0 scale-95 pointer-events-none"
          }
          w-[90%] max-w-5xl glass
        `}
      >
        <div className="relative backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-primary/5 px-4 py-2 flex items-center justify-between">
          <div className="pl-2">
            <Logo />
          </div>

          <div className="flex items-center gap-3">
            {status === "authenticated" ? (
              <ProfileDropdown session={session} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <button className="px-4 py-2 text-xs font-medium text-graytext hover:text-white transition-colors">
                    Log in
                  </button>
                </Link>
                <Link href="/create-course">
                  <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                    <IoRocket /> Get Started
                  </button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-white bg-white/10 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl transition-all duration-300 md:hidden flex flex-col items-center justify-center space-y-8
          ${
            mobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      >
        <Link
          href="/create-course"
          className="text-2xl font-bold text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          Generator
        </Link>
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
        {status === "authenticated" && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xl font-bold text-red-400 flex items-center gap-2"
          >
            <IoLogOutOutline /> Logout
          </button>
        )}
      </div>
    </>
  );
};


export default NavBar;
