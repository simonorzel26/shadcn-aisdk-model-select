import { AiModel } from '@/types/model';
import { ALL_MODELS, getProviders, getModelsByProviders, getModelsByCategories } from '@simonorzel26/ai-models';

export const aiModels: AiModel[] = [...ALL_MODELS];

export function getFilteredModels({
  providers,
  categories,
}: {
  providers?: string[];
  categories?: AiModel['category'][];
}): AiModel[] {
  let models: AiModel[] = [...ALL_MODELS];

  if (providers && providers.length > 0) {
    models = [...getModelsByProviders(providers)];
  }

  if (categories && categories.length > 0) {
    if (providers && providers.length > 0) {
      // If both providers and categories are specified, filter the provider-filtered models by categories
      models = models.filter(model => categories.includes(model.category));
    } else {
      // If only categories are specified, use the direct function
      models = [...getModelsByCategories(categories)];
    }
  }

  return models;
}

export const availableProviders = getProviders();