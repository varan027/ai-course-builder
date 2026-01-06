import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: Props) {
  return (
    <div className={`p-4 rounded-lg shadow-sm border-2 hover:scale-102 hover:border-primary/20 bg-cardbgclr border-borderclr hover:shadow-[0px_0px_1000px] hover:shadow-primary/5 ease-in transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
