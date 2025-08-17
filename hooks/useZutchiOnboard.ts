import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ZutchiService, ZutchiData } from "../lib/zutchi.service";
import { useZutchiLocalStorage } from "./useLocalStorage";

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

  // Service
  zutchiService: ZutchiService | null;
}

export function useZutchiOnboard(): UseZutchiOnboardReturn {
  const { user, authenticated } = usePrivy();

  const [hasZutchi, setHasZutchi] = useState(false);
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [zutchiData, setZutchiData] = useState<ZutchiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [zutchiService, setZutchiService] = useState<ZutchiService | null>(
    null
  );

  // Local storage hooks
  const {
    getCachedZutchiData,
    cacheZutchiData,
    clearZutchiData,
    hasValidCache,
  } = useZutchiLocalStorage();

  // Immediate cache check on mount (before service is ready)
  useEffect(() => {
    if (user?.wallet?.address && authenticated) {
      const walletAddress = user.wallet.address;
      const cachedData = getCachedZutchiData(walletAddress);
      if (cachedData) {
        console.log("Loading cached Zutchi data on mount:", cachedData);
        setHasZutchi(cachedData.hasZutchi);
        setTokenId(cachedData.tokenId ? BigInt(cachedData.tokenId) : null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.wallet?.address, authenticated]); // Intentionally excluding getCachedZutchiData to prevent re-renders

  // Initialize Zutchi service when wallet is available
  useEffect(() => {
    if (user?.wallet && authenticated) {
      try {
        // For injected wallets, try to access the ethereum provider directly
        let walletToUse = user.wallet;

        // If it's an injected wallet, try to get the ethereum provider
        if (
          user.wallet.connectorType === "injected" &&
          typeof window !== "undefined"
        ) {
          const ethereum = (window as any).ethereum;
          if (ethereum && ethereum.isConnected && ethereum.isConnected()) {
            walletToUse = ethereum;
          }
        }

        const service = new ZutchiService(walletToUse);
        setZutchiService(service);
      } catch (error) {
        console.error("Error creating ZutchiService:", error);
        setZutchiService(null);
        setError(
          "Failed to initialize wallet service: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    } else {
      setZutchiService(null);
      // Clear state when wallet disconnects
      setHasZutchi(false);
      setTokenId(null);
      setZutchiData(null);
      clearZutchiData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.wallet, authenticated]); // Intentionally excluding clearZutchiData to prevent re-renders

  // Check if user has a Zutchi NFT
  const checkZutchiStatus = useCallback(async () => {
    if (!zutchiService || !user?.wallet?.address) {
      setHasZutchi(false);
      setTokenId(null);
      return;
    }

    const walletAddress = user.wallet.address;

    // First, check if we have valid cached data
    const cachedData = getCachedZutchiData(walletAddress);
    if (cachedData) {
      console.log("Using cached Zutchi data:", cachedData);
      setHasZutchi(cachedData.hasZutchi);
      setTokenId(cachedData.tokenId ? BigInt(cachedData.tokenId) : null);

      // If user has a Zutchi, try to get the latest data
      if (cachedData.hasZutchi && cachedData.tokenId) {
        try {
          const data = await zutchiService.getZutchiAttributes(
            BigInt(cachedData.tokenId)
          );
          setZutchiData(data);
        } catch (err) {
          console.warn("Error refreshing Zutchi data:", err);
        }
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userAddress = user.wallet.address;
      const hasNFT = await zutchiService.hasZutchi(userAddress);

      setHasZutchi(hasNFT);

      if (hasNFT) {
        // Get the user's token ID
        const currentId = await zutchiService.getZutchiTokenId(userAddress);
        setTokenId(currentId);

        // Cache the data
        cacheZutchiData(
          walletAddress,
          true,
          currentId ? currentId.toString() : null
        );

        // Get Zutchi data
        if (currentId && currentId > 0) {
          const data = await zutchiService.getZutchiAttributes(currentId);
          setZutchiData(data);
        }
      } else {
        setTokenId(null);
        setZutchiData(null);

        // Cache the negative result
        cacheZutchiData(walletAddress, false, null);
      }
    } catch (err) {
      console.error("Error checking Zutchi status:", err);
      setError(
        "Failed to check Zutchi status: " +
          (err instanceof Error ? err.message : String(err))
      );
      setHasZutchi(false);
      setTokenId(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zutchiService, user?.wallet?.address]); // Intentionally excluding cache functions to prevent re-renders

  // Mint a new Zutchi NFT
  const mintZutchi = useCallback(async (): Promise<bigint | null> => {
    if (!zutchiService || !user?.wallet?.address) {
      setError("Wallet not connected");
      return null;
    }

    setIsMinting(true);
    setError(null);

    try {
      const newTokenId = await zutchiService.mintZutchi();

      if (newTokenId) {
        setHasZutchi(true);
        setTokenId(newTokenId);

        // Cache the minted NFT data
        const walletAddress = user.wallet.address;
        cacheZutchiData(walletAddress, true, newTokenId.toString());

        // Get the newly minted Zutchi data
        const data = await zutchiService.getZutchiAttributes(newTokenId);
        setZutchiData(data);

        return newTokenId;
      } else {
        setError("Failed to mint Zutchi");
        return null;
      }
    } catch (err) {
      console.error("Error minting Zutchi:", err);
      setError("Failed to mint Zutchi");
      return null;
    } finally {
      setIsMinting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zutchiService, user?.wallet?.address]); // Intentionally excluding cacheZutchiData to prevent re-renders

  // Refresh Zutchi data
  const refreshZutchiData = useCallback(async () => {
    if (!zutchiService || !tokenId) return;

    try {
      const data = await zutchiService.getZutchiAttributes(tokenId);
      setZutchiData(data);
    } catch (err) {
      console.error("Error refreshing Zutchi data:", err);
      setError("Failed to refresh Zutchi data");
    }
  }, [zutchiService, tokenId]);

  // Immediate cache check on mount (before service is ready)
  useEffect(() => {
    if (user?.wallet?.address && authenticated) {
      const walletAddress = user.wallet.address;
      const cachedData = getCachedZutchiData(walletAddress);
      if (cachedData) {
        console.log("Loading cached Zutchi data on mount:", cachedData);
        setHasZutchi(cachedData.hasZutchi);
        setTokenId(cachedData.tokenId ? BigInt(cachedData.tokenId) : null);
      }
    }
  }, [user?.wallet?.address, authenticated]); // Removed getCachedZutchiData from dependencies

  // Auto-check Zutchi status when service is ready
  useEffect(() => {
    checkZutchiStatus();
  }, [checkZutchiStatus]);

  // Auto-refresh data periodically when user has a Zutchi
  useEffect(() => {
    if (!hasZutchi || !tokenId) return;

    const interval = setInterval(() => {
      refreshZutchiData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
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
    zutchiService,
  };
}
