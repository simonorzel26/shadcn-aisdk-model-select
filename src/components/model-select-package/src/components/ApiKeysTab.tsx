'use client';

import { useMemo, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandInput } from '@/components/ui/command';
import { useApiKeys } from '../hooks/useApiKeys';

interface ApiKeysTabProps {
  providers: string[];
}

export function ApiKeysTab({ providers }: ApiKeysTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { apiKeys, setApiKey } = useApiKeys(providers);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sortedAndFilteredProviders = useMemo(() => {
    return providers
      .filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aHasKey = !!apiKeys[a];
        const bHasKey = !!apiKeys[b];
        if (aHasKey === bHasKey) {
          return a.localeCompare(b);
        }
        return aHasKey ? -1 : 1;
      });
  }, [providers, searchTerm, apiKeys]);

  const handleInputChange = (provider: string, value: string) => {
    const wasEmpty = !apiKeys[provider];
    setApiKey(provider, value);
    if (wasEmpty && value) {
      itemRefs.current[provider]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Command className="bg-transparent p-4">
      <CommandInput
        placeholder="Search providers..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        className="h-8 text-sm"
      />
      <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1">
        {sortedAndFilteredProviders.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchTerm ? 'No providers match your search.' : 'No providers available.'}
          </div>
        ) : (
          <>
            {sortedAndFilteredProviders.map(provider => (
              <div
                key={provider}
                className="p-3 space-y-2"
                ref={el => {
                  itemRefs.current[provider] = el;
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor={`${provider}-key`}>{provider}</Label>
                  <Input
                    id={`${provider}-key`}
                    type="password"
                    placeholder={`Enter ${provider} API Key`}
                    value={apiKeys[provider] || ''}
                    onChange={e => handleInputChange(provider, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="h-7 my-3 bg-transparent" />
    </Command>
  );
}