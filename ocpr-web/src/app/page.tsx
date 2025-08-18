import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="grid gap-16">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Medical Patients Record System</h1>
          <p className="text-lg text-slate-600">Secure, consented, and privacy-preserving medical records with a modern, intuitive interface for patients and clinicians.</p>
          <div className="flex gap-3">
            <Link href="/dashboard/patient"><Button>Get Started</Button></Link>
            <Link href="/dashboard/admin"><Button variant="outline">Doctor/Admin Portal</Button></Link>
          </div>
          <p className="text-sm text-slate-500">Built with Next.js, TailwindCSS, and Recharts.</p>
        </div>
        <div className="relative h-72 sm:h-96">
          <Image
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1600&auto=format&fit=crop"
            alt="Healthcare illustration"
            fill
            className="rounded-2xl object-cover shadow-soft"
            priority
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Secure by Design", body: "End-to-end encryption and access control keep records safe." },
          { title: "Patient-Centric", body: "Patients manage consent and share records with providers." },
          { title: "Clinician Tools", body: "Fast search, dashboards, and analytics to streamline care." },
        ].map((f, i) => (
          <div key={i} className="card p-6">
            <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
            <p className="text-slate-600">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
