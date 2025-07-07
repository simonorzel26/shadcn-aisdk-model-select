export interface AiModel {
  provider: string;
  model: string;
  category: 'chat' | 'image' | 'embedding' | 'transcription';
  value: string;
}

export interface ModelGroup {
  provider: string;
  models: AiModel[];
}

export interface ModelSelectorConfig {
  enabledProviders?: string[];
  enabledCategories?: ('chat' | 'image' | 'embedding' | 'transcription')[];
}

export interface ProviderApiKeys {
  [provider: string]: string;
}

export interface ProviderVisibilitySettings {
  [provider: string]: boolean;
}