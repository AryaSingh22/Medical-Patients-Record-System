"use client";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "@/lib/eth";
import { getContracts, type Contracts } from "@/lib/contracts";

export function useContracts() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = getProvider();
        if (!mounted) return;
        setProvider(p);
        const net = await p.getNetwork();
        if (!mounted) return;
        setChainId(Number((net as any).chainId));
        const s = await getSigner();
        if (!mounted) return;
        setSigner(s);
      } catch (e) {
        // no wallet or user not connected yet
        setProvider(null);
        setSigner(null);
        setChainId(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const contracts: Contracts | null = useMemo(() => {
    if (!provider || (!signer && !provider) || chainId == null) return null;
    const sp = signer ?? provider;
    return getContracts(chainId, sp);
  }, [provider, signer, chainId]);

  return { provider, signer, chainId, contracts };
}
