"use client";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

export function getProvider(): ethers.BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask.");
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}

export async function getAddress(): Promise<string> {
  const signer = await getSigner();
  return await signer.getAddress();
}
