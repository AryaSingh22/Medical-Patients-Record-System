"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { getAddress, getSigner } from "@/lib/eth";
import { hash32, sha256Hex, encryptBytes } from "@/lib/crypto";
import { uploadBytes } from "@/lib/ipfs";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function PatientDashboard() {
  const { contracts, chainId } = useContracts();
  const [address, setAddress] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const [recordText, setRecordText] = useState("");
  const [creating, setCreating] = useState(false);
  const [records, setRecords] = useState<Array<{ recordId: bigint; cid: string }>>([]);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const addr = await getAddress();
        setAddress(addr);
      } catch {
        setAddress(null);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!contracts?.patientRegistry || !address) return;
      try {
        const ok: boolean = await contracts.patientRegistry.isRegistered(address);
        setRegistered(ok);
      } catch {
        setRegistered(null);
      }
    })();
  }, [contracts?.patientRegistry, address]);

  const canUse = useMemo(() => Boolean(contracts && chainId === 80002), [contracts, chainId]);

  async function connect() {
    try {
      await getSigner();
      const addr = await getAddress();
      setAddress(addr);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function doRegister() {
    if (!contracts?.patientRegistry) return;
    if (!name || !dob) return alert("Enter name and DOB");
    try {
      const nameHash = hash32(name.trim());
      const dobHash = hash32(dob.trim());
      const tx = await contracts.patientRegistry.registerPatient(nameHash, dobHash);
      await tx.wait?.();
      setRegistered(true);
      setName("");
      setDob("");
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function createRecord() {
    if (!contracts?.recordManager || !contracts?.patientRegistry || !address) return;
    if (!recordText.trim()) return alert("Enter record text");
    setCreating(true);
    try {
      const data = new TextEncoder().encode(recordText);
      const enc = await encryptBytes(data);
      const cid = await uploadBytes("record.txt", enc);
      const sha = sha256Hex(enc);
      const mimeTypeHash = hash32("text/plain");
      const patient = await contracts.patientRegistry.getPatient(address);
      const patientId: bigint = patient.patientId;
      const tx = await contracts.recordManager.createRecord(patientId, cid, sha, mimeTypeHash);
      const receipt = await tx.wait?.();
      let recordId: bigint | null = null;
      try {
        const createdEvt = receipt?.logs?.[0];
        recordId = (createdEvt as any)?.args?.recordId ?? 0n;
      } catch {}
      setRecords((prev) => [{ recordId: recordId ?? 0n, cid }, ...prev]);
      setRecordText("");
      alert(`Uploaded to IPFS: ${cid}`);
      setOpenCreate(false);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <div className="text-sm text-slate-600 flex items-center gap-3">
          <span><b>Wallet:</b> {address ?? "Not connected"}</span>
          <span><b>Network:</b> {chainId ?? "?"} {chainId !== 80002 ? "(Switch to Polygon Amoy)" : ""}</span>
          <Button variant="outline" onClick={connect}>Connect Wallet</Button>
        </div>
      </div>

      {!canUse ? (
        <AlertMessage>Please connect wallet and switch to Polygon Amoy.</AlertMessage>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Registration</h3>
            <p className="text-sm text-slate-600 mb-3">Status: {registered == null ? "Unknown" : registered ? "Registered" : "Not registered"}</p>
            {!registered && (
              <div className="grid gap-3">
                <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="DOB" placeholder="YYYY-MM-DD" value={dob} onChange={(e) => setDob(e.target.value)} />
                <Button onClick={doRegister}>Register</Button>
              </div>
            )}
          </Card>

          <Card className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Records</h3>
              <Button onClick={() => setOpenCreate(true)}>New Record</Button>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {records.length === 0 && <li className="text-slate-500">No records this session yet.</li>}
              {records.map((r, i) => (
                <li key={i} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">recordId:</span> <span>{r.recordId.toString()}</span>
                  </div>
                  <div className="text-slate-600 break-all">cid: {r.cid}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Modal open={openCreate} title="Create Record" onClose={() => setOpenCreate(false)}>
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="label">Record text</span>
            <textarea rows={6} placeholder="Record text" value={recordText} onChange={(e) => setRecordText(e.target.value)} className="input min-h-[140px]" />
          </label>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button onClick={createRecord} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AlertMessage({ children }: { children: React.ReactNode }) {
  return <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3">{children}</div>;
}
