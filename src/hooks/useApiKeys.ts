import { useState, useEffect, useCallback } from 'react';
import { ProviderApiKeys } from '@/types/model';

const API_KEYS_STORAGE_KEY = 'llm-model-selector-api-keys';

export function useApiKeys(providers: string[]) {
  const [apiKeys, setApiKeys] = useState<ProviderApiKeys>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (storedKeys) {
      try {
        setApiKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const setApiKey = useCallback((provider: string, key: string) => {
    setApiKeys(prevKeys => {
      const newKeys = { ...prevKeys, [provider]: key };
      try {
        localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(newKeys));
      } catch (error) {
        console.error('Failed to save API key to localStorage', error);
      }
      return newKeys;
    });
  }, []);

  const getAvailableProviders = () => {
    return Object.entries(apiKeys)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([key]) => key);
  };

  return {
    apiKeys,
    setApiKey,
    getAvailableProviders,
    isLoaded
  };
}