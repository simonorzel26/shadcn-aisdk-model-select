'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ModelSelectionTab } from './ModelSelectionTab';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ModelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: string[];
  showApiKeys?: boolean;
}

export function ModelSettingsDialog({
  open,
  onOpenChange,
  providers,
  showApiKeys = true,
}: ModelSettingsDialogProps) {
  const { apiKeys, setApiKey } = useApiKeys(providers);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
          <DialogDescription>
            {showApiKeys
              ? 'Manage your API keys and select the models you want to use.'
              : 'Select the models you want to display in the dropdown.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pt-4">
          {showApiKeys ? (
            <Tabs defaultValue="modelSelection">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="modelSelection">Model Selection</TabsTrigger>
                <TabsTrigger value="apiKeys">API Keys</TabsTrigger>
              </TabsList>
              <TabsContent value="modelSelection">
                <ModelSelectionTab />
              </TabsContent>
              <TabsContent value="apiKeys">
                <div className="p-4 space-y-4">
                  {providers.map(provider => (
                    <div key={provider} className="space-y-2">
                      <Label htmlFor={`${provider}-key`}>{provider}</Label>
                      <Input
                        id={`${provider}-key`}
                        type="password"
                        placeholder={`Enter ${provider} API Key`}
                        value={apiKeys[provider] || ''}
                        onChange={e => setApiKey(provider, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <ModelSelectionTab />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}