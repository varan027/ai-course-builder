"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        group
        inline-flex
        items-center
        gap-3
        rounded-2xl
        bg-white
        text-black
        px-6
        h-12
        font-medium
        transition-all
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Building Roadmap
        </>
      ) : (
        <>
          Create Goal
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}