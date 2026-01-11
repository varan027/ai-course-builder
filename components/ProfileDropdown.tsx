import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoGridOutline, IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";

const ProfileDropdown = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative pl-2 md:pl-4 md:border-l border-white/10"
      ref={ref}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="hidden sm:block text-right leading-3">
          <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
            {session.user.name}
          </p>
          <p className="text-[10px] text-graytext">Free Plan</p>
        </div>

        <div className="relative">
          <div className="relative h-9 w-9 bg-uibgclr rounded-full flex items-center justify-center text-white font-bold border border-white/10 overflow-hidden cursor-pointer">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              session.user.name?.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-cardbgclr border border-borderclr rounded-xl shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 z-50">
          <div className="px-3 py-2 border-b border-borderclr/50 mb-1">
            <p className="text-xs text-graytext">Signed in as</p>
            <p className="text-sm font-semibold text-white truncate">
              {session.user.email}
            </p>
          </div>

          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-graytext hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
              <IoGridOutline /> Dashboard
            </div>
          </Link>

          <Link href="/profile" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-graytext hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
              <IoPersonCircleOutline /> My Profile
            </div>
          </Link>

          <div className="h-px bg-borderclr/50 my-1 mx-2"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              if (confirm("Are you sure you want to log out?"))
                signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
          >
            <IoLogOutOutline /> Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;