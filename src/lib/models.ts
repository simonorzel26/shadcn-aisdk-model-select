import { AiModel } from '@/types/model';

const { ALL_MODELS } = require('@simonorzel26/ai-models');

export const aiModels: AiModel[] = ALL_MODELS;

export const chatModels = aiModels.filter(model => model.category === 'chat');
export const availableProviders = [...new Set(aiModels.map(model => model.provider))];