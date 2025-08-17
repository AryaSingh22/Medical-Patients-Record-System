"use client";
import { ethers } from "ethers";
import { patientRegistryAbi } from "@/abi/patientRegistry";
import { recordManagerAbi } from "@/abi/recordManager";
import { accessManagerAbi } from "@/abi/accessManager";
import { keyManagerAbi } from "@/abi/keyManager";
import addresses from "./addresses.json";

export type Contracts = {
  patientRegistry: ethers.Contract | null;
  recordManager: ethers.Contract | null;
  accessManager: ethers.Contract | null;
  keyManager: ethers.Contract | null;
};

// Polygon Amoy chainId = 80002
export const CONTRACTS: Record<number, {
  PatientRegistry: string;
  RecordManager: string;
  AccessManager: string;
  KeyManager: string;
}> = {
  80002: {
    PatientRegistry: (addresses as any)?.PatientRegistry || process.env.NEXT_PUBLIC_PATIENT_REGISTRY || "",
    RecordManager: (addresses as any)?.RecordManager || process.env.NEXT_PUBLIC_RECORD_MANAGER || "",
    AccessManager: (addresses as any)?.AccessManager || process.env.NEXT_PUBLIC_ACCESS_MANAGER || "",
    KeyManager: (addresses as any)?.KeyManager || process.env.NEXT_PUBLIC_KEY_MANAGER || "",
  },
};

function safeContract(address: string, abi: any, signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract | null {
  try {
    if (!ethers.isAddress(address)) return null;
    return new ethers.Contract(address, abi as any, signerOrProvider);
  } catch {
    return null;
  }
}

export function getContracts(
  chainId: number,
  signerOrProvider: ethers.Signer | ethers.Provider
): Contracts {
  const cfg = CONTRACTS[chainId];
  if (!cfg) {
    return {
      patientRegistry: null,
      recordManager: null,
      accessManager: null,
      keyManager: null,
    };
  }
  return {
    patientRegistry: safeContract(cfg.PatientRegistry, patientRegistryAbi, signerOrProvider),
    recordManager: safeContract(cfg.RecordManager, recordManagerAbi, signerOrProvider),
    accessManager: safeContract(cfg.AccessManager, accessManagerAbi, signerOrProvider),
    keyManager: safeContract(cfg.KeyManager, keyManagerAbi, signerOrProvider),
  };
}

