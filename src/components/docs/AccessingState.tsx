'use client';

import { TestTube } from 'lucide-react';
import { ModelSelectionProvider, useModelSelection } from '@/components/shadcn-aisdk-model-select/ModelSelectionContext';
import { getFilteredModels } from '@/lib/models';
import { ModelSelectDropdown } from '@/components/shadcn-aisdk-model-select';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { DocSection } from './DocSection';
import type { AiModel } from '@/types/model';

function StateDisplay() {
  const { selectedModel, selectedModels, allModels, configurableModels } = useModelSelection();

  return (
    <div className="text-sm space-y-2">
      <p>
        <strong>Current Model:</strong> <code>{selectedModel}</code>
      </p>
      <p>
        <strong>Visible Models:</strong> <code>{selectedModels.length}</code>
      </p>
      <p>
        <strong>Total Models (in provider):</strong> <code>{configurableModels.length}</code>
      </p>
      <p>
        <strong>All Models (from library):</strong> <code>{allModels.length}</code>
      </p>
    </div>
  );
}

function DemoContainer({ models }: { models: AiModel[] }) {
  const initialModel = models[0]?.value || '';

  return (
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      <CardContent className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Live State</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use the dropdown to see the state values change.
        </p>
        <ModelSelectDropdown models={models} settings={true} />
        <div className="mt-4 border-t pt-4">
          <StateDisplay />
        </div>
      </CardContent>
    </ModelSelectionProvider>
  );
}

export function AccessingState() {
  const code = `
import { useModelSelection } from '@/components/shadcn-aisdk-model-select/ModelSelectionContext';

function MyComponent() {
  const {
    selectedModel,      // Currently active model ID
    selectedModels,     // The filtered list of visible models
    allModels,          // All models from the @.../ai-models package
    configurableModels, // The models you passed to the provider
  } = useModelSelection();

  return (
    <div>
      <p>Current Model: {selectedModel}</p>
      <p>Visible Models: {selectedModels.length}</p>
    </div>
  );
}
  `;
  const models = getFilteredModels({
    providers: ['openai', 'anthropic', 'google', 'groq'],
    categories: ['chat', 'image'],
  });

  return (
    <DocSection title="Accessing State" icon={<TestTube className="h-6 w-6" />}>
      <p>
        To access the shared state, use the <code>useModelSelection</code> hook in any child component of the <code>ModelSelectionProvider</code>. It returns all the data you need to build custom components or logic.
      </p>
      <div className="mt-4">
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <DemoContainer models={models} />
          <div className="relative">
            <CodeBlock code={code} />
          </div>
        </Card>
      </div>
    </DocSection>
  );
}