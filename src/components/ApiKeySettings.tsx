'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useProviderSettings } from '@/hooks/useProviderSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ProviderApiKeys } from '@/types/model-selector';

interface ApiKeySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: string[];
}

export function ApiKeySettings({
  open,
  onOpenChange,
  providers,
}: ApiKeySettingsProps) {
  const { apiKeys, updateApiKeys, isLoaded: apiKeysLoaded } = useApiKeys();
  const {
    providerVisibility,
    setAllProviderVisibility,
    isLoaded: visibilityLoaded,
  } = useProviderSettings();

  const [localApiKeys, setLocalApiKeys] = useState<ProviderApiKeys>({});
  const [localVisibility, setLocalVisibility] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (open && apiKeysLoaded && visibilityLoaded) {
      const initialVisibility = { ...providerVisibility };
      providers.forEach(provider => {
        if (initialVisibility[provider] === undefined) {
          initialVisibility[provider] = !!apiKeys[provider];
        }
      });
      setLocalApiKeys(apiKeys);
      setLocalVisibility(initialVisibility);
    }
  }, [
    open,
    apiKeys,
    providerVisibility,
    providers,
    apiKeysLoaded,
    visibilityLoaded,
  ]);

  const handleSave = () => {
    updateApiKeys(localApiKeys);
    setAllProviderVisibility(localVisibility);
    onOpenChange(false);
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setLocalApiKeys(prev => ({ ...prev, [provider]: value }));
    setLocalVisibility(prev => ({ ...prev, [provider]: !!value }));
  };

  const handleVisibilityToggle = (provider: string, checked: boolean) => {
    setLocalVisibility(prev => ({ ...prev, [provider]: checked }));
  };

  if (!apiKeysLoaded || !visibilityLoaded) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key & Provider Settings</DialogTitle>
          <DialogDescription>
            Manage your API keys and model visibility for each provider.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {providers.map(provider => (
            <div key={provider} className="space-y-3 p-3 border rounded-md">
              <h3 className="font-semibold capitalize">{provider}</h3>
              <div className="space-y-2">
                <Label htmlFor={`${provider}-key`}>API Key</Label>
                <Input
                  id={`${provider}-key`}
                  type="password"
                  value={localApiKeys[provider] || ''}
                  onChange={e => handleApiKeyChange(provider, e.target.value)}
                  placeholder={`Enter ${provider} API Key`}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id={`${provider}-visible`}
                  checked={!!localVisibility[provider]}
                  onCheckedChange={checked =>
                    handleVisibilityToggle(provider, checked)
                  }
                />
                <Label htmlFor={`${provider}-visible`}>
                  Show {provider} models in selector
                </Label>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} className="mt-4 w-full">
          Save and Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}