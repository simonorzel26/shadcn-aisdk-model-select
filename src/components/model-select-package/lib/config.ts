import { ModelSelectorConfig } from '@/types/model';

export const defaultModelSelectorConfig: ModelSelectorConfig = {
  enabledCategories: ['chat'],
  enabledProviders: [
    '@langdb/vercel-provider',
    'sarvam-ai-provider',
  ],
};

export function createModelSelectorConfig(
  config?: Partial<ModelSelectorConfig>
): ModelSelectorConfig {
  return {
    ...defaultModelSelectorConfig,
    ...config,
  };
}

export const popularProviders = [
  '@langdb/vercel-provider',
  'sarvam-ai-provider',
];

export const allCategories = ['chat', 'image', 'embedding', 'transcription'] as const;

export function getProviderDisplayName(provider: string): string {
  switch (provider) {
    case '@langdb/vercel-provider':
      return 'Vercel AI';
    case 'sarvam-ai-provider':
      return 'Sarvam AI';
    default:
      return provider
        .replace(/-provider$/, '')
        .replace(/@langdb\//, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

export function getModelDisplayName(model: string): string {
  return model
    .replace(/^(openrouter|togetherai)\//, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}