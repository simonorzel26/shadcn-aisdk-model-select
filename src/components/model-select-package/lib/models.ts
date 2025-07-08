import { AiModel } from '@/types/model';
import { AI_SDK_MODELS } from '@simonorzel26/ai-models';

type ModelGroup = { [key: string]: readonly string[] };
type Categories = { [key: string]: ModelGroup };

const allModels: AiModel[] = Object.entries(AI_SDK_MODELS).flatMap(
  ([provider, categories]: [string, Categories]) =>
    Object.entries(categories).flatMap(
      ([category, modelsGroup]: [string, ModelGroup]) =>
        Object.values(modelsGroup).flatMap((modelIds: readonly string[]) =>
          modelIds.map(
            (modelId): AiModel => ({
              value: `${provider}:${modelId}`,
              provider,
              model: modelId,
              label: modelId,
              category: category as AiModel['category'],
            }),
          ),
        ),
    ),
);

export const aiModels: AiModel[] = allModels;

export function getFilteredModels({
  providers,
  categories,
}: {
  providers?: string[];
  categories?: AiModel['category'][];
}): AiModel[] {
  let models: AiModel[] = allModels;

  if (providers && providers.length > 0) {
    models = models.filter(model => providers.includes(model.provider));
  }

  if (categories && categories.length > 0) {
    models = models.filter(model => categories.includes(model.category));
  }

  return models;
}

export const availableProviders = [...new Set(aiModels.map(model => model.provider))];