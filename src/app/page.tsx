'use client';

import { ModelSelectDropdown } from '@/components/ModelSelectDropdown';
import { getFilteredModels } from '@/lib/models';
import { TinyModelSelector } from '@/components/TinyModelSelector';
import { useModelSelection, ModelSelectionProvider } from '@/contexts/ModelSelectionContext';

function ModelShowcase() {
  const { selectedModel } = useModelSelection();
  const models = getFilteredModels({
    providers: ['openai', 'anthropic', 'google', 'groq'],
    categories: ['chat'],
  });
  return (
    <div className="bg-card border rounded-lg p-6 pb-4 space-y-4 relative">
      <ModelSelectDropdown
        models={models}
        settings={true}
        placeholder="Select an AI model..."
      />

      {selectedModel && (
        <div className="p-4 border rounded-md bg-muted mt-4">
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
    providers: ['openai', 'anthropic', 'google', 'groq'],
    categories: ['chat'],
  });
  const initialModel = models[0]?.value || '';

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 md:p-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Model Selector Components
          </h1>
          <p className="text-muted-foreground mt-2">
            A showcase of reusable components for selecting AI models.
          </p>
        </div>

        <ModelSelectionProvider
          configurableModels={models}
          initialModel={initialModel}
        >
          <ModelShowcase />
        </ModelSelectionProvider>

        <div className="mt-16 space-y-8 text-sm text-muted-foreground">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Documentation</h2>
            <p>
              This library provides a set of components to easily add AI model selection
              to your application. Here&apos;s how to use them.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">1. The Provider</h3>
            <p>
              All model selection components must be wrapped in the{' '}
              <code>ModelSelectionProvider</code>. This provider manages all shared state,
              including the list of available models, which models are currently selected
              by the user, and the active model. It also persists user preferences to
              localStorage automatically.
            </p>
            <pre className="p-4 rounded-md bg-muted text-foreground overflow-x-auto">
              <code>
                {`import { ModelSelectionProvider } from '@/components';
import { getFilteredModels } from '@/lib/models';

function MyPage() {
  const allModels = getFilteredModels({});
  const initialModel = allModels[0]?.value;

  return (
    <ModelSelectionProvider
      configurableModels={allModels}
      initialModel={initialModel}
    >
      {/* Your components go here */}
    </ModelSelectionProvider>
  );
}`}
              </code>
            </pre>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">2. Main Dropdown</h3>
            <p>
              The <code>ModelSelectDropdown</code> is the primary component. It renders a
              feature-rich select input. The <code>settings</code> prop is optional and
              enables a configuration dialog where users can filter the model list.
            </p>
            <pre className="p-4 rounded-md bg-muted text-foreground overflow-x-auto">
              <code>
                {`import { ModelSelectDropdown } from '@/components';
import { getFilteredModels } from '@/lib/models';

function MyComponent() {
  const openAIModels = getFilteredModels({ providers: ['openai'] });

  return (
    <ModelSelectDropdown
      models={openAIModels}
      settings={{ showApiKeys: false }} // 'settings' is optional
      placeholder="Select an OpenAI model..."
    />
  );
}`}
              </code>
            </pre>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">3. Tiny Selector</h3>
            <p>
              The <code>TinyModelSelector</code> is designed to be a minimal, secondary
              selector that mirrors the state of the main dropdown. Its purpose is to be an
              unobtrusive UI element, similar to the model switcher in Cursor, allowing users to
              quickly see and change the active model without taking up much space.
            </p>
            <pre className="p-4 rounded-md bg-muted text-foreground overflow-x-auto">
              <code>
                {`import { TinyModelSelector } from '@/components';

function MyUI() {
  const allModels = getFilteredModels({});

  return <TinyModelSelector models={allModels} />;
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
