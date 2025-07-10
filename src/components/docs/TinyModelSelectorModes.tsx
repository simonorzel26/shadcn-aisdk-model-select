'use client';

import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { ModelSelectionProvider, useModelSelection } from '@/components/shadcn-aisdk-model-select/ModelSelectionContext';
import { TinyModelSelector } from '@/components/shadcn-aisdk-model-select/TinyModelSelector';
import { getFilteredModels } from '@/lib/models';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { DocSection } from './DocSection';

function GlobalStateModeDemo() {
  const models = getFilteredModels({ providers: ['openai', 'anthropic'] });
  const initialModel = models[0]?.value || '';

  function DemoUI() {
    const { selectedModel } = useModelSelection();
    return (
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Global State:</span>
            <TinyModelSelector />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Another Instance:</span>
            <TinyModelSelector />
          </div>
          <div className="text-xs text-muted-foreground">
            Both selectors share the same state: <strong>{selectedModel}</strong>
          </div>
        </div>
      </CardContent>
    );
  }

  const code = `// Global State Mode (default)
<TinyModelSelector />
<TinyModelSelector useGlobalState={true} />

// Both share the same state`;

  return (
    <ModelSelectionProvider configurableModels={models} initialModel={initialModel}>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">1. Global State Mode</h3>
        <p className="mb-4">
          Multiple instances share the same state through the ModelSelectionProvider. Changes in one affect all others.
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

function LocalStateModeDemo() {
  const models = getFilteredModels({ providers: ['google', 'groq'] });
  const initialModel = models[0]?.value || '';

  function DemoUI() {
    const { selectedModel: globalModel } = useModelSelection();
    return (
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Global State:</span>
            <TinyModelSelector />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Local State:</span>
            <TinyModelSelector useGlobalState={false} />
          </div>
          <div className="text-xs text-muted-foreground">
            Global: <strong>{globalModel}</strong> | Local maintains independent state
          </div>
        </div>
      </CardContent>
    );
  }

  const code = `// Local State Mode
<TinyModelSelector useGlobalState={false} />

// Independent state, options from provider`;

  return (
    <ModelSelectionProvider configurableModels={models} initialModel={initialModel}>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">2. Local State Mode</h3>
        <p className="mb-4">
          Maintains independent state while still being constrained to options from the provider&apos;s filtered models.
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

function ControlledModeDemo() {
  const models = getFilteredModels({ providers: ['openai', 'google'] });
  const initialModel = models[0]?.value || '';

  function DemoContainer() {
    const [controlledValue, setControlledValue] = useState<string>('');
    const { selectedModel: globalModel } = useModelSelection();

    return (
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Global State:</span>
            <TinyModelSelector />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Controlled:</span>
            <TinyModelSelector
              value={controlledValue}
              onValueChange={setControlledValue}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Global: <strong>{globalModel}</strong> | Controlled: <strong>{controlledValue || 'none'}</strong>
          </div>
        </div>
      </CardContent>
    );
  }

  const code = `// Controlled Mode
const [value, setValue] = useState('');

<TinyModelSelector
  value={value}
  onValueChange={setValue}
/>`;

  return (
    <ModelSelectionProvider configurableModels={models} initialModel={initialModel}>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">3. Controlled Mode</h3>
        <p className="mb-4">
          Externally controlled via props. Perfect for forms or custom state management integration.
        </p>
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <DemoContainer />
          <div className="relative">
            <CodeBlock code={code} />
          </div>
        </Card>
      </div>
    </ModelSelectionProvider>
  );
}

export function TinyModelSelectorModes() {
  return (
    <DocSection title="State Management Modes" icon={<Settings2 className="h-6 w-6" />}>
      <p>
        The TinyModelSelector supports three different state management modes for maximum composability and flexibility:
      </p>
      <GlobalStateModeDemo />
      <LocalStateModeDemo />
      <ControlledModeDemo />
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-2">Key Benefits</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Global State:</strong> Perfect for unified model selection across your app</li>
          <li>• <strong>Local State:</strong> Ideal for isolated components that don&apos;t affect others</li>
          <li>• <strong>Controlled:</strong> Full control for forms and custom state management</li>
          <li>• <strong>Constraint:</strong> All modes respect the provider&apos;s filtered model list</li>
        </ul>
      </div>
    </DocSection>
  );
}