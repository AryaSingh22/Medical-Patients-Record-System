import { ReactNode } from "react";
import clsx from "clsx";

export default function Alert({ variant = "info", children, className }: { variant?: "info" | "success" | "error" | "warning"; children: ReactNode; className?: string; }) {
  const base = "rounded-lg p-3 text-sm";
  const styles = {
    info: "bg-blue-50 text-blue-800 border border-blue-100",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-100",
    error: "bg-red-50 text-red-800 border border-red-100",
    warning: "bg-amber-50 text-amber-900 border border-amber-100",
  }[variant];
  return <div className={clsx(base, styles, className)}>{children}</div>;
}
