"use client";
import { ReactNode } from "react";
import Button from "./Button";

export default function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-lg" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-outline" onClick={onClose}>Close</button>
        </div>
        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
