import { useMemo } from 'react';
import { AiModel, ModelGroup, ModelSelectorConfig } from '@/types/model';

const models: AiModel[] = require('@simonorzel26/ai-models');

export function useModels(config?: ModelSelectorConfig) {
  const filteredModels = useMemo(() => {
    if (!config) return models;

    let filtered = models;

    if (config.enabledProviders) {
      filtered = filtered.filter(model =>
        config.enabledProviders!.includes(model.provider)
      );
    }

    if (config.enabledCategories) {
      filtered = filtered.filter(model =>
        config.enabledCategories!.includes(model.category)
      );
    }

    return filtered;
  }, [config]);

  const groupedModels = useMemo(() => {
    const groups: Record<string, AiModel[]> = {};

    filteredModels.forEach(model => {
      if (!groups[model.provider]) {
        groups[model.provider] = [];
      }
      groups[model.provider].push(model);
    });

    return Object.entries(groups).map(([provider, models]) => ({
      provider,
      models,
    }));
  }, [filteredModels]);

  const availableProviders = useMemo(() => {
    return [...new Set(filteredModels.map(model => model.provider))];
  }, [filteredModels]);

  return {
    models: filteredModels,
    groupedModels,
    availableProviders,
  };
}