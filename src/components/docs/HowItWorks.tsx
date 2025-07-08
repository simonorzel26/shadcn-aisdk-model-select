'use client';

import { Puzzle } from 'lucide-react';
import { ModelSelectionProvider, useModelSelection } from '@/contexts/ModelSelectionContext';
import { getFilteredModels } from '@/lib/models';
import { TinyModelSelector } from '@/components/TinyModelSelector';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { DocSection } from './DocSection';

function ComponentOne() {
  const { selectedModel } = useModelSelection();
  return (
    <div className="border p-2 rounded-lg text-sm">
      <p>
        <strong>Component One:</strong> The selected model is <code>{selectedModel}</code>.
      </p>
    </div>
  );
}

function ComponentTwo() {
  const { selectedModel } = useModelSelection();
  return (
    <div className="border p-2 rounded-lg text-sm mt-2">
      <p>
        <strong>Component Two:</strong> Also sees that the model is <code>{selectedModel}</code>.
      </p>
    </div>
  );
}

function DemoContainer() {
  const models = getFilteredModels({
    providers: ['openai', 'google'],
    categories: ['chat'],
  });
  const initialModel = models[0]?.value || '';

  return (
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Shared State Demo</h3>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">Change the model:</p>
          <TinyModelSelector />
        </div>
        <ComponentOne />
        <ComponentTwo />
      </CardContent>
    </ModelSelectionProvider>
  );
}

export function HowItWorks() {
  const code = `
// 1. Wrap your app in the provider
<ModelSelectionProvider
  configurableModels={models}
  initialModel={initialModel}
>
  <App />
</ModelSelectionProvider>

// 2. Use the hook in any child component
function MyComponent() {
  const { selectedModel } = useModelSelection();
  return <p>Model: {selectedModel}</p>
}
  `;

  return (
    <DocSection title="How It Works" icon={<Puzzle className="h-6 w-6" />}
    >
      <p>
        The component suite is powered by a single React Context provider: <code>ModelSelectionProvider</code>. It manages all shared state, including the model list, user filters, the active model, and persists settings to <code>localStorage</code>.
      </p>
      <div className="mt-4">
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <DemoContainer />
          <div className="relative">
            <CodeBlock code={code} />
          </div>
        </Card>
      </div>
    </DocSection>
  );
}