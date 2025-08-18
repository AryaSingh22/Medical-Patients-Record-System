"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", loading = false, children, disabled, ...rest },
  ref
) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 shadow"
      : variant === "outline"
      ? "border border-blue-200 text-blue-700 hover:bg-blue-50"
      : "text-slate-700 hover:bg-slate-100";
  return (
    <button ref={ref} className={clsx(base, styles, className)} disabled={disabled || loading} {...rest}>
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      )}
      {children}
    </button>
  );
});

export default Button;
