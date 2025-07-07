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
import { AiModel } from '@/types/model';
import { useProviderSettings } from '@/hooks/useProviderSettings';
import { getProviderDisplayName, getModelDisplayName } from '@/lib/config';

export interface ModelSelectDropdownProps {
  models: AiModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

export function ModelSelectDropdown({
  models,
  selectedModel,
  onModelChange,
  className,
}: ModelSelectDropdownProps) {
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
      m => m.value === selectedModel,
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
      {} as Record<string, AiModel[]>,
    );
  }, [visibleModels]);

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <Select onValueChange={onModelChange} value={selectedModel}>
        <SelectTrigger className="flex-grow">
          <SelectValue placeholder="Select a model..." />
        </SelectTrigger>
        <SelectContent className="max-h-96">
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider}>
              <div className="px-2 py-1.5 text-sm font-semibold">
                {getProviderDisplayName(provider)}
              </div>
              {providerModels.map(model => (
                <SelectItem
                  key={model.value}
                  value={model.value}
                >
                  {getModelDisplayName(model.model)}
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