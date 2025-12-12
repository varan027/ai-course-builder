import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: Props) {
  return (
    <div className={`p-4 rounded-lg shadow-sm border bg-cardbgclr border-borderclr ${className}`}>
      {children}
    </div>
  );
}
