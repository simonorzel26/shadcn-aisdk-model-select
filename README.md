# AI Model Selector

A modern, professional AI model selector built with Next.js, TypeScript, and Tailwind CSS. This project provides a clean, isolated dropdown component for selecting AI models from various providers.

## Preview

![AI Model Selector Preview 1](https://shadcn-aisdk-model-select.vercel.app/img1.png)
![AI Model Selector Preview 2](https://shadcn-aisdk-model-select.vercel.app/img2.png)

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

- **✅ Composable Architecture**: Built with React Context for flexible and decoupled state management.
- **🔋 Global & Local State**: Use the `TinyModelSelector` in global, local, or controlled mode.
- **🔧 Extensible**: Add custom logic easily with the `useModelSelection` hook.
- **🎨 Provider Organization**: Models grouped by provider with a clean visual hierarchy.
- **⚡ SOLID Principles**: Clean, maintainable, and extensible architecture.
- **🧩 Shadcn/UI**: Built with the latest shadcn/ui components for a professional look.
- **🎯 Type Safety**: Full TypeScript support with proper type definitions.

## Installation

To add the component to your project, run the following command:

```bash
npx shadcn-cli@latest add https://shadcn-aisdk-model-select.vercel.app/r/shadcn-aisdk-model-select.json
```

## Usage

The library is built around a single React Context provider, `ModelSelectionProvider`, which manages all shared state.

### 1. Wrap your App
First, wrap the root of your application (or the relevant part) with the `ModelSelectionProvider`. This provides the context for all child components to access the model selection state.

```tsx
import { ModelSelectionProvider } from '@/components/shadcn-aisdk-model-select';
import { getFilteredModels } from '@/lib/models'; // Example model fetching

function App() {
  const models = getFilteredModels(); // Your list of AI models
  const initialModel = models[0]?.value;

  return (
    <ModelSelectionProvider
      configurableModels={models}
      initialModel={initialModel}
    >
      {/* Your application components */}
    </ModelSelectionProvider>
  );
}
```

### 2. Use the Components
You can now use the `ModelSelectDropdown` and `TinyModelSelector` components anywhere within the provider. They will automatically sync with the shared state.

#### `ModelSelectDropdown`
The main, feature-rich dropdown component.
```tsx
import { ModelSelectDropdown } from '@/components/shadcn-aisdk-model-select';

function MyToolbar() {
  return <ModelSelectDropdown settings={true} />;
}
```

#### `TinyModelSelector`
A minimal, secondary selector perfect for unobtrusive placement.
```tsx
import { TinyModelSelector } from '@/components/shadcn-aisdk-model-select';

function MyHeader() {
  return <TinyModelSelector />;
}
```

### 3. Accessing State
Use the `useModelSelection` hook to access the shared state from any component.

```tsx
import { useModelSelection } from '@/components/shadcn-aisdk-model-select';

function MyComponent() {
  const { selectedModel, selectedModels, allModels } = useModelSelection();

  return (
    <div>
      <p>Current Model: {selectedModel}</p>
      <p>Visible Models: {selectedModels.length}</p>
    </div>
  );
}
```

## State Management Modes

The `TinyModelSelector` offers three state management modes for maximum flexibility:

- **Global State (default)**: Connects to the shared `ModelSelectionContext`.
  ```tsx
  <TinyModelSelector />
  ```
- **Local State**: Manages its own state, independent of the global context.
  ```tsx
  <TinyModelSelector useGlobalState={false} />
  ```
- **Controlled Mode**: Externally controlled via `value` and `onValueChange` props.
  ```tsx
  const [value, setValue] = useState('');
  <TinyModelSelector value={value} onValueChange={setValue} />
  ```

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

### Key Components & Hooks

- **`ModelSelectionProvider`**: The root context provider that manages all state.
- **`ModelSelectDropdown`**: The main dropdown component with settings.
- **`TinyModelSelector`**: A minimal selector with flexible state management.
- **`ModelSelectionTab`**: The tab-based UI for filtering models in the settings dialog.
- **`useModelSelection`**: Hook to access shared state (`selectedModel`, `selectedModels`, etc.).
- **`useApiKeys`**: Hook for managing API keys in `localStorage`.
- **`useModelSortAndFilter`**: Hook for client-side filtering and sorting of models.

### Type System

```typescript
interface AiModel {
  provider: string;
  model: string;
  category: string;
  value: string; // A unique identifier, e.g., 'openai/gpt-4'
}

interface ModelSelectionContextType {
  state: { selectedModelIds: Set<string>; isLoaded: boolean; };
  selectedModels: AiModel[];
  configurableModels: AiModel[];
  allModels: AiModel[];
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  // ... and more
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
