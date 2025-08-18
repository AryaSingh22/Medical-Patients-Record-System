import { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("card p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}
