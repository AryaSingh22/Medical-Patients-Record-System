"use client";
import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// Mock data for charts and table
const stats = [
  { name: "Mon", patients: 12, records: 34 },
  { name: "Tue", patients: 20, records: 41 },
  { name: "Wed", patients: 15, records: 28 },
  { name: "Thu", patients: 22, records: 45 },
  { name: "Fri", patients: 18, records: 36 },
  { name: "Sat", patients: 10, records: 20 },
  { name: "Sun", patients: 8, records: 12 },
];

const allPatients = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: `Patient ${i + 1}`,
  dob: `199${(i % 10)}-0${(i % 9) + 1}-1${i % 9}`,
  lastVisit: `2025-08-${(i % 28) + 1}`,
}));

export default function AdminDashboard() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => allPatients.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || String(p.id) === q), [q]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Doctor/Admin Dashboard</h1>
          <p className="text-slate-600">View patients, search, and monitor activity.</p>
        </div>
        <div className="w-full sm:w-80">
          <Input placeholder="Search by name or ID" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-3">Patients per Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#3b82f6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-3">Records Created</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="records" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">All Patients</h3>
          <Button variant="outline">Add Patient</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">DOB</th>
                <th className="py-2 pr-4">Last Visit</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-2 pr-4 font-medium">{p.id}</td>
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{p.dob}</td>
                  <td className="py-2 pr-4">{p.lastVisit}</td>
                  <td className="py-2 pr-4">
                    <Button variant="outline" className="mr-2">View</Button>
                    <Button>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
