'use client';

import { ModelSelectDropdown } from '@/components/shadcn-aisdk-model-select';
import { TinyModelSelector } from '@/components/shadcn-aisdk-model-select';
import { useModelSelection, ModelSelectionProvider } from '@/contexts/ModelSelectionContext';
import { getFilteredModels } from '@/lib/models';
import { CodeBlock } from './CodeBlock';
import { Card, CardContent } from '@/components/ui/card';
import type { AiModel } from '@/types/model';

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