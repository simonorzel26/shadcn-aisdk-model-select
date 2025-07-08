# AI Model Selector

A modern, professional AI model selector built with Next.js, TypeScript, and Tailwind CSS. This project provides a clean, isolated dropdown component for selecting AI models from various providers.

## Main Concept

The **ModelSelectDropdown** component is the core of this project - an isolated, self-contained component following **Single Responsibility Principle**:

### 🎯 **Core Responsibilities**
- Render a beautiful select dropdown with provider grouping
- Accept models array and output selected model value
- **Optional** API key management via `settings` prop
- Clean, professional UI with shadcn/ui components

### ⚙️ **Settings Mode**
- `settings={false}` - Pure dropdown, no localStorage, no settings button
- `settings={true}` - Includes settings button + API key management
- `settings={{...}}` - Custom configuration object

## Features

- **🔒 Isolated Component**: Self-contained with zero external dependencies when `settings={false}`
- **📦 Single Responsibility**: Just model selection - settings are optional
- **🎨 Provider Organization**: Models grouped by provider with clean visual hierarchy
- **⚡ SOLID Principles**: Clean, maintainable, extensible architecture
- **🔧 Comprehensive Model Support**: Works with `@simonorzel26/ai-models` package
- **🎯 Type Safety**: Full TypeScript support with proper type definitions

## Installation

To add the component to your project, run the following command:

```bash
npx shadcn-cli@latest add https://shadcn-aisdk-model-select.vercel.app/r/model-select-package.json
```

## Usage Examples

### 1. Basic Usage (No Settings)
```tsx
import { ModelSelectDropdown } from '@/components/ModelSelectDropdown';
import { aiModels } from '@/lib/models';

export default function BasicExample() {
  const [selected, setSelected] = useState('');

  return (
    <ModelSelectDropdown
      models={aiModels}
      selectedModel={selected}
      onModelChange={setSelected}
      placeholder="Choose any model..."
    />
  );
}
```

### 2. With Settings (API Key Management)
```tsx
<ModelSelectDropdown
  models={aiModels}
  selectedModel={selected}
  onModelChange={setSelected}
  settings={true}
  placeholder="Select model with settings..."
/>
```

### 3. OpenAI & Claude Chat Models Only
```tsx
// Filter models before passing
const openaiClaudeModels = aiModels.filter(model =>
  (model.value.includes('openai') || model.value.includes('anthropic')) &&
  model.category === 'chat'
);

<ModelSelectDropdown
  models={openaiClaudeModels}
  selectedModel={selected}
  onModelChange={setSelected}
  placeholder="OpenAI or Claude models..."
/>
```

### 4. Chat Models Only (With Settings)
```tsx
<ModelSelectDropdown
  models={aiModels}
  selectedModel={selected}
  onModelChange={setSelected}
  settings={{
    enabledCategories: ['chat']
  }}
  placeholder="Chat models only..."
/>
```

### Configuration

You can configure which providers and categories are enabled by default:

```tsx
import { createModelSelectorConfig } from '@/lib/config';

const config = createModelSelectorConfig({
  enabledProviders: ['@langdb/vercel-provider', 'sarvam-ai-provider'],
  enabledCategories: ['chat', 'image']
});
```

### Available Model Categories

- **chat**: Conversational AI models
- **image**: Image generation models
- **embedding**: Text embedding models
- **transcription**: Audio transcription models

### Provider Management

Users can manage API keys and provider visibility through the settings interface:

- Store API keys securely in localStorage
- Toggle provider visibility
- Automatically show/hide providers based on API key availability

## Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint
```

## Architecture

### Key Components

- **ModelSelectDropdown**: 🎯 **Main component** - Isolated dropdown with integrated settings button
- **ModelSelector**: Legacy dropdown component (still available)
- **ApiKeySettings**: Dialog for managing API keys and provider settings
- **SimpleGenerator**: Example component showing model usage
- **useModels**: Hook for filtering and organizing models
- **useProviderSettings**: Hook for managing provider visibility
- **useApiKeys**: Hook for API key management

### Type System

```typescript
interface AiModel {
  provider: string;
  model: string;
  category: 'chat' | 'image' | 'embedding' | 'transcription';
  value: string;
}

interface ModelSelectorConfig {
  enabledProviders?: string[];
  enabledCategories?: ('chat' | 'image' | 'embedding' | 'transcription')[];
}
```

## Customization

### Default Configuration

Edit `src/lib/config.ts` to change default settings:

```typescript
export const defaultModelSelectorConfig: ModelSelectorConfig = {
  enabledCategories: ['chat'],
  enabledProviders: [
    '@langdb/vercel-provider',
    'sarvam-ai-provider',
  ],
};
```

### Provider Display Names

Customize how provider names are displayed:

```typescript
export function getProviderDisplayName(provider: string): string {
  switch (provider) {
    case '@langdb/vercel-provider':
      return 'Vercel AI';
    case 'sarvam-ai-provider':
      return 'Sarvam AI';
    default:
      return provider.replace(/-provider$/, '').replace(/[@_-]/g, ' ');
  }
}
```

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [AI SDK](https://sdk.vercel.ai/) - AI integrations
- [@simonorzel26/ai-models](https://www.npmjs.com/package/@simonorzel26/ai-models) - Model definitions

## License

MIT License - feel free to use this in your projects!
