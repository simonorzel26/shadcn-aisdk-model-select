'use client';

import { useState } from 'react';
import { ModelSelectDropdown } from '@/components/ModelSelectDropdown';
import { AiModel } from '@/types/model';

interface SimpleGeneratorProps {
  initialModels: AiModel[];
}

export function SimpleGenerator({ initialModels }: SimpleGeneratorProps) {
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-grow">
          <ModelSelectDropdown
            models={initialModels}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>

      {selectedModel && (
        <div className="p-4 border rounded-md bg-muted">
          <p className="font-semibold">Selected Model:</p>
          <p className="text-sm text-muted-foreground">{selectedModel}</p>
        </div>
      )}
    </div>
  );
}