'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useModelValidation } from '@/hooks/useModelValidation';
import { PROVIDER_CONFIGS } from '@/config/providers';
import { ModelSelectorProps } from '@/types/model-selector';
import { cn } from '@/lib/utils';

export function ModelSelector({
  value,
  onValueChange,
  className
}: ModelSelectorProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { getAvailableProviders, isLoaded } = useApiKeys();
  const { quickValidateModel } = useModelValidation();
  const [validationResult, setValidationResult] = useState<ReturnType<typeof quickValidateModel> | null>(null);

  const availableModels = useMemo(() => {
    if (!isLoaded) return [];

    const availableProviders = getAvailableProviders();
    const models: Array<{ id: string; provider: string; name: string }> = [];

    PROVIDER_CONFIGS.forEach((provider) => {
      if (availableProviders.includes(provider.key)) {
        provider.popularModels.forEach((modelId) => {
          models.push({
            id: `${provider.key}:${modelId}`,
            provider: provider.name,
            name: modelId,
          });
        });
      }
    });

    return models;
  }, [getAvailableProviders, isLoaded]);

  const selectedModel = availableModels.find(model => model.id === value);

  // Validate selected model whenever it changes
  useEffect(() => {
    if (value && isLoaded) {
      const result = quickValidateModel(value);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [value, isLoaded, quickValidateModel]);

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue);
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;

    if (validationResult.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    switch (validationResult.errorType) {
      case 'NO_REGISTRY':
      case 'API_KEY_ERROR':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'INVALID_MODEL_ID':
      case 'PROVIDER_ERROR':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getValidationTooltip = () => {
    if (!validationResult) return '';

    if (validationResult.isValid) {
      return 'Model is available and ready to use';
    }

    return validationResult.error || 'Model validation failed';
  };

  if (!isLoaded) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a model">
              {selectedModel && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                    {selectedModel.provider}
                  </span>
                  <span>{selectedModel.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableModels.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No models available. Configure API keys to see available models.
              </div>
            ) : (
              PROVIDER_CONFIGS.map((provider) => {
                const providerModels = availableModels.filter(
                  model => model.id.startsWith(`${provider.key}:`)
                );

                if (providerModels.length === 0) return null;

                return (
                  <div key={provider.key}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {provider.name}
                    </div>
                    {providerModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col items-start">
                          <span>{model.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                );
              })
            )}
          </SelectContent>
        </Select>

        {/* Validation Status Indicator */}
        {value && validationResult && (
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
            title={getValidationTooltip()}
          >
            {getValidationIcon()}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="h-10 w-10"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <ApiKeySettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      {/* Validation Error Message */}
      {value && validationResult && !validationResult.isValid && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive max-w-md">
          {validationResult.error}
        </div>
      )}
    </div>
  );
}