export interface ProviderApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  mistral?: string;
  cohere?: string;
}

export interface ProviderConfig {
  name: string;
  key: keyof ProviderApiKeys;
  label: string;
  popularModels: string[];
}

export interface ModelSelectorProps {
  value?: string;
  onValueChange?: (modelId: string) => void;
  className?: string;
}

export interface ApiKeySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}