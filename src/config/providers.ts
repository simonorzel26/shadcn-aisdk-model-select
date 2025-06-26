import { createProviderRegistry } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createCohere } from '@ai-sdk/cohere';
import { ProviderApiKeys } from '@/types/model-selector';

export function createRegistry(apiKeys: ProviderApiKeys) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers: Record<string, any> = {};

  if (apiKeys.openai) {
    providers.openai = createOpenAI({ apiKey: apiKeys.openai });
  }

  if (apiKeys.anthropic) {
    providers.anthropic = createAnthropic({ apiKey: apiKeys.anthropic });
  }

  if (apiKeys.google) {
    providers.google = createGoogleGenerativeAI({ apiKey: apiKeys.google });
  }

  if (apiKeys.mistral) {
    providers.mistral = createMistral({ apiKey: apiKeys.mistral });
  }

  if (apiKeys.cohere) {
    providers.cohere = createCohere({ apiKey: apiKeys.cohere });
  }

  return createProviderRegistry(providers);
}

export const PROVIDER_CONFIGS = [
  {
    name: 'OpenAI',
    key: 'openai' as const,
    label: 'OpenAI API Key',
    popularModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  {
    name: 'Anthropic',
    key: 'anthropic' as const,
    label: 'Anthropic API Key',
    popularModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229']
  },
  {
    name: 'Google',
    key: 'google' as const,
    label: 'Google AI API Key',
    popularModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']
  },
  {
    name: 'Mistral',
    key: 'mistral' as const,
    label: 'Mistral API Key',
    popularModels: ['mistral-large-latest', 'mistral-small-latest', 'open-mistral-nemo']
  },
  {
    name: 'Cohere',
    key: 'cohere' as const,
    label: 'Cohere API Key',
    popularModels: ['command-r-plus', 'command-r', 'command']
  }
];