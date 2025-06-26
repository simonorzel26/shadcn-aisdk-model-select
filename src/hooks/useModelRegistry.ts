import { useMemo } from 'react';
import { createRegistry } from '@/config/providers';
import { useApiKeys } from './useApiKeys';

export function useModelRegistry() {
  const { apiKeys, isLoaded } = useApiKeys();

  const registry = useMemo(() => {
    if (!isLoaded) return null;

    const hasAnyKeys = Object.values(apiKeys).some(key => key && key.trim() !== '');
    if (!hasAnyKeys) return null;

    return createRegistry(apiKeys);
  }, [apiKeys, isLoaded]);

    const getModelFromId = (modelId: string) => {
    if (!registry) return null;

    try {
      return registry.languageModel(modelId as `${string}:${string}`);
    } catch (error) {
      console.error('Failed to get model:', error);
      return null;
    }
  };

  return {
    registry,
    getModelFromId,
    isLoaded
  };
}