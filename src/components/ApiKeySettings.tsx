'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PROVIDER_CONFIGS } from '@/config/providers';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKeySettingsProps, ProviderApiKeys } from '@/types/model-selector';

const apiKeySchema = z.object({
  openai: z.string().optional(),
  anthropic: z.string().optional(),
  google: z.string().optional(),
  mistral: z.string().optional(),
  cohere: z.string().optional(),
});

export function ApiKeySettings({ open, onOpenChange }: ApiKeySettingsProps) {
  const { apiKeys, updateApiKeys } = useApiKeys();

  const form = useForm<ProviderApiKeys>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: apiKeys,
  });

  React.useEffect(() => {
    form.reset(apiKeys);
  }, [apiKeys, form]);

  const onSubmit = (values: ProviderApiKeys) => {
    updateApiKeys(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys for different LLM providers. Only models from providers with configured keys will be available.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {PROVIDER_CONFIGS.map((provider) => (
              <FormField
                key={provider.key}
                control={form.control}
                name={provider.key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{provider.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={`Enter your ${provider.name} API key`}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save API Keys</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}