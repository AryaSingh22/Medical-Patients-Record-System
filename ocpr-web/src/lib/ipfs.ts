"use client";
import { createClient } from "@web3-storage/w3up-client";

let client: any = null;

async function getClient() {
  if (client) return client;

  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  if (!token) throw new Error("Missing NEXT_PUBLIC_WEB3_STORAGE_TOKEN");

  client = await createClient();
  await client.setToken(token);
  return client;
}

export async function uploadBytes(name: string, bytes: Uint8Array): Promise<string> {
  const client = await getClient();
  const file = new File([bytes], name);
  const cid = await client.uploadFile(file);
  return cid.toString();
}

export async function uploadJSON(name: string, obj: unknown): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  return uploadBytes(name, data);
}

export async function fetchCid(cid: string): Promise<Uint8Array> {
  const res = await fetch(`https://w3s.link/ipfs/${cid}`);
  if (!res.ok) throw new Error(`Failed to fetch CID ${cid}`);
  return new Uint8Array(await res.arrayBuffer());
}

