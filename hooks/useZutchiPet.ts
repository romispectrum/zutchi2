import { useState, useEffect, useCallback } from 'react';
import { useZutchiOnboard } from './useZutchiOnboard';
import { ZutchiData } from '../lib/zutchi.service';
import { GameStats, PetMood, ZutchiStatsTransformer } from '../lib/zutchiStats';

export interface UseZutchiPetReturn {
  // Pet state
  gameStats: GameStats | null;
  petMood: PetMood | null;
  
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
  
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [petMood, setPetMood] = useState<PetMood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform ZutchiData to GameStats when data changes
  useEffect(() => {
    if (zutchiData) {
      try {
        const stats = ZutchiStatsTransformer.transformToGameStats(zutchiData);
        setGameStats(stats);
        
        // Calculate pet mood based on stats
        const mood = ZutchiStatsTransformer.getPetMood(stats);
        setPetMood(mood);
      } catch (error) {
        console.error('Error transforming Zutchi data to game stats:', error);
        setError('Failed to process pet data');
      }
    } else {
      setGameStats(null);
      setPetMood(null);
    }
  }, [zutchiData]);

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
        const stats = ZutchiStatsTransformer.transformToGameStats(data);
        setGameStats(stats);
        
        const mood = ZutchiStatsTransformer.getPetMood(stats);
        setPetMood(mood);
      }
    } catch (err) {
      console.error('Error refreshing pet stats:', err);
      setError('Failed to refresh pet stats');
    }
  }, [zutchiService, tokenId]);

  // Auto-refresh stats when pet is busy
  useEffect(() => {
    if (!gameStats || (!gameStats.isWorking && !gameStats.isSleeping)) return;

    const interval = setInterval(() => {
      refreshPetStats();
    }, 10000); // Check every 10 seconds when busy

    return () => clearInterval(interval);
  }, [gameStats, refreshPetStats]);

  // Combine loading states
  const combinedLoading = isLoading || isOnboardingLoading;
  const combinedError = error || onboardingError;

  return {
    gameStats,
    petMood,
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
