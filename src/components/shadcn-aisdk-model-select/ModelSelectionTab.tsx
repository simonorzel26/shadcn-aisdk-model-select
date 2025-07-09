'use client';

import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { AiModel } from '@/types/model';
import { useModelSelection } from '@/contexts/ModelSelectionContext';
import { Command, CommandInput } from '@/components/ui/command';
import { useModelSortAndFilter } from '@/hooks/useModelSortAndFilter';
import { useScrollToProvider } from '@/hooks/useScrollToProvider';

const useModelSelectionHandlers = (
  configurableModels: AiModel[],
  state: ReturnType<typeof useModelSelection>['state'],
  setProviderToScrollTo: (provider: string | null) => void,
) => {
  const { toggleModel, toggleCategory, toggleProvider } = useModelSelection();

  const handleToggleModel = (modelValue: string) => {
    const model = configurableModels.find(m => m.value === modelValue);
    if (!model) return;

    const modelsInProvider = configurableModels.filter(m => m.provider === model.provider);
    const hasSelectedModelsBefore = modelsInProvider.some(m => state.selectedModelIds.has(m.value));
    const isTogglingOn = !state.selectedModelIds.has(modelValue);

    if (isTogglingOn && !hasSelectedModelsBefore) {
      setProviderToScrollTo(model.provider);
    }
    toggleModel(modelValue);
  };

  const handleToggleCategory = (provider: string, category: string, checked: boolean) => {
    if (checked) {
      const modelsInProvider = configurableModels.filter(m => m.provider === provider);
      const hasSelectedModelsBefore = modelsInProvider.some(m => state.selectedModelIds.has(m.value));
      if (!hasSelectedModelsBefore) {
        setProviderToScrollTo(provider);
      }
    }
    toggleCategory(provider, category, checked);
  };

  const handleToggleProvider = (provider: string, checked: boolean) => {
    if (checked) {
      const modelsInProvider = configurableModels.filter(m => m.provider === provider);
      const hasSelectedModelsBefore = modelsInProvider.some(m => state.selectedModelIds.has(m.value));
      if (!hasSelectedModelsBefore) {
        setProviderToScrollTo(provider);
      }
    }
    toggleProvider(provider, checked);
  };

  return { handleToggleModel, handleToggleCategory, handleToggleProvider };
};

export function ModelSelectionTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const { state, configurableModels, selectAll, deselectAll, resetToDefault } =
    useModelSelection();

  const { sortedProviderEntries, filteredAndGroupedModels } = useModelSortAndFilter(
    configurableModels,
    state.selectedModelIds,
    searchTerm,
  );

  const { scrollContainerRef, setProviderToScrollTo, getProviderRef } = useScrollToProvider(
    sortedProviderEntries,
  );

  const { handleToggleModel, handleToggleCategory, handleToggleProvider } =
    useModelSelectionHandlers(configurableModels, state, setProviderToScrollTo);

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
            <Button variant="ghost" size="sm" onClick={selectAll} className="h-full px-2 text-xs">
              All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll} className="h-full px-2 text-xs">
              None
            </Button>
            <Button variant="ghost" size="sm" onClick={resetToDefault} className="h-full px-2 text-xs">
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
            const selectedProviderModels = providerModels.filter(m =>
              state.selectedModelIds.has(m.value),
            );
            const isAllProviderSelected =
              selectedProviderModels.length > 0 &&
              selectedProviderModels.length === providerModels.length;
            const isProviderIndeterminate =
              selectedProviderModels.length > 0 && !isAllProviderSelected;

            return (
              <div
                key={provider}
                className="border rounded-md p-3 space-y-2"
                ref={getProviderRef(provider)}
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
                      onCheckedChange={checked => handleToggleProvider(provider, !!checked)}
                      aria-label={`Select all ${provider} models`}
                    />
                    <span className="text-sm font-medium">{provider}</span>
                  </label>
                </div>

                <div className="space-y-3 pl-2">
                  {Object.entries(categories).map(([category, models]) => {
                    const categoryModels = models;
                    const selectedCategoryModels = categoryModels.filter(m =>
                      state.selectedModelIds.has(m.value),
                    );
                    const isAllCategorySelected =
                      selectedCategoryModels.length > 0 &&
                      selectedCategoryModels.length === categoryModels.length;
                    const isCategoryIndeterminate =
                      selectedCategoryModels.length > 0 && !isAllCategorySelected;

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
                            onCheckedChange={checked =>
                              handleToggleCategory(provider, category, !!checked)
                            }
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