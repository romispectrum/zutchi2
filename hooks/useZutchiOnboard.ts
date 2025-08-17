import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ZutchiService, ZutchiData } from '../lib/zutchi.service';

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
  
  const [zutchiService, setZutchiService] = useState<ZutchiService | null>(null);

  // Initialize Zutchi service when wallet is available
  useEffect(() => {
    if (user?.wallet && authenticated) {
      try {
        // For injected wallets, try to access the ethereum provider directly
        let walletToUse = user.wallet;
        
        // If it's an injected wallet, try to get the ethereum provider
        if (user.wallet.connectorType === 'injected' && typeof window !== 'undefined') {
          const ethereum = (window as any).ethereum;
          if (ethereum && ethereum.isConnected && ethereum.isConnected()) {
            walletToUse = ethereum;
          }
        }
        
        const service = new ZutchiService(walletToUse);
        setZutchiService(service);
      } catch (error) {
        console.error('Error creating ZutchiService:', error);
        setZutchiService(null);
        setError('Failed to initialize wallet service: ' + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      setZutchiService(null);
    }
  }, [user?.wallet, authenticated]);

  // Check if user has a Zutchi NFT
  const checkZutchiStatus = useCallback(async () => {
    if (!zutchiService || !user?.wallet?.address) {
      setHasZutchi(false);
      setTokenId(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userAddress = user.wallet.address;
      const hasNFT = await zutchiService.hasZutchi(userAddress);
      
      setHasZutchi(hasNFT);
      
      if (hasNFT) {
        // Get the token ID (simplified - you might need to implement proper token ID retrieval)
        const currentId = await zutchiService.getCurrentTokenId();
        setTokenId(currentId);
        
        // Get Zutchi data
        if (currentId >= 0) {
          const data = await zutchiService.getZutchiAttributes(currentId);
          setZutchiData(data);
        }
      } else {
        setTokenId(null);
        setZutchiData(null);
      }
    } catch (err) {
      console.error('Error checking Zutchi status:', err);
      setError('Failed to check Zutchi status: ' + (err instanceof Error ? err.message : String(err)));
      setHasZutchi(false);
      setTokenId(null);
    } finally {
      setIsLoading(false);
    }
  }, [zutchiService, user?.wallet?.address]);

  // Mint a new Zutchi NFT
  const mintZutchi = useCallback(async (): Promise<bigint | null> => {
    if (!zutchiService || !user?.wallet?.address) {
      setError('Wallet not connected');
      return null;
    }

    setIsMinting(true);
    setError(null);

    try {
      const newTokenId = await zutchiService.mintZutchi();
      
      if (newTokenId) {
        setHasZutchi(true);
        setTokenId(newTokenId);
        
        // Get the newly minted Zutchi data
        const data = await zutchiService.getZutchiAttributes(newTokenId);
        setZutchiData(data);
        
        return newTokenId;
      } else {
        setError('Failed to mint Zutchi');
        return null;
      }
    } catch (err) {
      console.error('Error minting Zutchi:', err);
      setError('Failed to mint Zutchi');
      return null;
    } finally {
      setIsMinting(false);
    }
  }, [zutchiService, user?.wallet?.address]);

  // Refresh Zutchi data
  const refreshZutchiData = useCallback(async () => {
    if (!zutchiService || !tokenId) return;

    try {
      const data = await zutchiService.getZutchiAttributes(tokenId);
      setZutchiData(data);
    } catch (err) {
      console.error('Error refreshing Zutchi data:', err);
      setError('Failed to refresh Zutchi data');
    }
  }, [zutchiService, tokenId]);

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
