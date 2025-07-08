import fs from 'fs/promises';
import path from 'path';

const packageRoot = 'src/components/model-select-package';
const srcDir = path.join(packageRoot, 'src');
const registryFile = path.join(packageRoot, 'registry.json');
const registryBaseDir = 'model-select';

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
    name: 'model-select',
    version: '0.0.1',
    dependencies: ['lucide-react', 'react', 'react-dom', 'tailwindcss-animate'],
    registryDependencies: [
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
    files: [],
  };

  for (const file of files) {
    if (file.endsWith('.DS_Store')) continue;

    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(srcDir, file);
    const registryPath = path.join(registryBaseDir, relativePath).replace(/\\/g, '/');

    registry.files.push({
      path: registryPath,
      content: content.replace(/'@\/components\/ui\/(.*?)'/g,`'@/components/ui/$1'`),
    });
  }

  registry.files.sort((a, b) => a.path.localeCompare(b.path));

  await fs.writeFile(registryFile, JSON.stringify(registry, null, 2));
  console.log(`Registry generated at ${registryFile}`);
}

generateRegistry().catch(console.error);