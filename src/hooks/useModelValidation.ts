import { useCallback } from 'react';
import { useModelRegistry } from './useModelRegistry';

export interface ModelValidationResult {
  isValid: boolean;
  model: unknown | null;
  error?: string;
  errorType?: 'NO_REGISTRY' | 'INVALID_MODEL_ID' | 'PROVIDER_ERROR' | 'API_KEY_ERROR';
}

export function useModelValidation() {
  const { registry, getModelFromId, isLoaded } = useModelRegistry();

  const validateModel = useCallback(async (modelId: string): Promise<ModelValidationResult> => {
    if (!isLoaded) {
      return {
        isValid: false,
        model: null,
        error: 'Model registry not loaded yet',
        errorType: 'NO_REGISTRY'
      };
    }

    if (!registry) {
      return {
        isValid: false,
        model: null,
        error: 'No API keys configured. Please add API keys in settings.',
        errorType: 'NO_REGISTRY'
      };
    }

    if (!modelId || !modelId.includes(':')) {
      return {
        isValid: false,
        model: null,
        error: 'Invalid model ID format. Expected format: provider:model',
        errorType: 'INVALID_MODEL_ID'
      };
    }

    const [provider, model] = modelId.split(':');
    if (!provider || !model) {
      return {
        isValid: false,
        model: null,
        error: 'Invalid model ID format. Both provider and model are required.',
        errorType: 'INVALID_MODEL_ID'
      };
    }

    try {
      const languageModel = getModelFromId(modelId);

      if (!languageModel) {
        return {
          isValid: false,
          model: null,
          error: `Model "${modelId}" not available. Check if the provider API key is configured.`,
          errorType: 'PROVIDER_ERROR'
        };
      }

      // Try a minimal test to validate the model works
      try {
        const { generateText } = await import('ai');

        // This is a lightweight test - we don't actually generate text,
        // just verify the model can be instantiated
        await generateText({
          model: languageModel,
          prompt: 'test',
          maxTokens: 1,
        }).catch((error: unknown) => {
          // Check for specific AI SDK error types
          if (error && typeof error === 'object' && 'name' in error && error.name === 'AI_APICallError') {
            const apiError = error as { statusCode?: number };
            if (apiError.statusCode === 401) {
              throw new Error('Invalid API key');
            } else if (apiError.statusCode === 429) {
              throw new Error('Rate limit exceeded');
            } else if (apiError.statusCode === 400) {
              throw new Error('Invalid model or request parameters');
            }
          }
          throw error;
        });

        return {
          isValid: true,
          model: languageModel,
        };
      } catch (testError: unknown) {
        return {
          isValid: false,
          model: null,
          error: (testError as Error).message || 'Model test failed',
          errorType: 'API_KEY_ERROR'
        };
      }
    } catch (error: unknown) {
      return {
        isValid: false,
        model: null,
        error: (error as Error).message || 'Unknown validation error',
        errorType: 'PROVIDER_ERROR'
      };
    }
  }, [registry, getModelFromId, isLoaded]);

  const quickValidateModel = useCallback((modelId: string): ModelValidationResult => {
    if (!isLoaded) {
      return {
        isValid: false,
        model: null,
        error: 'Model registry not loaded yet',
        errorType: 'NO_REGISTRY'
      };
    }

    if (!registry) {
      return {
        isValid: false,
        model: null,
        error: 'No API keys configured',
        errorType: 'NO_REGISTRY'
      };
    }

    if (!modelId || !modelId.includes(':')) {
      return {
        isValid: false,
        model: null,
        error: 'Invalid model ID format',
        errorType: 'INVALID_MODEL_ID'
      };
    }

    const model = getModelFromId(modelId);

    return {
      isValid: !!model,
      model,
      error: model ? undefined : 'Model not available',
      errorType: model ? undefined : 'PROVIDER_ERROR'
    };
  }, [registry, getModelFromId, isLoaded]);

  return {
    validateModel,
    quickValidateModel,
    isLoaded
  };
}