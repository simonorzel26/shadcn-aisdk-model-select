'use client';

import { BotMessageSquare } from 'lucide-react';
import { getFilteredModels } from '@/lib/models';
import type { AiModel } from '@/types/model';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { DocSection } from './DocSection';

function DemoUI({ models }: { models: AiModel[] }) {
  return (
    <CardContent className="p-6">
      <h3 className="font-semibold text-foreground mb-4">Live Output</h3>
      <p className="text-sm">
        The <code>getFilteredModels</code> function found{' '}
        <strong>{models.length} models</strong> based on the criteria.
      </p>
      <ul className="text-xs text-muted-foreground mt-2 space-y-1 max-h-48 overflow-y-auto">
        {models.map(m => (
          <li key={m.value}>{m.model}</li>
        ))}
      </ul>
    </CardContent>
  );
}

export function GettingStarted() {
  const installCode = `bun add @simonorzel26/ai-models`;

  const models = getFilteredModels({
    providers: ['openai', 'anthropic', 'google'],
    categories: ['chat'],
  });

  const usageCode = `
import { getFilteredModels } from '@simonorzel26/ai-models';

// Get all chat models from OpenAI, Anthropic, and Google
const models = getFilteredModels({
  providers: ['openai', 'anthropic', 'google'],
  categories: ['chat'],
});

// Result: ${models.length} models found.
  `;

  return (
    <DocSection title="Getting Started" icon={<BotMessageSquare className="h-6 w-6" />}>
      <p>
        The model data is sourced from the <code>@simonorzel26/ai-models</code> package. This library is automatically updated daily to stay in sync with the official Vercel AI SDK, ensuring you always have the latest models available.
      </p>
      <p>First, install the package:</p>
      <CodeBlock code={installCode} lang="bash" />
      <p>Then, use its helper function <code>getFilteredModels</code> to get the list of models you want to make available in your app. You can filter by provider, category, or leave it empty to get all models.</p>

      <div className="mt-4">
        <Card className="grid md:grid-cols-2 overflow-hidden">
          <DemoUI models={models} />
          <div className="relative">
            <CodeBlock code={usageCode} />
          </div>
        </Card>
      </div>
    </DocSection>
  );
}