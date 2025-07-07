import { useState, useEffect, useCallback } from 'react';
import { ProviderVisibilitySettings } from '@/types/model';

const STORAGE_KEY = 'ai-model-provider-settings';

export function useProviderSettings() {
  const [providerVisibility, setProviderVisibility] = useState<ProviderVisibilitySettings>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProviderVisibility(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load provider settings:', error);
    }
    setIsLoaded(true);
  }, []);

  const updateProviderVisibility = useCallback((provider: string, visible: boolean) => {
    setProviderVisibility(prev => {
      const updated = { ...prev, [provider]: visible };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save provider settings:', error);
      }
      return updated;
    });
  }, []);

  const setAllProviderVisibility = useCallback((settings: ProviderVisibilitySettings) => {
    setProviderVisibility(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save provider settings:', error);
    }
  }, []);

  const resetProviderVisibility = useCallback(() => {
    setProviderVisibility({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset provider settings:', error);
    }
  }, []);

  return {
    providerVisibility,
    isLoaded,
    updateProviderVisibility,
    setAllProviderVisibility,
    resetProviderVisibility,
  };
}