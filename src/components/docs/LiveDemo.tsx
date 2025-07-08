'use client';

import { ModelSelectDropdown } from '@/model-select-package/components/ModelSelectDropdown';
import { TinyModelSelector } from '@/model-select-package/components/TinyModelSelector';
import { useModelSelection, ModelSelectionProvider } from '@/model-select-package/contexts/ModelSelectionContext';
import { getFilteredModels } from '@/model-select-package/lib/models';
import { CodeBlock } from './CodeBlock';
import { Card, CardContent } from '@/components/ui/card';
import type { AiModel } from '@/model-select-package/types/model';

function DemoUI({ models }: { models: AiModel[] }) {
  const { selectedModel } = useModelSelection();
  return (
    <CardContent className="p-6">
      <ModelSelectDropdown
        models={models}
        settings={true}
      />
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
        </p>
        <TinyModelSelector />
      </div>
    </CardContent>
  );
}

function DemoContainer() {
  const models = getFilteredModels({
    providers: ['openai', 'anthropic', 'google', 'groq'],
    categories: ['chat'],
  });
  const initialModel = models[0]?.value || '';

  return (
    <div className="max-w-md mx-auto">
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      <DemoUI models={models} />
    </ModelSelectionProvider>
    </div>
  );
}

export function LiveDemo() {
  const code = `
<ModelSelectionProvider
configurableModels={models}
initialModel={initialModel}
>
  <ModelSelectDropdown
    models={models}
    settings={true}
  />
  Selected: ...
  <TinyModelSelector />
</ModelSelectionProvider>
`;

  return (
    <section className="mb-16">
      <DemoContainer />
    </section>
  );
}