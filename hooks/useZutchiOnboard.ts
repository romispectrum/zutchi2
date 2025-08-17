// hooks/useZutchiOnboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  ZutchiData,
  hasZutchi as svcHasZutchi,
  mintZutchi as svcMintZutchi,
  getCurrentTokenId as svcGetCurrentTokenId,
  getZutchiAttributes as svcGetZutchiAttributes,
} from "@/lib/zutchi.service";

export interface UseZutchiOnboardReturn {
  // State
  hasZutchi: boolean;
  tokenId: bigint | null;
  zutchiData: ZutchiData | null;
  isLoading: boolean;
  isMinting: boolean;
  error: string | null;

  // Actions
  checkZutchiStatus: () => Promise<void>;
  mintZutchi: () => Promise<bigint | null>;
  refreshZutchiData: () => Promise<void>;
}

export function useZutchiOnboard(): UseZutchiOnboardReturn {
  const { user, authenticated } = usePrivy();

  const [hasZutchi, setHasZutchi] = useState(false);
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [zutchiData, setZutchiData] = useState<ZutchiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userAddress = user?.wallet?.address as `0x${string}` | undefined;

  const checkZutchiStatus = useCallback(async () => {
    if (!authenticated || !userAddress) {
      setHasZutchi(false);
      setTokenId(null);
      setZutchiData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const owns = await svcHasZutchi(userAddress);
      setHasZutchi(owns);

      if (owns) {
        // NOTE: this gets the latest minted tokenId globally, not by owner.
        // Works for your current simplified flow; replace with a per-owner query if needed.
        const currentId = await svcGetCurrentTokenId();
        setTokenId(currentId);

        if (Number(currentId) > 0) {
          const data = await svcGetZutchiAttributes(currentId);
          setZutchiData(data);
        }
      } else {
        setTokenId(null);
        setZutchiData(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setHasZutchi(false);
      setTokenId(null);
      setZutchiData(null);
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, userAddress]);

  const mintZutchi = useCallback(async (): Promise<bigint | null> => {
    if (!authenticated || !userAddress) {
      setError("Wallet not connected");
      return null;
    }
    setIsMinting(true);
    setError(null);
    try {
      const { tokenId } = await svcMintZutchi();
      if (tokenId != null) {
        setHasZutchi(true);
        setTokenId(tokenId);
        const data = await svcGetZutchiAttributes(tokenId);
        setZutchiData(data);
        return tokenId;
      } else {
        setError("Mint transaction confirmed but tokenId not parsed.");
        return null;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setIsMinting(false);
    }
  }, [authenticated, userAddress]);

  const refreshZutchiData = useCallback(async () => {
    if (!tokenId) return;
    try {
      const data = await svcGetZutchiAttributes(tokenId);
      setZutchiData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [tokenId]);

  useEffect(() => {
    void checkZutchiStatus();
  }, [checkZutchiStatus]);

  // Optional: periodic refresh when user owns a token
  useEffect(() => {
    if (!hasZutchi || !tokenId) return;
    const id = setInterval(() => {
      void refreshZutchiData();
    }, 30_000);
    return () => clearInterval(id);
  }, [hasZutchi, tokenId, refreshZutchiData]);

  return {
    hasZutchi,
    tokenId,
    zutchiData,
    isLoading,
    isMinting,
    error,
    checkZutchiStatus,
    mintZutchi,
    refreshZutchiData,
  };
}
