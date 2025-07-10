'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain } from 'lucide-react';
import { ModelList } from './ModelList';
import { useModelSelection } from './ModelSelectionContext';

export interface TinyModelSelectorProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: (modelValue: string) => void;
  useGlobalState?: boolean;
}

export function TinyModelSelector({
  placeholder = 'Select Model',
  className,
  value,
  onValueChange,
  useGlobalState = true,
}: TinyModelSelectorProps) {
  const {
    selectedModel: globalSelectedModel,
    setSelectedModel: setGlobalSelectedModel,
    selectedModels,
    allModels,
    state,
  } = useModelSelection();

  const [localSelectedModel, setLocalSelectedModel] = useState<string>('');

  const isControlledByProps = value !== undefined && onValueChange !== undefined;
  const isUsingGlobalState = useGlobalState && !isControlledByProps;

  const currentModel = isControlledByProps
    ? value
    : isUsingGlobalState
    ? globalSelectedModel
    : localSelectedModel;

  const handleModelChange = (modelValue: string) => {
    if (isControlledByProps) {
      onValueChange(modelValue);
    } else if (isUsingGlobalState) {
      setGlobalSelectedModel(modelValue);
    } else {
      setLocalSelectedModel(modelValue);
    }
  };

  useEffect(() => {
    if (!isUsingGlobalState && !isControlledByProps && selectedModels.length > 0 && !localSelectedModel) {
      setLocalSelectedModel(selectedModels[0].value);
    }
  }, [selectedModels, localSelectedModel, isUsingGlobalState, isControlledByProps]);

  const isLoading = !state.isLoaded;

  const selectedModelLabel =
    allModels.find(m => m.value === currentModel)?.model || placeholder;

  return (
    <div className={className}>
      <Select
        onValueChange={handleModelChange}
        value={currentModel || ''}
        disabled={isLoading}
      >
        <SelectTrigger size="sm">
          <div className="flex items-center">
            <Brain className="h-3 w-3 mr-1 text-muted-foreground" />
            <SelectValue asChild>
              <span className="truncate text-xs">
                {isLoading ? '...' : selectedModelLabel}
              </span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {!isLoading && <ModelList models={selectedModels} />}
        </SelectContent>
      </Select>
    </div>
  );
}