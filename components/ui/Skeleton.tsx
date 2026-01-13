import { HTMLAttributes } from "react";

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };