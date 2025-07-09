'use client';

import { AppWindow } from 'lucide-react';
import { ModelSelectionProvider, useModelSelection } from '@/contexts/ModelSelectionContext';
import { getFilteredModels } from '@/lib/models';
import { ModelSelectDropdown } from '@/components/shadcn-aisdk-model-select';
import { TinyModelSelector } from '@/components/shadcn-aisdk-model-select';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { DocSection } from './DocSection';
import type { AiModel } from '@/types/model';

function DropdownDemo() {
  const models = getFilteredModels({ providers: ['openai', 'groq'] });
  const initialModel = models[0]?.value || '';

  const code = `
<ModelSelectionProvider
  configurableModels={models}
  initialModel="${initialModel}"
>
  <ModelSelectDropdown
    models={models}
    settings={true}
  />
</ModelSelectionProvider>
  `;

  return (
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">1. ModelSelectDropdown</h3>
        <p className="mb-4">
          The main dropdown component. It&apos;s feature-rich, including a settings dialog for users to filter the model list and manage API keys.
        </p>
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <CardContent className="p-6">
            <ModelSelectDropdown
              models={models}
              settings={true}
            />
          </CardContent>
          <div className="relative">
            <CodeBlock code={code} />
          </div>
        </Card>
      </div>
    </ModelSelectionProvider>
  );
}

function TinyDemo() {
  const models = getFilteredModels({ providers: ['anthropic', 'google'] });
  const initialModel = models[0]?.value || '';

  const code = `
<ModelSelectionProvider
  configurableModels={models}
  initialModel="${initialModel}"
>
  <p>Selected: {selectedModel}</p>
  <TinyModelSelector />
</ModelSelectionProvider>
  `;

  function DemoUI() {
    const { selectedModel } = useModelSelection();
    return (
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Selected: <strong>{selectedModel}</strong>
          </p>
          <TinyModelSelector />
        </div>
      </CardContent>
    );
  }

  return (
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">2. TinyModelSelector</h3>
        <p className="mb-4">
          A minimal, secondary selector that mirrors the main dropdown&apos;s state. It&apos;s perfect for unobtrusive placement in your UI, like the model switcher in Cursor. It requires no props and works seamlessly with the provider.
        </p>
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <DemoUI />
          <div className="relative">
            <CodeBlock code={code} />
          </div>
        </Card>
      </div>
    </ModelSelectionProvider>
  );
}

export function ComponentShowcase() {
  return (
    <DocSection title="Components API" icon={<AppWindow className="h-6 w-6" />}>
      <p>
        This library offers a set of ready-to-use components. Here are the primary ones:
      </p>
      <DropdownDemo />
      <TinyDemo />
    </DocSection>
  );
}