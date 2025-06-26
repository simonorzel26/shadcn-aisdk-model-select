import { CoreMessage, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { cohere } from '@ai-sdk/cohere';
import { mistral } from '@ai-sdk/mistral';

export async function POST(req: Request) {
  const { messages, model: modelId }: { messages: CoreMessage[]; model: string } =
    await req.json();

  const [provider, ...modelParts] = modelId.split(':');
  const modelName = modelParts.join(':');

  let model;

  switch (provider) {
    case 'google':
      model = google(modelName);
      break;
    case 'openai':
      model = openai(modelName);
      break;
    case 'anthropic':
      model = anthropic(modelName);
      break;
    case 'cohere':
      model = cohere(modelName);
      break;
    case 'mistral':
      model = mistral(modelName);
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const result = await streamText({
    model: model,
    messages,
  });

  return result.toAIStreamResponse();
}