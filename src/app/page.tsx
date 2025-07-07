'use client';

import { ModelSelectDropdown } from '@/components/ModelSelectDropdown';
import { getFilteredModels } from '@/lib/models';
import { FilteringExamples } from './FilteringExamples';
import { TinyModelSelector } from '@/components/TinyModelSelector';
import { useModelSelection, ModelSelectionProvider } from '@/contexts/ModelSelectionContext';

function Generator() {
  const { selectedModel } = useModelSelection();
  const models = getFilteredModels({
    providers: ['openai', 'anthropic'],
    categories: ['chat'],
  });
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4 relative">
      <ModelSelectDropdown
        models={models}
        settings={true}
        placeholder="Select an AI model..."
      />

      {selectedModel && (
        <div className="p-4 border rounded-md bg-muted">
          <p className="font-semibold">Selected Model:</p>
          <p className="text-sm text-muted-foreground break-all">{selectedModel}</p>
        </div>
      )}
      <div className="flex justify-end">
        <TinyModelSelector models={models} />
      </div>
    </div>
  );
}


export default function Page() {
  const models = getFilteredModels({
    providers: ['openai', 'anthropic'],
    categories: ['chat'],
  });
  const initialModel = models[0]?.value || '';

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Model Selector
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Select a model from the dropdown. Use the settings icon to customize the list.
        </p>
        <ModelSelectionProvider
          configurableModels={models}
          initialModel={initialModel}
        >
          <Generator />
        </ModelSelectionProvider>
        <FilteringExamples />
      </div>
    </main>
  );
}
