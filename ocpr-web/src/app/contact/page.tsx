"use client";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Thanks for reaching out! This is a demo form.");
  }

  return (
    <div className="max-w-2xl mx-auto grid gap-6">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <Card>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Input label="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <Input type="email" label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <label className="grid gap-1">
            <span className="label">Message</span>
            <textarea className="input min-h-[140px]" value={message} onChange={(e)=>setMessage(e.target.value)} required />
          </label>
          <div className="flex items-center justify-end">
            <Button type="submit">Send</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
