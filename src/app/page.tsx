import { promises as fs } from 'fs';
import path from 'path';
import {
  DiscoveredModel,
  ProviderInspection,
  ProviderInstance,
} from '@/types/model-discovery';
import { ModelDiscoveryView } from '@/components/ModelDiscoveryView';

const PROVIDERS = [
  'openai',
  'anthropic',
  'google',
  'mistral',
  'cohere',
  'xai',
  'azure',
  'amazon-bedrock',
  'google-vertex',
  'togetherai',
  'fireworks',
  'deepinfra',
  'deepseek',
  'cerebras',
  'groq',
  'perplexity',
];

async function getProviderModule(providerName: string) {
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
    case 'xai':
      return await import('@ai-sdk/xai');
    case 'azure':
      return await import('@ai-sdk/azure');
    case 'amazon-bedrock':
      return await import('@ai-sdk/amazon-bedrock');
    case 'google-vertex':
      return await import('@ai-sdk/google-vertex');
    case 'togetherai':
      return await import('@ai-sdk/togetherai');
    case 'fireworks':
      return await import('@ai-sdk/fireworks');
    case 'deepinfra':
      return await import('@ai-sdk/deepinfra');
    case 'deepseek':
      return await import('@ai-sdk/deepseek');
    case 'cerebras':
      return await import('@ai-sdk/cerebras');
    case 'groq':
      return await import('@ai-sdk/groq');
    case 'perplexity':
      return await import('@ai-sdk/perplexity');
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

async function discoverProviderModelsFromTypeDefinitions(
  providerName: string,
): Promise<DiscoveredModel[]> {
  try {
    const filePath = path.join(
      process.cwd(),
      'node_modules',
      `@ai-sdk/${providerName}`,
      'dist',
      'index.d.ts',
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const modelIdRegex = /type\s+\w*ModelId\s*=\s*([^;]+);/g;
    let match;
    const models: DiscoveredModel[] = [];

    while ((match = modelIdRegex.exec(fileContent)) !== null) {
      const modelIdsText = match[1];
      const individualModelIds = modelIdsText.match(/'([^']+)'/g);

      if (individualModelIds) {
        individualModelIds.forEach(idWithQuotes => {
          const modelId = idWithQuotes.slice(1, -1);
          if (!modelId.includes('(') && !modelId.includes('&')) {
            models.push({
              provider: providerName,
              modelId,
              source: 'Type Definition',
              type: 'language',
            });
          }
        });
      }
    }

    return models;
  } catch (error) {
    console.error(`Failed to parse type definitions for ${providerName}:`, error);
    return [];
  }
}

async function discoverProviderModelsWithIntrospection(
  providerName: string,
): Promise<DiscoveredModel[]> {
  try {
    const providerModule = await getProviderModule(providerName);

    const createFunctionName = `create${
      providerName.charAt(0).toUpperCase() + providerName.slice(1)
    }`;
    const altCreateName = providerName;

    const moduleAny = providerModule as Record<string, unknown>;
    let createFunction =
      moduleAny[createFunctionName] ||
      moduleAny[altCreateName] ||
      moduleAny.default;

    if (!createFunction) {
      switch (providerName) {
        case 'google':
          createFunction =
            moduleAny['createGoogleGenerativeAI'] || moduleAny['google'];
          break;
        case 'amazon-bedrock':
          createFunction =
            moduleAny['createAmazonBedrock'] || moduleAny['bedrock'];
          break;
        case 'google-vertex':
          createFunction = moduleAny['createVertex'] || moduleAny['vertex'];
          break;
      }
    }

    if (typeof createFunction !== 'function') {
      return [];
    }

    const providerInstance = createFunction() as ProviderInstance;

    const models: DiscoveredModel[] = [];

    const languageModels = providerInstance.languageModels || providerInstance.models;

    if (Array.isArray(languageModels)) {
      languageModels.forEach(model => {
        if (model && typeof model.modelId === 'string') {
          models.push({
            provider: providerName,
            modelId: model.modelId,
            source: 'Introspection',
            type: 'language',
          });
        }
      });
    } else if (typeof languageModels === 'object' && languageModels !== null) {
      Object.keys(languageModels).forEach(modelId => {
        models.push({
          provider: providerName,
          modelId,
          source: 'Introspection',
          type: 'language',
        });
      });
    }

    return models;
  } catch (error) {
    console.error(`Model introspection failed for ${providerName}:`, error);
    return [];
  }
}

async function inspectProvider(
  providerName: string,
): Promise<ProviderInspection> {
  try {
    const providerModule = await getProviderModule(providerName);

    const createFunctionName = `create${
      providerName.charAt(0).toUpperCase() + providerName.slice(1)
    }`;
    const altCreateName = providerName;

    const moduleAny = providerModule as Record<string, unknown>;
    let createFunction =
      moduleAny[createFunctionName] ||
      moduleAny[altCreateName] ||
      moduleAny.default;

    if (!createFunction) {
      switch (providerName) {
        case 'google':
          createFunction =
            moduleAny['createGoogleGenerativeAI'] || moduleAny['google'];
          break;
        case 'amazon-bedrock':
          createFunction =
            moduleAny['createAmazonBedrock'] || moduleAny['bedrock'];
          break;
        case 'google-vertex':
          createFunction = moduleAny['createVertex'] || moduleAny['vertex'];
          break;
      }
    }

    if (!createFunction || typeof createFunction !== 'function') {
      return {
        provider: providerName,
        createFunction: 'Not found',
        availableMethods: [],
        errorMessage: 'Create function not found or not a function.',
      };
    }

    return {
      provider: providerName,
      createFunction: createFunctionName,
      availableMethods: [],
    };
  } catch (error: unknown) {
    return {
      provider: providerName,
      createFunction: 'Error',
      availableMethods: [],
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

export default async function Page() {
  const inspectionPromises = PROVIDERS.map(inspectProvider);

  const discoveryPromises = PROVIDERS.map(async provider => {
    let models = await discoverProviderModelsFromTypeDefinitions(provider);
    if (models.length === 0) {
      models = await discoverProviderModelsWithIntrospection(provider);
    }
    return models;
  });

  const allInspectedProviders = await Promise.all(inspectionPromises);
  const allDiscoveredModels = (await Promise.all(discoveryPromises)).flat();

  const uniqueDiscoveredModels = allDiscoveredModels.filter(
    (model, index, self) =>
      index ===
      self.findIndex(t => t.provider === model.provider && t.modelId === model.modelId),
  );

  return (
    <ModelDiscoveryView
      initialDiscoveredModels={uniqueDiscoveredModels}
      initialInspectedProviders={allInspectedProviders}
    />
  );
}
