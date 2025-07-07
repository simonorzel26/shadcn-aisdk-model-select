'use client';

import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { AiModel } from '@/types/model';
import { BrainCircuit } from 'lucide-react';
import { ModelList } from './ModelList';
import { useModelSelection } from '@/contexts/ModelSelectionContext';

export interface TinyModelSelectorProps {
  models: AiModel[];
  placeholder?: string;
  className?: string;
}

export function TinyModelSelector({
  models,
  placeholder = 'Select Model',
  className,
}: TinyModelSelectorProps) {
  const { selectedModel, setSelectedModel, selectedModels, state } = useModelSelection();

  const modelsToDisplay = state.isLoaded ? selectedModels : models;

  const selectedModelLabel =
    models.find(m => m.value === selectedModel)?.model || placeholder;

  return (
    <div className={`flex items-center ${className || ''}`}>
      <Select onValueChange={setSelectedModel} value={selectedModel}>
        <SelectTrigger className="h-7 px-2 text-xs border rounded-md bg-background hover:bg-muted/80 focus:ring-1 focus:ring-ring focus:ring-offset-1">
          <div className="flex items-center gap-1.5">
            <BrainCircuit className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate">{selectedModelLabel}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-96">
          <ModelList models={modelsToDisplay} />
        </SelectContent>
      </Select>
    </div>
  );
}