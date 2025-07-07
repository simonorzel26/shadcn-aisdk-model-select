'use client';

import { useMemo, useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, RotateCcw } from 'lucide-react';
import { AiModel } from '@/types/model';
import { useModelSelection } from '@/contexts/ModelSelectionContext';

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

    return groups;
  }, [configurableModels, searchTerm]);

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
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search providers, models, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-8 text-sm"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

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

      <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1">
        {Object.keys(filteredAndGroupedModels).length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchTerm ? 'No models match your search.' : 'No models available.'}
          </div>
        ) : (
          Object.entries(filteredAndGroupedModels).map(([provider, categories]) => {
            const providerModels = Object.values(categories).flat();
            const selectedProviderModels = providerModels.filter(m => state.selectedModelIds.has(m.value));
            const isAllProviderSelected = selectedProviderModels.length > 0 && selectedProviderModels.length === providerModels.length;
            const isProviderIndeterminate = selectedProviderModels.length > 0 && !isAllProviderSelected;

            return (
              <div key={provider} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={isAllProviderSelected}
                      indeterminate={isProviderIndeterminate}
                      onCheckedChange={(checked) => toggleProvider(provider, !!checked)}
                      aria-label={`Select all ${provider} models`}
                    />
                    <span className="text-sm font-medium">
                      {provider}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pl-2">
                  {Object.entries(categories).map(([category, models]) => {
                    const categoryModels = models;
                    const selectedCategoryModels = categoryModels.filter(m => state.selectedModelIds.has(m.value));
                    const isAllCategorySelected = selectedCategoryModels.length > 0 && selectedCategoryModels.length === categoryModels.length;
                    const isCategoryIndeterminate = selectedCategoryModels.length > 0 && !isAllCategorySelected;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={isAllCategorySelected}
                            indeterminate={isCategoryIndeterminate}
                            onCheckedChange={(checked) => toggleCategory(provider, category, !!checked)}
                            aria-label={`Select all ${category} models from ${provider}`}
                          />
                          <div className="text-xs font-medium text-muted-foreground capitalize">
                            {category} ({models.length})
                          </div>
                        </div>
                        <div className="space-y-1 pl-6">
                          {models.map((model, index) => (
                            <div key={`${model.provider}-${model.model}-${index}`} className="flex items-center space-x-2">
                              <Checkbox
                                checked={state.selectedModelIds.has(model.value)}
                                onCheckedChange={() => toggleModel(model.value)}
                              />
                              <span className="text-xs text-muted-foreground truncate flex-1">
                                {model.model}
                              </span>
                            </div>
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
    </div>
  );
}