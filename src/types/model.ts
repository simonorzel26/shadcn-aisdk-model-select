export type AiModel = {
  value: string;
  provider: string;
  model: string;
  category: 'chat' | 'embedding' | 'transcription' | 'image' | 'completion' | 'speech';
  context_window?: number;
};

export interface ModelGroup {
  provider: string;
  models: AiModel[];
}

export interface ModelSelectDropdownSettings {
  enabledProviders?: string[];
  enabledCategories?: ('chat' | 'embedding' | 'transcription' | 'image' | 'completion' | 'speech')[];
  showApiKeys?: boolean;
}

export interface ModelSelectorConfig {
  enabledProviders?: string[];
  enabledCategories?: AiModel['category'][];
}

export interface ProviderApiKeys {
  [provider: string]: string;
}

export interface ProviderVisibilitySettings {
  [provider: string]: boolean;
}