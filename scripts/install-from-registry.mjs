#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

async function main() {
  const registryUrl = process.argv[2];
  if (!registryUrl) {
    console.error('Usage: bun install-from-registry.mjs <url-to-registry.json>');
    process.exit(1);
  }

  try {
    console.log(`Fetching registry from ${registryUrl}...`);
    const response = await fetch(registryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    const registry = await response.json();
    const { name, registryDependencies, files } = registry;

    console.log(`\nInstalling component: ${name}`);

    // 1. Install shadcn/ui dependencies
    if (registryDependencies && registryDependencies.length > 0) {
      console.log('\nInstalling shadcn/ui dependencies...');
      const deps = registryDependencies.join(' ');
      const installCommand = `npx shadcn@latest add ${deps}`;
      try {
        console.log(`> ${installCommand}`);
        execSync(installCommand, { stdio: 'inherit' });
      } catch (error) {
        console.warn('\nCould not install shadcn/ui dependencies. Please install them manually:');
        console.warn(`> ${installCommand}`);
      }
    }

    // 2. Create component files
    console.log('\nCreating component files...');
    // This assumes a 'src/components' directory exists, which is standard for shadcn/ui.
    const baseDir = path.join(process.cwd(), 'src', 'components');

    for (const file of files) {
      const filePath = path.join(baseDir, file.path);
      const dir = path.dirname(filePath);

      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, file.content);
      console.log(`  ✓ Created ${path.relative(process.cwd(), filePath)}`);
    }

    console.log(`\n✅ Component '${name}' installed successfully!`);

  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}`);
    process.exit(1);
  }
}

main();