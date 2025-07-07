'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { AiModel } from '@/types/model';
import { useModelSelection } from '@/contexts/ModelSelectionContext';
import { Command, CommandInput } from '@/components/ui/command';

export function ModelSelectionTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    state,
    toggleModel,
    configurableModels,
    selectAll,
    deselectAll,
    resetToDefault,
    toggleProvider,
    toggleCategory,
  } = useModelSelection();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const providerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [providerToScrollTo, setProviderToScrollTo] = useState<string | null>(null);

  const handleToggleModel = (modelValue: string) => {
    const model = configurableModels.find(m => m.value === modelValue);
    if (!model) return;

    const modelsInProvider = configurableModels.filter(m => m.provider === model.provider);
    const selectedInProvider = modelsInProvider.filter(m => state.selectedModelIds.has(m.value));
    const wasSelectedBeforeToggle = state.selectedModelIds.has(modelValue);

    if (selectedInProvider.length === 0 && !wasSelectedBeforeToggle) {
      setProviderToScrollTo(model.provider);
    }

    toggleModel(modelValue);
  };

  const handleToggleCategory = (provider: string, category: string, checked: boolean) => {
    const modelsInProvider = configurableModels.filter(m => m.provider === provider);
    const hasSelectedInProvider = modelsInProvider.some(m => state.selectedModelIds.has(m.value));
    if (checked && !hasSelectedInProvider) {
      setProviderToScrollTo(provider);
    }
    toggleCategory(provider, category, checked);
  };

  const handleToggleProvider = (provider: string, checked: boolean) => {
     const modelsInProvider = configurableModels.filter(m => m.provider === provider);
    const hasSelectedInProvider = modelsInProvider.some(m => state.selectedModelIds.has(m.value));
    if (checked && !hasSelectedInProvider) {
      setProviderToScrollTo(provider);
    }
    toggleProvider(provider, checked);
  };

  const filteredAndGroupedModels = useMemo(() => {
    const groups: Record<string, Record<string, AiModel[]>> = {};
    const searchLower = searchTerm.toLowerCase().trim();

    configurableModels.forEach(model => {
      if (searchLower) {
        const providerMatch = model.provider.toLowerCase().includes(searchLower);
        const modelMatch = model.model.toLowerCase().includes(searchLower);
        const categoryMatch = model.category.toLowerCase().includes(searchLower);

        if (!providerMatch && !modelMatch && !categoryMatch) {
          return;
        }
      }

      if (!groups[model.provider]) {
        groups[model.provider] = {};
      }
      if (!groups[model.provider][model.category]) {
        groups[model.provider][model.category] = [];
      }
      groups[model.provider][model.category].push(model);
    });

    for (const provider in groups) {
      for (const category in groups[provider]) {
        groups[provider][category].sort((a, b) => {
          return a.model.localeCompare(b.model);
        });
      }
    }

    return groups;
  }, [configurableModels, searchTerm]);

  const sortedProviderEntries = useMemo(() => {
    const providers = Object.entries(filteredAndGroupedModels);

    providers.sort(([providerA, categoriesA], [providerB, categoriesB]) => {
      const modelsA = Object.values(categoriesA).flat();
      const modelsB = Object.values(categoriesB).flat();

      const hasSelectedA = modelsA.some(m => state.selectedModelIds.has(m.value));
      const hasSelectedB = modelsB.some(m => state.selectedModelIds.has(m.value));

      if (hasSelectedA !== hasSelectedB) {
        return hasSelectedA ? -1 : 1;
      }

      return providerA.localeCompare(providerB);
    });

    return providers;
  }, [filteredAndGroupedModels, state.selectedModelIds]);

  useEffect(() => {
    if (providerToScrollTo) {
      const node = providerRefs.current.get(providerToScrollTo);
      if (node) {
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      setProviderToScrollTo(null);
    }
  }, [providerToScrollTo, sortedProviderEntries]); // re-run when list is sorted


  const totalSelectedCount = state.selectedModelIds.size;
  const filteredModelsInView = useMemo(() =>
    Object.values(filteredAndGroupedModels).flatMap(cat => Object.values(cat).flat()),
    [filteredAndGroupedModels]
  );

  const filteredSelectedCount = useMemo(() =>
    filteredModelsInView.filter(m => state.selectedModelIds.has(m.value)).length,
    [filteredModelsInView, state.selectedModelIds]
  );

  if (!state.isLoaded) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <Command
      className="space-y-3 bg-transparent"
      filter={(value, search) => {
        // We do our own filtering, so we just need to tell cmdk to show everything
        if (value.includes(search)) return 1;
        return 0;
      }}
    >
      <div className="space-y-3">
        <CommandInput
          placeholder="Search providers, models, or categories..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="h-8 text-sm"
        />

        <div className="flex items-center justify-between h-7">
          <div className="text-xs text-muted-foreground px-1">
            {searchTerm ? (
              <>
                {filteredSelectedCount} of {filteredModelsInView.length} matching models selected
              </>
            ) : (
              `${totalSelectedCount} of ${configurableModels.length} models selected`
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost" size="sm" onClick={selectAll}
              className="h-full px-2 text-xs"
            >
              All
            </Button>
            <Button
              variant="ghost" size="sm" onClick={deselectAll}
              className="h-full px-2 text-xs"
            >
              None
            </Button>
            <Button
              variant="ghost" size="sm" onClick={resetToDefault}
              className="h-full px-2 text-xs"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1" ref={scrollContainerRef}>
        {sortedProviderEntries.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchTerm ? 'No models match your search.' : 'No models available.'}
          </div>
        ) : (
          sortedProviderEntries.map(([provider, categories]) => {
            const providerModels = Object.values(categories).flat();
            const selectedProviderModels = providerModels.filter(m => state.selectedModelIds.has(m.value));
            const isAllProviderSelected = selectedProviderModels.length > 0 && selectedProviderModels.length === providerModels.length;
            const isProviderIndeterminate = selectedProviderModels.length > 0 && !isAllProviderSelected;

            return (
              <div
                key={provider}
                className="border rounded-md p-3 space-y-2"
                ref={node => {
                  if (node) {
                    providerRefs.current.set(provider, node);
                  } else {
                    providerRefs.current.delete(provider);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`provider-${provider}`}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      id={`provider-${provider}`}
                      checked={isAllProviderSelected}
                      indeterminate={isProviderIndeterminate}
                      onCheckedChange={(checked) => handleToggleProvider(provider, !!checked)}
                      aria-label={`Select all ${provider} models`}
                    />
                    <span className="text-sm font-medium">
                      {provider}
                    </span>
                  </label>
                </div>

                <div className="space-y-3 pl-2">
                  {Object.entries(categories).map(([category, models]) => {
                    const categoryModels = models;
                    const selectedCategoryModels = categoryModels.filter(m => state.selectedModelIds.has(m.value));
                    const isAllCategorySelected = selectedCategoryModels.length > 0 && selectedCategoryModels.length === categoryModels.length;
                    const isCategoryIndeterminate = selectedCategoryModels.length > 0 && !isAllCategorySelected;

                    return (
                      <div key={category} className="space-y-1">
                        <label
                          htmlFor={`category-${provider}-${category}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            id={`category-${provider}-${category}`}
                            checked={isAllCategorySelected}
                            indeterminate={isCategoryIndeterminate}
                            onCheckedChange={(checked) => handleToggleCategory(provider, category, !!checked)}
                            aria-label={`Select all ${category} models from ${provider}`}
                          />
                          <div className="text-xs font-medium text-muted-foreground capitalize">
                            {category} ({models.length})
                          </div>
                        </label>
                        <div className="space-y-1 pl-6">
                          {models.map((model, index) => (
                            <label
                              key={`${model.provider}-${model.model}-${index}`}
                              htmlFor={`model-${model.value}`}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Checkbox
                                id={`model-${model.value}`}
                                checked={state.selectedModelIds.has(model.value)}
                                onCheckedChange={() => handleToggleModel(model.value)}
                              />
                              <span className="text-xs text-muted-foreground truncate flex-1">
                                {model.model}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Command>
  );
}