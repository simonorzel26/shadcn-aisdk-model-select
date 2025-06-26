export interface DiscoveredModel {
  provider: string;
  modelId: string;
  source: string;
  type: 'language' | 'embedding' | 'image' | 'audio';
}

export interface ProviderInspection {
  provider: string;
  createFunction: unknown;
  availableMethods: string[];
  errorMessage?: string;
}

export interface ProviderModel {
  modelId: string;
}

export interface ProviderInstance {
  languageModels?: ProviderModel[] | Record<string, unknown>;
  models?: ProviderModel[];
}