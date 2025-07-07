export type AiModel = {
  value: string;
  provider: string;
  model: string;
  label: string;
  category: 'chat' | 'text' | 'embedding' | 'image' | 'moderation' | 'rerank' | 'transcription';
  context_window?: number;
};

export interface ModelGroup {
  provider: string;
  models: AiModel[];
}

export interface ModelSelectDropdownSettings {
  enabledProviders?: string[];
  enabledCategories?: ('chat' | 'image' | 'embedding' | 'transcription' | 'speech' | 'completion' | 'responses')[];
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