import fs from 'fs/promises';
import path from 'path';

const packageRoot = 'src/components/model-select-package';
const srcDir = path.join(packageRoot, 'src');
const publicDir = 'public';
const componentName = 'shadcn-aisdk-model-select';
const componentFileName = `${componentName}.json`;

const componentRegistryFile = path.join(publicDir, componentFileName);
const mainRegistryFile = path.join(publicDir, 'registry.json');

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

  const componentFiles = [];
  const indexFiles = [];

  for (const file of files) {
    if (file.endsWith('.DS_Store')) continue;

    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(srcDir, file);
    const registryPath = path.join(componentName, relativePath).replace(/\\/g, '/');

    componentFiles.push({
      path: registryPath,
      content: content,
      type: 'registry:component',
    });

    indexFiles.push({
      path: registryPath,
      type: 'registry:component',
    });
  }

  componentFiles.sort((a, b) => a.path.localeCompare(b.path));
  indexFiles.sort((a, b) => a.path.localeCompare(b.path));

  const registryDependencies = [
    'button', 'dialog', 'tabs', 'input', 'label', 'checkbox',
    'command', 'tooltip', 'card', 'select', 'switch', 'textarea', 'form'
  ];

  // Create the detailed component registry file
  const componentRegistry = {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": componentName,
    "type": "registry:component",
    "title": "AI SDK Model Select",
    "description": "A reusable React component for selecting LLM models with API key management, built with shadcn/ui and Vercel AI SDK.",
    "dependencies": ["clsx", "tailwind-merge", "lucide-react"],
    "registryDependencies": registryDependencies,
    "files": componentFiles,
  };

  await fs.writeFile(componentRegistryFile, JSON.stringify(componentRegistry, null, 2));
  console.log(`Component registry generated at ${componentRegistryFile}`);

  // Create the main index registry file
  const mainRegistry = {
    "$schema": "https://ui.shadcn.com/schema/registry.json",
    "name": "shadcn-aisdk-model-select-registry",
    "homepage": "https://shadcn-aisdk-model-select.vercel.app",
    "title": "Shadcn AI SDK Model Select",
    "description": "Custom registry for the Shadcn AI SDK Model Select component.",
    "author": "Simon Orzel",
    "dependencies": [],
    "items": [
      {
        "name": componentName,
        "type": "registry:component",
        "title": "AI SDK Model Select",
        "description": "A reusable React component for selecting LLM models with API key management, built with shadcn/ui and Vercel AI SDK.",
        "registryDependencies": registryDependencies,
        "files": indexFiles,
      }
    ]
  };

  await fs.writeFile(mainRegistryFile, JSON.stringify(mainRegistry, null, 2));
  console.log(`Main registry generated at ${mainRegistryFile}`);
}

generateRegistry().catch(console.error);