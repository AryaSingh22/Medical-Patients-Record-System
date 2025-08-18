import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="grid gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold">About</h1>
      <Card>
        <p className="text-slate-700 leading-7">
          Medical Patients Record System is a modern, privacy-first platform for managing electronic medical records. It provides a clean interface for patients to
          control consent and a powerful dashboard for clinicians to review records and analytics.
        </p>
      </Card>
    </div>
  );
}
