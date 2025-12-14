import { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export default function Textarea({ className = "", ...props }: Props) {
  return (
    <textarea
      className={`w-full px-3 py-2 bg-uibgclr text-sm rounded-lg
                  focus:outline-none ${className}`}
      {...props}
    />
  );
}
