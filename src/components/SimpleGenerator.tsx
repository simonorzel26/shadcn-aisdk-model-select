'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelector } from '@/components/ModelSelector';
import { DiscoveredModel } from '@/types/model-discovery';

interface SimpleGeneratorProps {
  initialModels: DiscoveredModel[];
}

export function SimpleGenerator({ initialModels }: SimpleGeneratorProps) {
  const [selectedModel, setSelectedModel] = useState<string>('');

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: '/api/generate',
    body: {
      model: selectedModel,
    },
  });

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-grow">
          <ModelSelector
            models={initialModels}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your prompt here..."
          className="w-full h-24"
          disabled={!selectedModel || isLoading}
        />
        <Button
          type="submit"
          disabled={!selectedModel || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Text'}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 p-4 border border-red-500 rounded-md">
          <p className="font-bold">An error occurred:</p>
          <p>{error.message}</p>
        </div>
      )}

      {completion && (
        <div className="p-4 border rounded-md bg-muted">
          <p className="font-semibold">Generated Completion:</p>
          <p className="whitespace-pre-wrap">{completion}</p>
        </div>
      )}
    </div>
  );
}