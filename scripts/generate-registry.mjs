import fs from 'fs/promises';
import path from 'path';

const packageRoot = 'src/components/model-select-package';
const srcDir = path.join(packageRoot, 'src');
const registryFile = path.join('public', 'shadcn-aisdk-model-select.json');
const registryBaseDir = 'shadcn-aisdk-model-select';

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function generateRegistry() {
  const files = await getFiles(srcDir);

  const registry = {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "shadcn-aisdk-model-select",
    "type": "registry:component",
    "title": "AI SDK Model Select",
    "description": "A reusable React component for selecting LLM models with API key management, built with shadcn/ui and Vercel AI SDK.",
    "dependencies": ["clsx", "tailwind-merge", "lucide-react"],
    "registryDependencies": [
      'button',
      'dialog',
      'tabs',
      'input',
      'label',
      'checkbox',
      'command',
      'tooltip',
      'card',
      'select',
      'switch',
      'textarea',
      'form',
    ],
    "files": [],
  };

  for (const file of files) {
    if (file.endsWith('.DS_Store')) continue;

    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(srcDir, file);
    const registryPath = path.join(registryBaseDir, relativePath).replace(/\\/g, '/');

    registry.files.push({
      path: registryPath,
      content: content,
      type: 'registry:component',
    });
  }

  registry.files.sort((a, b) => a.path.localeCompare(b.path));

  await fs.writeFile(registryFile, JSON.stringify(registry, null, 2));
  console.log(`Registry generated at ${registryFile}`);
}

generateRegistry().catch(console.error);