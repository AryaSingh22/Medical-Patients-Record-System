"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Demo only. Hook into your auth provider here.");
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Create account</h1>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Input label="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <Input type="email" label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <Input type="password" label="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <Button type="submit">Sign up</Button>
        </form>
        <p className="text-sm text-slate-600 mt-3">Already have an account? <Link className="text-blue-700" href="/auth/login">Log in</Link></p>
      </Card>
    </div>
  );
}
