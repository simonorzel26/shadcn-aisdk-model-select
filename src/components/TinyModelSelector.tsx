'use client';

import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Brain } from 'lucide-react';
import { ModelList } from './ModelList';
import { useModelSelection } from '@/contexts/ModelSelectionContext';

export interface TinyModelSelectorProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: (modelValue: string) => void;
}

export function TinyModelSelector({
  placeholder = 'Select Model',
  className,
  value,
  onValueChange,
}: TinyModelSelectorProps) {
  const {
    selectedModel: contextSelectedModel,
    setSelectedModel: setContextSelectedModel,
    selectedModels,
    allModels,
    state,
  } = useModelSelection();

  const isControlled = value !== undefined;

  const currentModel = isControlled ? value : contextSelectedModel;
  const handleModelChange = isControlled ? onValueChange : setContextSelectedModel;

  const isLoading = !state.isLoaded;

  const selectedModelLabel =
    allModels.find(m => m.value === currentModel)?.model || placeholder;

  return (
    <div className={`flex items-center ${className || ''}`}>
      <Select
        onValueChange={handleModelChange}
        value={currentModel || ''}
        disabled={isLoading}
      >
        <SelectTrigger
          size="sm"
          className="gap-0 m-0 px-2 py-0 text-[10px] border rounded-md bg-background hover:bg-muted/80 focus:ring-0 focus:ring-none focus:ring-offset-0 border-none focus:border-none active:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex items-end">
            <Brain className="h-0.5 w-0.5 mr-1 p-0.5 text-muted-foreground" />
            <span className="truncate">
              {isLoading ? '...' : selectedModelLabel}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-96">
          {!isLoading && <ModelList models={selectedModels} />}
        </SelectContent>
      </Select>
    </div>
  );
}