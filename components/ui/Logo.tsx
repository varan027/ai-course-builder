import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center bg-primary justify-center shadow">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 12h16"
              stroke="#052526"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 4v16"
              stroke="#052526"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Link href="/">
          <span className="font-semibold font-mono text-lg lg:text-2xl text-white hover:text-primary">
            LearnFlow
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Logo;
