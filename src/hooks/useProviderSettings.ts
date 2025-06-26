'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'provider-visibility';
type ProviderVisibility = Record<string, boolean>;

export function useProviderSettings() {
  const [visibility, setVisibility] = useState<ProviderVisibility>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVisibility(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse provider visibility from storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setAllProviderVisibility = useCallback(
    (newVisibility: ProviderVisibility) => {
      setVisibility(newVisibility);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility));
    },
    [],
  );

  return {
    providerVisibility: visibility,
    setAllProviderVisibility,
    isLoaded,
  };
}