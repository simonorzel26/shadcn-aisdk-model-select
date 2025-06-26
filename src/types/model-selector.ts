export interface ProviderApiKeys {
  [key: string]: string | undefined;
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