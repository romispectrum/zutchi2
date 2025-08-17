import { useState, useEffect, useCallback } from 'react';
import { useZutchiOnboard } from './useZutchiOnboard';
import { ZutchiData } from '../lib/zutchi.service';

export interface PetStats {
  energy: number;
  health: number;
  level: number;
  xp: number;
  nutrition: number;
  isBusy: boolean;
  freeAtBlock: bigint;
  hungryAtBlock: bigint;
  lastAteAt: bigint;
}

export interface UseZutchiPetReturn {
  // Pet state
  petStats: PetStats | null;
  isHungry: boolean;
  isTired: boolean;
  isWorking: boolean;
  isSleeping: boolean;
  
  // Actions
  feedPet: (foodAmount: number) => Promise<boolean>;
  putPetToSleep: (duration: number) => Promise<boolean>;
  putPetToWork: (duration: number) => Promise<boolean>;
  wakePetUp: () => Promise<boolean>;
  endWork: () => Promise<boolean>;
  
  // Status
  isLoading: boolean;
  error: string | null;
  
  // Refresh
  refreshPetStats: () => Promise<void>;
}

export function useZutchiPet(): UseZutchiPetReturn {
  const { 
    hasZutchi, 
    tokenId, 
    zutchiData, 
    zutchiService, 
    isLoading: isOnboardingLoading,
    error: onboardingError 
  } = useZutchiOnboard();
  
  const [petStats, setPetStats] = useState<PetStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert ZutchiData to PetStats
  const convertToPetStats = useCallback((data: ZutchiData): PetStats => {
    return {
      energy: Number(data.energy),
      health: Number(data.health),
      level: Number(data.level),
      xp: Number(data.xp),
      nutrition: Number(data.nutrition),
      isBusy: data.isBusy,
      freeAtBlock: data.freeAtBlock,
      hungryAtBlock: data.hungryAtBlock,
      lastAteAt: data.lastAteAt,
    };
  }, []);

  // Update pet stats when Zutchi data changes
  useEffect(() => {
    if (zutchiData) {
      setPetStats(convertToPetStats(zutchiData));
    } else {
      setPetStats(null);
    }
  }, [zutchiData, convertToPetStats]);

  // Calculate pet status
  const isHungry = petStats ? Number(petStats.hungryAtBlock) < Date.now() / 1000 : false;
  const isTired = petStats ? petStats.energy < 30 : false;
  const isWorking = petStats ? petStats.isBusy && Number(petStats.freeAtBlock) > Date.now() / 1000 : false;
  const isSleeping = petStats ? petStats.isBusy && !isWorking : false;

  // Feed the pet
  const feedPet = useCallback(async (foodAmount: number): Promise<boolean> => {
    if (!zutchiService || !tokenId) {
      setError('Pet not available');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await zutchiService.feedZutchi(tokenId, BigInt(foodAmount));
      
      if (success) {
        // Refresh pet stats
        await refreshPetStats();
        return true;
      } else {
        setError('Failed to feed pet');
        return false;
      }
    } catch (err) {
      console.error('Error feeding pet:', err);
      setError('Failed to feed pet');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [zutchiService, tokenId]);

  // Put pet to sleep
  const putPetToSleep = useCallback(async (duration: number): Promise<boolean> => {
    if (!zutchiService || !tokenId) {
      setError('Pet not available');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await zutchiService.putToSleep(tokenId, BigInt(duration));
      
      if (success) {
        // Refresh pet stats
        await refreshPetStats();
        return true;
      } else {
        setError('Failed to put pet to sleep');
        return false;
      }
    } catch (err) {
      console.error('Error putting pet to sleep:', err);
      setError('Failed to put pet to sleep');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [zutchiService, tokenId]);

  // Put pet to work
  const putPetToWork = useCallback(async (duration: number): Promise<boolean> => {
    if (!zutchiService || !tokenId) {
      setError('Pet not available');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await zutchiService.putToWork(tokenId, BigInt(duration));
      
      if (success) {
        // Refresh pet stats
        await refreshPetStats();
        return true;
      } else {
        setError('Failed to put pet to work');
        return false;
      }
    } catch (err) {
      console.error('Error putting pet to work:', err);
      setError('Failed to put pet to work');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [zutchiService, tokenId]);

  // Wake pet up (end sleep)
  const wakePetUp = useCallback(async (): Promise<boolean> => {
    // This would require a contract function to end sleep early
    // For now, we'll just refresh the stats
    await refreshPetStats();
    return true;
  }, []);

  // End work (end work early)
  const endWork = useCallback(async (): Promise<boolean> => {
    // This would require a contract function to end work early
    // For now, we'll just refresh the stats
    await refreshPetStats();
    return true;
  }, []);

  // Refresh pet stats
  const refreshPetStats = useCallback(async () => {
    if (!zutchiService || !tokenId) return;

    try {
      const data = await zutchiService.getZutchiAttributes(tokenId);
      if (data) {
        setPetStats(convertToPetStats(data));
      }
    } catch (err) {
      console.error('Error refreshing pet stats:', err);
      setError('Failed to refresh pet stats');
    }
  }, [zutchiService, tokenId, convertToPetStats]);

  // Auto-refresh stats when pet is busy
  useEffect(() => {
    if (!isWorking && !isSleeping) return;

    const interval = setInterval(() => {
      refreshPetStats();
    }, 10000); // Check every 10 seconds when busy

    return () => clearInterval(interval);
  }, [isWorking, isSleeping, refreshPetStats]);

  // Combine loading states
  const combinedLoading = isLoading || isOnboardingLoading;
  const combinedError = error || onboardingError;

  return {
    petStats,
    isHungry,
    isTired,
    isWorking,
    isSleeping,
    feedPet,
    putPetToSleep,
    putPetToWork,
    wakePetUp,
    endWork,
    isLoading: combinedLoading,
    error: combinedError,
    refreshPetStats,
  };
}
