# shadcn-aisdk-model-select

A reusable React component for selecting LLM models with API key management, built with shadcn/ui and Vercel AI SDK.

## Features

- 🎯 **Model Selection**: Dropdown to select from available LLM models
- 🔑 **API Key Management**: Settings dialog to configure API keys for different providers
- 💾 **Persistent Storage**: API keys stored securely in localStorage
- 🎨 **Beautiful UI**: Built with shadcn/ui components and Tailwind CSS
- 🔧 **TypeScript**: Full TypeScript support with proper type definitions
- 📦 **AI SDK Integration**: Uses Vercel AI SDK provider registry for dynamic model discovery
- ✅ **Model Validation**: Real-time validation with visual indicators and error handling
- 🌐 **Multiple Providers**: Support for OpenAI, Anthropic, Google, Mistral, and Cohere

## Supported Providers

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro
- **Mistral**: Mistral Large, Mistral Small, Mistral Nemo
- **Cohere**: Command R+, Command R, Command

## Installation

```bash
npm install shadcn-aisdk-model-select
```

## Usage

### Basic Usage

```tsx
import { ModelSelector } from 'shadcn-aisdk-model-select';

function App() {
  const [selectedModel, setSelectedModel] = useState('');

  return (
    <ModelSelector
      value={selectedModel}
      onValueChange={setSelectedModel}
    />
  );
}
```

### With Custom Styling

```tsx
import { ModelSelector } from 'shadcn-aisdk-model-select';

function App() {
  const [selectedModel, setSelectedModel] = useState('');

  return (
    <ModelSelector
      value={selectedModel}
      onValueChange={setSelectedModel}
      className="my-custom-class"
    />
  );
}
```

### Using the Hook Directly

```tsx
import { useApiKeys, useModelRegistry } from 'shadcn-aisdk-model-select';

function MyComponent() {
  const { apiKeys, updateApiKeys, getAvailableProviders, isLoaded } = useApiKeys();
  const { registry, getModelFromId } = useModelRegistry();

  // Your component logic here
}
```

### Using with AI SDK

```tsx
import { generateText } from 'ai';
import { useModelValidation } from 'shadcn-aisdk-model-select';

function MyAIComponent() {
  const { validateModel } = useModelValidation();

  const handleGenerate = async (prompt: string, modelId: string) => {
    // Validate model before use
    const validation = await validateModel(modelId);

    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { text } = await generateText({
      model: validation.model,
      prompt,
    });

    return text;
  };
}
```

### Model Validation

```tsx
import { useModelValidation } from 'shadcn-aisdk-model-select';

function MyComponent() {
  const { quickValidateModel, validateModel } = useModelValidation();

  // Quick validation (synchronous, checks registry only)
  const quickResult = quickValidateModel('openai:gpt-4o');

  // Full validation (asynchronous, tests actual API)
  const fullValidation = await validateModel('openai:gpt-4o');

  if (fullValidation.isValid) {
    // Model is ready to use
    console.log('Model validated successfully');
  } else {
    // Handle validation errors
    console.error(fullValidation.error);
    switch (fullValidation.errorType) {
      case 'NO_REGISTRY':
        // No API keys configured
        break;
      case 'INVALID_MODEL_ID':
        // Invalid model format
        break;
      case 'PROVIDER_ERROR':
        // Provider not available
        break;
      case 'API_KEY_ERROR':
        // API key issues
        break;
    }
  }
}
```

## Component API

### ModelSelector Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | The currently selected model ID |
| `onValueChange` | `(modelId: string) => void` | `undefined` | Callback when model selection changes |
| `className` | `string` | `undefined` | Additional CSS classes to apply |

### useApiKeys Hook

Returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `apiKeys` | `ProviderApiKeys` | Object containing all stored API keys |
| `updateApiKeys` | `(newKeys: ProviderApiKeys) => void` | Function to update stored API keys |
| `getAvailableProviders` | `() => string[]` | Function that returns array of providers with valid API keys |
| `isLoaded` | `boolean` | Whether the API keys have been loaded from localStorage |

### useModelValidation Hook

Returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `validateModel` | `(modelId: string) => Promise<ModelValidationResult>` | Async function to fully validate a model (includes API test) |
| `quickValidateModel` | `(modelId: string) => ModelValidationResult` | Sync function to quickly validate model format and registry availability |
| `isLoaded` | `boolean` | Whether the validation system is ready |

#### ModelValidationResult

| Property | Type | Description |
|----------|------|-------------|
| `isValid` | `boolean` | Whether the model is valid and ready to use |
| `model` | `unknown \| null` | The validated model instance (if valid) |
| `error` | `string?` | Error message (if invalid) |
| `errorType` | `string?` | Error category: `NO_REGISTRY`, `INVALID_MODEL_ID`, `PROVIDER_ERROR`, `API_KEY_ERROR` |

## Requirements

This component requires the following dependencies to be installed in your project:

- React 18+
- Next.js (for the demo)
- Tailwind CSS
- shadcn/ui components (automatically included)

## Development

To run the demo locally:

```bash
git clone https://github.com/simonorzel26/shadcn-aisdk-model-select.git
cd shadcn-aisdk-model-select
npm install
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
