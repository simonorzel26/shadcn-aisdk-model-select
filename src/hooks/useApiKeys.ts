import { useState, useEffect } from 'react';
import { ProviderApiKeys } from '@/types/model';

const API_KEYS_STORAGE_KEY = 'llm-model-selector-api-keys';

export function useApiKeys() {
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

  const updateApiKeys = (newKeys: ProviderApiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(newKeys));
  };

  const getAvailableProviders = () => {
    return Object.entries(apiKeys)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([key]) => key);
  };

  return {
    apiKeys,
    updateApiKeys,
    getAvailableProviders,
    isLoaded
  };
}