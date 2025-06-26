'use client';

import { useState } from 'react';
import { generateText, LanguageModel } from 'ai';
import { Settings } from 'lucide-react';
import { useModelValidation } from '@/hooks/useModelValidation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ApiKeySettings } from './ApiKeySettings';

export function SimpleGenerator() {
  const [prompt, setPrompt] = useState('Write a short story about a friendly robot who discovers a new planet.');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { validateModel } = useModelValidation();

  const modelId = 'openai:gpt-4o-mini';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResponse('');

    try {
      const validation = await validateModel(modelId);

      if (!validation.isValid || !validation.model) {
        setResponse(`Model validation failed. Make sure your OpenAI API key is set correctly in the settings (⚙️). Error: ${validation.error}`);
        return;
      }

      const { text } = await generateText({
        model: validation.model as LanguageModel,
        prompt: prompt.trim(),
      });
      setResponse(text);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Generation failed:', error);
      setResponse(`Error: Failed to generate text. ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Simple AI SDK Call</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="h-10 w-10 shrink-0"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">API Key Settings</span>
        </Button>
        <ApiKeySettings
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        This is a simple example of using the Vercel AI SDK. It uses the model{' '}
        <code className="font-mono bg-muted px-1 py-0.5 rounded">{modelId}</code>.
        Make sure you have set your OpenAI API key in the settings (⚙️).
      </p>
      <div className="space-y-2">
        <label htmlFor="prompt-textarea" className="text-sm font-medium">Prompt:</label>
        <Textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          className="min-h-[100px]"
        />
      </div>
      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Generating...' : 'Generate Response'}
      </Button>
      {response && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Response:</label>
          <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}