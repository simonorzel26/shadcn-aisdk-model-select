'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ModelSettingsDialog } from './ModelSettingsDialog';
import { useModelSelection } from './ModelSelectionContext';
import { AiModel, ModelSelectDropdownSettings } from '@/types/model';
import { ModelList } from './ModelList';

function ModelSelectWithSettings({
  models,
  placeholder,
  settings,
}: Omit<ModelSelectDropdownProps, 'onModelChange' | 'selectedModel'>) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state, selectedModels, selectedModel, setSelectedModel } = useModelSelection();

  const allProviders = useMemo(() => {
    return [...new Set(models.map(m => m.provider))];
  }, [models]);

  useEffect(() => {
    if (state.isLoaded) {
      const isSelectedModelInList = selectedModels.some(m => m.value === selectedModel);
      if (!isSelectedModelInList && selectedModels.length > 0) {
        setSelectedModel(selectedModels[0].value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModels, state.isLoaded, selectedModel]);

  const isLoading = !state.isLoaded;

  const selectedModelLabel =
    models.find(m => m.value === selectedModel)?.model || placeholder;

  return (
    <>
      <Select onValueChange={setSelectedModel} value={selectedModel || ''} disabled={isLoading}>
        <SelectTrigger className="flex-grow">
          <SelectValue asChild>
            <span>{isLoading ? 'Loading...' : selectedModelLabel}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <ModelList models={selectedModels} />
          )}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="h-10 w-10 shrink-0"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Model Settings</span>
      </Button>
      <ModelSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        providers={allProviders}
        showApiKeys={typeof settings === 'object' ? settings.showApiKeys : true}
      />
    </>
  );
}

export interface ModelSelectDropdownProps {
  models: AiModel[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  settings?: boolean | ModelSelectDropdownSettings;
  placeholder?: string;
  className?: string;
}

export function ModelSelectDropdown({
  models,
  settings = false,
  placeholder = 'Select a model...',
  className,
}: Omit<ModelSelectDropdownProps, 'onModelChange' | 'selectedModel'>) {
  const hasSettings = settings !== false;
  const { selectedModel, setSelectedModel, allModels } = useModelSelection();

  if (!hasSettings) {
    const selectedModelLabel =
      allModels.find(m => m.value === selectedModel)?.model || placeholder;

    return (
      <div className={`flex items-center gap-4 ${className || ''}`}>
        <Select onValueChange={setSelectedModel} value={selectedModel || ''}>
          <SelectTrigger className="flex-grow">
            <SelectValue asChild>
              <span>{selectedModelLabel}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <ModelList models={models} />
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <ModelSelectWithSettings
        models={models}
        placeholder={placeholder}
        className={className}
        settings={settings}
      />
    </div>
  );
}