import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing localStorage with TypeScript support
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

// Utility functions for managing Zutchi-specific data
export interface ZutchiLocalData {
  hasZutchi: boolean;
  tokenId: string | null;
  lastChecked: number;
  walletAddress: string;
}

const ZUTCHI_STORAGE_KEY = "zutchi_data";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to manage Zutchi NFT data in localStorage
 */
export function useZutchiLocalStorage() {
  const [zutchiData, setZutchiData] = useLocalStorage<ZutchiLocalData | null>(
    ZUTCHI_STORAGE_KEY,
    null
  );

  /**
   * Get cached Zutchi data for a specific wallet address
   */
  const getCachedZutchiData = useCallback(
    (walletAddress: string): ZutchiLocalData | null => {
      if (!zutchiData || zutchiData.walletAddress !== walletAddress) {
        return null;
      }

      // Check if cache is expired
      const now = Date.now();
      if (now - zutchiData.lastChecked > CACHE_EXPIRY) {
        return null;
      }

      return zutchiData;
    },
    [zutchiData]
  );

  /**
   * Cache Zutchi data for a specific wallet address
   */
  const cacheZutchiData = useCallback(
    (walletAddress: string, hasZutchi: boolean, tokenId: string | null) => {
      console.log("Caching Zutchi data:", {
        walletAddress,
        hasZutchi,
        tokenId,
      });
      const data: ZutchiLocalData = {
        hasZutchi,
        tokenId,
        lastChecked: Date.now(),
        walletAddress,
      };
      setZutchiData(data);
    },
    [setZutchiData]
  );

  /**
   * Clear cached data (e.g., when user disconnects wallet)
   */
  const clearZutchiData = useCallback(() => {
    console.log("Clearing Zutchi cache data");
    setZutchiData(null);
  }, [setZutchiData]);

  /**
   * Check if we have valid cached data for the given wallet
   */
  const hasValidCache = useCallback(
    (walletAddress: string): boolean => {
      const cached = getCachedZutchiData(walletAddress);
      return cached !== null;
    },
    [getCachedZutchiData]
  );

  return {
    getCachedZutchiData,
    cacheZutchiData,
    clearZutchiData,
    hasValidCache,
  };
}
