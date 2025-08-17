"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { getAddress, getSigner } from "@/lib/eth";
import { hash32, sha256Hex, encryptBytes } from "@/lib/crypto";
import { uploadBytes, uploadJSON } from "@/lib/ipfs";

export default function PatientDashboard() {
  const { contracts, chainId } = useContracts();
  const [address, setAddress] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);

  // registration form
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  // record creation form
  const [recordText, setRecordText] = useState("");
  const [creating, setCreating] = useState(false);

  // local records list (in-memory)
  const [records, setRecords] = useState<Array<{ recordId: bigint; cid: string }>>([]);

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
      // minimal: ask user for patientId if needed. For MVP, call getPatient to fetch patient's id.
      const patient = await contracts.patientRegistry.getPatient(address);
      const patientId: bigint = patient.patientId;
      const tx = await contracts.recordManager.createRecord(patientId, cid, sha, mimeTypeHash);
      const receipt = await tx.wait?.();
      // best effort: parse event from receipt
      let recordId: bigint | null = null;
      try {
        const createdEvt = receipt?.logs?.[0];
        // not robust; in real app decode properly
        // fallback: set to 0n
        recordId = (createdEvt as any)?.args?.recordId ?? 0n;
      } catch {}
      setRecords((prev) => [{ recordId: recordId ?? 0n, cid }, ...prev]);
      setRecordText("");
      alert(`Uploaded to IPFS: ${cid}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Patient Dashboard</h1>
      <div>
        <div><b>Wallet:</b> {address ?? "Not connected"}</div>
        <div><b>Network:</b> {chainId ?? "?"} {chainId !== 80002 ? "(Switch to Polygon Amoy)" : ""}</div>
        <button onClick={connect}>Connect Wallet</button>
      </div>

      {canUse ? (
        <>
          <section style={{ padding: 12, border: "1px solid #eee" }}>
            <h3>Registration</h3>
            <div>Status: {registered == null ? "Unknown" : registered ? "Registered" : "Not registered"}</div>
            {!registered && (
              <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="DOB (YYYY-MM-DD)" value={dob} onChange={(e) => setDob(e.target.value)} />
                <button onClick={doRegister}>Register</button>
              </div>
            )}
          </section>

          {registered && (
            <section style={{ padding: 12, border: "1px solid #eee" }}>
              <h3>Create Record</h3>
              <textarea rows={6} placeholder="Record text" value={recordText} onChange={(e) => setRecordText(e.target.value)} />
              <div>
                <button onClick={createRecord} disabled={creating}>{creating ? "Creating..." : "Create"}</button>
              </div>
            </section>
          )}

          <section style={{ padding: 12, border: "1px solid #eee" }}>
            <h3>Your Records (local session)</h3>
            <ul>
              {records.map((r, i) => (
                <li key={i}>recordId: {r.recordId.toString()} — cid: {r.cid}</li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <div>Please connect wallet and switch to Polygon Amoy.</div>
      )}
    </div>
  );
}
