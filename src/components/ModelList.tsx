'use client';

import { useMemo } from 'react';
import { SelectItem } from '@/components/ui/select';
import { AiModel } from '@/types/model';

export function ModelList({ models }: { models: AiModel[] }) {
  const groupedModels = useMemo(() => {
    return models.reduce(
      (acc, model) => {
        if (!acc[model.provider]) {
          acc[model.provider] = [];
        }
        acc[model.provider].push(model);
        return acc;
      },
      {} as Record<string, AiModel[]>,
    );
  }, [models]);

  if (Object.keys(groupedModels).length === 0) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        No models available to display.
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedModels).map(([provider, providerModels]) => (
        <div key={provider}>
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            {provider}
          </div>
          {providerModels.map((model, index) => (
            <SelectItem
              key={`${model.provider}-${model.model}-${index}`}
              value={model.value}
              className="pl-6"
            >
              <span className="text-xs">{model.model}</span>
            </SelectItem>
          ))}
        </div>
      ))}
    </>
  );
}