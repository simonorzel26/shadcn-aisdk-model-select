"use client";

import { useState } from 'react';
import { SimpleGenerator } from '@/components/SimpleGenerator';
import { DiscoveredModel, ProviderInspection } from '@/types/model-discovery';

interface ModelDiscoveryViewProps {
  initialDiscoveredModels: DiscoveredModel[];
  initialInspectedProviders: ProviderInspection[];
}

export function ModelDiscoveryView({
  initialDiscoveredModels,
  initialInspectedProviders,
}: ModelDiscoveryViewProps) {
  const [inspectedProviders] = useState<ProviderInspection[]>(initialInspectedProviders);
  const [discoveredModels] = useState<DiscoveredModel[]>(initialDiscoveredModels);
  const [isLoading] = useState(initialDiscoveredModels.length === 0 && initialInspectedProviders.length === 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl font-bold">AI SDK Model Discovery</h1>
      </div>

      <div className="w-full max-w-5xl mt-8">
        <SimpleGenerator initialModels={initialDiscoveredModels} />
      </div>

      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-semibold">Discovered Language Models</h2>
        {isLoading ? (
          <p>Loading models...</p>
        ) : (
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Provider</th>
                <th className="py-2">Model ID</th>
                <th className="py-2">Type</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {discoveredModels.map((model, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{model.provider}</td>
                  <td className="py-2">{model.modelId}</td>
                  <td className="py-2">{model.type}</td>
                  <td className="py-2">{model.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-semibold">Provider Inspection Details</h2>
        {isLoading ? (
          <p>Inspecting providers...</p>
        ) : (
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Provider</th>
                <th className="py-2">Create Function</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {inspectedProviders.map((provider, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{provider.provider}</td>
                  <td className="py-2">{String(provider.createFunction)}</td>
                  <td className="py-2">{provider.errorMessage ? `Error: ${provider.errorMessage}` : 'OK'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}