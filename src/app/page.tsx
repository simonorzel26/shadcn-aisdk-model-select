import { SimpleGenerator } from '@/components/SimpleGenerator';
import { aiModels, availableProviders } from '@/lib/models';
import { getProviderDisplayName } from '@/lib/config';

export default function Page() {
  const modelsByCategory = aiModels.reduce((acc, model) => {
    if (!acc[model.category]) {
      acc[model.category] = [];
    }
    acc[model.category].push(model);
    return acc;
  }, {} as Record<string, typeof aiModels>);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl font-bold">AI Model Selector</h1>

      </div>


      <div className="w-full max-w-5xl mt-8">
        <SimpleGenerator initialModels={aiModels} />
      </div>
      <p className=" mt-12 text-sm text-muted-foreground">
          {aiModels.length} models available from {availableProviders.length} providers
        </p>
      <div className="w-full max-w-5xl mt-2 p-4 bg-muted/50 rounded-lg border">
        <p className="text-sm text-center text-muted-foreground">
          Model definitions powered by{' '}
          <a
            href="https://www.npmjs.com/package/@simonorzel26/ai-models"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            @simonorzel26/ai-models
          </a>
          {' '}• AI SDK compatible model registry
        </p>
      </div>
      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Model Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(modelsByCategory).map(([category, models]) => (
            <div key={category} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 capitalize">{category}</h3>
              <p className="text-sm text-muted-foreground">
                {models.length} models available
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                From {[...new Set(models.map(m => m.provider))].length} providers
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Available Providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableProviders.map(provider => {
            const providerModels = aiModels.filter(model => model.provider === provider);
            return (
              <div key={provider} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{getProviderDisplayName(provider)}</h3>
                <p className="text-sm text-muted-foreground">
                  {providerModels.length} models available
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Categories: {[...new Set(providerModels.map(m => m.category))].join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
