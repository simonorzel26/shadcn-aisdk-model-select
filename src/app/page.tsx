'use client';

import { useState, useEffect, useCallback } from 'react';
import { SimpleGenerator } from '@/components/SimpleGenerator';
// import { ModelSelector, useModelValidation } from '@/components';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';

interface DiscoveredModel {
  provider: string;
  modelId: string;
  source: string;
  type?: 'language' | 'embedding' | 'image' | 'audio' | 'unknown';
}

interface ProviderInspection {
  provider: string;
  createFunction: unknown;
  availableMethods: string[];
  errorMessage?: string;
}

interface ProviderModel {
  modelId: string;
}

interface ProviderInstance {
  languageModels?: ProviderModel[] | Record<string, unknown>;
  models?: ProviderModel[];
}

export default function HomePage() {
  const [discoveredModels, setDiscoveredModels] = useState<DiscoveredModel[]>([]);
  const [providerInspections, setProviderInspections] = useState<ProviderInspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Comment out previous state
  // const [selectedModel, setSelectedModel] = useState<string>('');
  // const [prompt, setPrompt] = useState('');
  // const [response, setResponse] = useState('');
  // const [isGenerating, setIsGenerating] = useState(false);
  // const { validateModel } = useModelValidation();

  const getProviderModule = useCallback(async (providerName: string) => {
    switch (providerName) {
      case 'openai':
        return await import('@ai-sdk/openai');
      case 'anthropic':
        return await import('@ai-sdk/anthropic');
      case 'google':
        return await import('@ai-sdk/google');
      case 'mistral':
        return await import('@ai-sdk/mistral');
      case 'cohere':
        return await import('@ai-sdk/cohere');
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }, []);

  const inspectProvider = useCallback(async (providerName: string): Promise<ProviderInspection> => {
    try {
      const providerModule = await getProviderModule(providerName);

      const createFunctionName = `create${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`;
      const altCreateName = providerName;

      const moduleAny = providerModule as Record<string, unknown>;
      let createFunction = moduleAny[createFunctionName] || moduleAny[altCreateName] || moduleAny.default;

      if (!createFunction && providerName === 'google') {
        createFunction = moduleAny['createGoogleGenerativeAI'] || moduleAny['google'];
      }

      if (!createFunction || typeof createFunction !== 'function') {
        return {
          provider: providerName,
          createFunction: null,
          availableMethods: [],
          errorMessage: 'Could not find a valid create function.'
        };
      }

      const instance = (createFunction as (options: { apiKey: string }) => unknown)({ apiKey: 'dummy-key' });

      // Deep inspection of the provider instance
      console.log(`\n=== DEEP INSPECTION: ${providerName.toUpperCase()} ===`);
      console.log('Provider Instance:', instance);

      const availableMethods: string[] = [];
      if (instance && typeof instance === 'object') {
        const proto = Object.getPrototypeOf(instance);
        availableMethods.push(...Object.getOwnPropertyNames(instance));
        if (proto) {
            availableMethods.push(...Object.getOwnPropertyNames(proto));
        }
      }

      return {
        provider: providerName,
        createFunction,
        availableMethods: [...new Set(availableMethods)].filter(m => !m.startsWith('_') && m !== 'constructor')
      };
    } catch (error) {
      return {
        provider: providerName,
        createFunction: null,
        availableMethods: [],
        errorMessage: `Failed to import or inspect ${providerName}: ${(error as Error).message}`
      };
    }
  }, [getProviderModule]);

  const discoverProviderModels = useCallback(async (providerName: string): Promise<DiscoveredModel[]> => {
    try {
      const providerModule = await getProviderModule(providerName);

      const createFunctionName = `create${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`;
      const altCreateName = providerName;

      const moduleAny = providerModule as Record<string, unknown>;
      let createFunction = moduleAny[createFunctionName] || moduleAny[altCreateName] || moduleAny.default;

      if (!createFunction && providerName === 'google') {
        createFunction = moduleAny['createGoogleGenerativeAI'] || moduleAny['google'];
      }

      if (typeof createFunction !== 'function') {
        return [];
      }

      const providerInstance = createFunction() as ProviderInstance;

      console.log(`\n=== PROVIDER INSTANCE DEEP DIVE: ${providerName.toUpperCase()} ===`);
      console.log(providerInstance);

      let modelIds: string[] = [];

      if (Array.isArray(providerInstance.languageModels)) {
        modelIds = providerInstance.languageModels.map((m) => m.modelId);
      } else if (providerInstance.languageModels) {
        modelIds = Object.keys(providerInstance.languageModels);
      } else if (providerInstance.models) {
        modelIds = providerInstance.models.map((m) => m.modelId);
      }

      return modelIds.map((id: string) => ({
        provider: providerName,
        modelId: id,
        source: 'Dynamic Provider Introspection',
        type: 'language'
      }));

    } catch (error) {
      console.error(`Error discovering models for ${providerName}:`, error);
      return [];
    }
  }, [getProviderModule]);

  const discoverModelsFromSDK = useCallback(async () => {
    setIsLoading(true);
    const models: DiscoveredModel[] = [];
    const inspections: ProviderInspection[] = [];

    const providers = ['openai', 'anthropic', 'google', 'mistral', 'cohere'];

    for (const provider of providers) {
      try {
        inspections.push(await inspectProvider(provider));
        models.push(...await discoverProviderModels(provider));
      } catch (error) {
        console.error(`Error with provider ${provider}:`, error);
        inspections.push({
          provider: provider,
          createFunction: null,
          availableMethods: [],
          errorMessage: (error as Error).message
        });
      }
    }

    setDiscoveredModels(models);
    setProviderInspections(inspections);
    setIsLoading(false);
  }, [inspectProvider, discoverProviderModels]);

  useEffect(() => {
    discoverModelsFromSDK();
  }, [discoverModelsFromSDK]);

  const groupedModels = discoveredModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, DiscoveredModel[]>);

  const typeColors = {
    language: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    embedding: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    image: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    audio: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">
          AI SDK Model Discovery & Test
        </h1>
        <p className="text-muted-foreground text-center">
          Introspecting AI SDK packages and running a simple AI call.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <SimpleGenerator />
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Introspecting AI SDK packages...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Discovery Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Total Models</div>
                  <div className="text-2xl font-bold text-primary">{discoveredModels.length}</div>
                </div>
                <div>
                  <div className="font-medium">Providers</div>
                  <div className="text-2xl font-bold text-primary">{Object.keys(groupedModels).length}</div>
                </div>
                <div>
                  <div className="font-medium">Language Models</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {discoveredModels.filter(m => m.type === 'language').length}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Other Types</div>
                  <div className="text-2xl font-bold text-green-600">
                    {discoveredModels.filter(m => m.type !== 'language').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Inspections */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Provider Package Inspection</h2>
              <div className="space-y-4">
                {providerInspections.map((inspection, index) => (
                  <div key={index} className="border rounded p-4">
                    <h3 className="font-semibold text-lg capitalize mb-2">{inspection.provider}</h3>
                    {inspection.errorMessage ? (
                      <div className="text-red-600 text-sm">Error: {inspection.errorMessage}</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Create Function Available</div>
                          <div>{inspection.createFunction ? '✅ Yes' : '❌ No'}</div>
                        </div>
                        <div>
                          <div className="font-medium">Available Methods ({inspection.availableMethods.length})</div>
                          <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
                            {inspection.availableMethods.join(', ') || 'None discovered'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Discovered Models by Provider */}
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold capitalize">
                    {provider} ({models.length} models)
                  </h2>
                  <div className="flex gap-2">
                    {['language', 'embedding', 'image', 'audio'].map(type => {
                      const count = models.filter(m => m.type === type).length;
                      return count > 0 ? (
                        <span key={type} className={`px-2 py-1 rounded text-xs font-medium ${typeColors[type as keyof typeof typeColors]}`}>
                          {type}: {count}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {models.map((model, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted rounded border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-primary font-mono text-sm">
                          {model.modelId}
                        </div>
                        {model.type && (
                          <span className={`px-1 py-0.5 rounded text-xs ${typeColors[model.type]}`}>
                            {model.type}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {model.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check browser console for detailed inspection logs */}
      <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
        💡 Check the browser console for detailed package introspection logs
      </div>
    </div>
  );
}
