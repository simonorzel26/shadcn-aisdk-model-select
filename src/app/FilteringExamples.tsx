import { getFilteredModels } from '@/lib/models';
import { AiModel } from '@/types/model';

function ModelList({ title, models }: { title: string; models: AiModel[] }) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
        <pre className="text-sm">
          {JSON.stringify(models.map(m => m.value), null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function FilteringExamples() {
  // Example 1: Filtering by a single provider
  // This will return all models from OpenAI, regardless of their category.
  const openAIModels = getFilteredModels({ providers: ['openai'] });

  // Example 2: Filtering by multiple categories
  // This will return all models that are either for 'chat' or 'embedding' from any provider.
  const chatAndEmbeddingModels = getFilteredModels({
    categories: ['chat', 'embedding'],
  });

  // Example 3: Filtering by both provider and category
  // This demonstrates combining filters. It will return only 'chat' models
  // from the 'anthropic' provider.
  const anthropicChatModels = getFilteredModels({
    providers: ['anthropic'],
    categories: ['chat'],
  });

  return (
    <div className="w-full space-y-8 mt-16">
      <h2 className="text-xl font-bold text-center">
        <code>getFilteredModels</code> Usage Examples
      </h2>
      <div className="space-y-6">
        <ModelList title="1. OpenAI Models" models={openAIModels} />
        <ModelList
          title="2. Chat and Embedding Models"
          models={chatAndEmbeddingModels}
        />
        <ModelList
          title="3. Anthropic Chat Models"
          models={anthropicChatModels}
        />
      </div>
    </div>
  );
}