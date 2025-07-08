'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelSelectionTab } from './ModelSelectionTab';
import { ApiKeysTab } from './ApiKeysTab';

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
  const [activeTab, setActiveTab] = useState('modelSelection');

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
        <div className="flex-grow pt-4 overflow-y-auto ">
          {showApiKeys ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="modelSelection"
                  className="data-[state=active]:ring-2 data-[state=active]:ring-primary"
                >
                  Model Selection
                </TabsTrigger>
                <TabsTrigger
                  value="apiKeys"
                  className="data-[state=active]:ring-2 data-[state=active]:ring-primary"
                >
                  API Keys
                </TabsTrigger>
              </TabsList>
              <TabsContent value="modelSelection">
                <ModelSelectionTab />
              </TabsContent>
              <TabsContent value="apiKeys">
                <ApiKeysTab providers={providers} />
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