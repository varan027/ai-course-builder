"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 rounded-xl font-bold text-black bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}