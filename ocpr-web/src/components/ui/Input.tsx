import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, label, hint, ...rest }, ref) {
  return (
    <label className="grid gap-1">
      {label && <span className="label">{label}</span>}
      <input ref={ref} className={clsx("input", className)} {...rest} />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
});

export default Input;
