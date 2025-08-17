"use client";
import React, { useMemo, useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { getAddress } from "@/lib/eth";
import { fetchCid } from "@/lib/ipfs";
import { decryptBytes } from "@/lib/crypto";

export default function ClinicianPortal() {
  const { contracts, chainId } = useContracts();
  const [recordIdInput, setRecordIdInput] = useState("");
  const [status, setStatus] = useState<string>("");
  const [content, setContent] = useState<string | null>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const canUse = useMemo(() => Boolean(contracts && chainId === 80002), [contracts, chainId]);

  async function viewRecord() {
    setStatus("");
    setContent(null);
    setPaused(false);
    try {
      if (!contracts?.accessManager || !contracts?.keyManager || !contracts?.recordManager) {
        return setStatus("Contracts not available or wrong network");
      }
      if (!recordIdInput) return setStatus("Enter recordId");
      const viewer = await getAddress();
      const recordId = BigInt(recordIdInput);
      const allowed: boolean = await contracts.accessManager.hasAccess(recordId, viewer);
      if (!allowed) {
        setStatus("No access to this record");
        return;
      }
      const rec = await contracts.recordManager.records(recordId);
      const cid: string = rec?.cid ?? "";
      if (!cid) {
        setStatus("Record has no CID");
        return;
      }
      const keyBlobCid: string = await contracts.keyManager.getKeyPointer(recordId, viewer);
      // In a real app, fetch and use the key. For placeholder, we ignore and proceed.
      const bytes = await fetchCid(cid);
      const plain = await decryptBytes(bytes);
      // Try decode as text
      const text = new TextDecoder().decode(plain);
      setContent(text);
      setStatus(`${keyBlobCid ? `Access granted. Key pointer CID: ${keyBlobCid}. ` : "Access granted. "}CID: ${cid}`);
    } catch (e) {
      const msg = (e as Error).message || String(e);
      if (msg.includes("Pausable: paused")) {
        setPaused(true);
      }
      setStatus(msg);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Clinician Portal</h1>
      {paused && (
        <div style={{ background: "#fff5cc", border: "1px solid #ffe58f", padding: 12 }}>
          <b>Maintenance:</b> The system is temporarily paused. Please try again later.
        </div>
      )}
      {!canUse ? (
        <div>Please connect wallet and switch to Polygon Amoy.</div>
      ) : (
        <section style={{ padding: 12, border: "1px solid #eee", display: "grid", gap: 8, maxWidth: 640 }}>
          <label>
            Record ID
            <input value={recordIdInput} onChange={(e) => setRecordIdInput(e.target.value)} placeholder="e.g. 1" />
          </label>
          <button onClick={viewRecord}>View</button>
          {status && <div><b>Status:</b> {status}</div>}
          {content && (
            <div>
              <h3>Record Content</h3>
              <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

