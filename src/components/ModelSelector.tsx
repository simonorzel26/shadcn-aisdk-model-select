'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { DiscoveredModel } from '@/types/model-discovery';
import { useProviderSettings } from '@/hooks/useProviderSettings';

export interface ModelSelectorProps {
  models: DiscoveredModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const allProviders = useMemo(() => {
    return [...new Set(models.map(m => m.provider))];
  }, [models]);

  const { providerVisibility, isLoaded } = useProviderSettings();

  const visibleModels = useMemo(() => {
    if (!isLoaded) return [];
    return models.filter(model => providerVisibility[model.provider] !== false);
  }, [models, providerVisibility, isLoaded]);

  useEffect(() => {
    const isSelectedModelVisible = visibleModels.some(
      m => `${m.provider}:${m.modelId}` === selectedModel,
    );
    if (selectedModel && !isSelectedModelVisible) {
      onModelChange('');
    }
  }, [selectedModel, visibleModels, onModelChange]);

  const groupedModels = useMemo(() => {
    return visibleModels.reduce(
      (acc, model) => {
        if (!acc[model.provider]) {
          acc[model.provider] = [];
        }
        acc[model.provider].push(model);
        return acc;
      },
      {} as Record<string, DiscoveredModel[]>,
    );
  }, [visibleModels]);

  return (
    <div className="flex items-center gap-4">
      <Select onValueChange={onModelChange} value={selectedModel}>
        <SelectTrigger className="flex-grow">
          <SelectValue placeholder="Select a model..." />
        </SelectTrigger>
        <SelectContent className="max-h-96">
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider}>
              <div className="px-2 py-1.5 text-sm font-semibold capitalize">
                {provider}
              </div>
              {providerModels.map(model => (
                <SelectItem
                  key={`${provider}:${model.modelId}`}
                  value={`${provider}:${model.modelId}`}
                >
                  {model.modelId}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="h-10 w-10 shrink-0"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">API Key Settings</span>
      </Button>
      <ApiKeySettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        providers={allProviders}
      />
    </div>
  );
}