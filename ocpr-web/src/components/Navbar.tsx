"use client";
import Link from "next/link";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="container-px mx-auto flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Stethoscope className="h-5 w-5" aria-hidden />
          </span>
          <span className="tracking-tight">MedicalPRS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-blue-700 transition">Home</Link>
          <Link href="/dashboard/patient" className="hover:text-blue-700 transition">Dashboard</Link>
          <Link href="/about" className="hover:text-blue-700 transition">About</Link>
          <Link href="/contact" className="hover:text-blue-700 transition">Contact</Link>
        </nav>
        <div className="md:hidden">
          <button className="btn-outline" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/30" onClick={() => setOpen(false)}>
          <div className="ml-auto h-full w-72 bg-white shadow-xl p-4 flex flex-col gap-2" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Menu</span>
              <button className="btn-outline" onClick={()=>setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Link onClick={()=>setOpen(false)} href="/" className="px-2 py-2 rounded hover:bg-slate-50">Home</Link>
            <Link onClick={()=>setOpen(false)} href="/dashboard/patient" className="px-2 py-2 rounded hover:bg-slate-50">Dashboard</Link>
            <Link onClick={()=>setOpen(false)} href="/about" className="px-2 py-2 rounded hover:bg-slate-50">About</Link>
            <Link onClick={()=>setOpen(false)} href="/contact" className="px-2 py-2 rounded hover:bg-slate-50">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
