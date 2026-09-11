import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/use-theme";
import { debounce } from "@/shared/utils/debounce";
import { avoidIngredientOptions } from "../constants";
import type { MealPlanAvoidIngredientsStepProps } from "../types";
import { MealPlanProgress } from "./meal-plan-progress";

export function MealPlanAvoidIngredientsStep({
  searchTerm,
  selectedIngredients,
  progressFromStep,
  onBack,
  onChangeSearchTerm,
  onToggleIngredient,
  onContinue,
}: MealPlanAvoidIngredientsStepProps) {
  const theme = useTheme();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const updateDebouncedSearchTerm = useMemo(
    () => debounce((value: string) => setDebouncedSearchTerm(value), 350),
    [],
  );
  const matchingIngredients = avoidIngredientOptions.filter((ingredient) =>
    ingredient.toLowerCase().includes(debouncedSearchTerm.trim().toLowerCase()),
  );

  useEffect(
    () => () => updateDebouncedSearchTerm.cancel(),
    [updateDebouncedSearchTerm],
  );

  useEffect(() => {
    if (searchTerm === debouncedSearchTerm) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    updateDebouncedSearchTerm(searchTerm);
  }, [searchTerm, debouncedSearchTerm, updateDebouncedSearchTerm]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to dietary preferences"
          accessibilityRole="button"
          className="h-11 w-11 items-start justify-center"
          hitSlop={8}
          onPress={onBack}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={theme.text}
          />
        </Pressable>
        <Text className="font-heading text-2xl text-text">
          Create Meal Plan
        </Text>
        <View className="h-11 w-11" />
      </View>

      <View className="px-6">
        <MealPlanProgress step={4} fromStep={progressFromStep} />

        <Text className="font-heading text-3xl leading-10 text-text">
          Any ingredients to avoid?
        </Text>
        <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
          Select what you don&apos;t eat or are allergic to.
        </Text>

        <View className="mt-5 flex-row items-center rounded-full bg-background-element px-4">
          <MaterialCommunityIcons
            name="magnify"
            size={25}
            color={theme.textSecondary}
          />
          <TextInput
            accessibilityLabel="Search ingredients"
            className="h-14 flex-1 px-3 font-sans text-base text-text"
            placeholder="Search ingredients..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={onChangeSearchTerm}
          />
        </View>

        <View className="mt-6 flex-row flex-wrap gap-3">
          {isSearching ? (
            <View className="w-full items-center py-4">
              <ActivityIndicator color={theme.primary} />
              <Text className="mt-2 font-sans text-sm text-text-secondary">
                Searching ingredients...
              </Text>
            </View>
          ) : matchingIngredients.length > 0 ? (
            matchingIngredients.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient);

              return (
                <Pressable
                  key={ingredient}
                  accessibilityLabel={`Avoid ${ingredient}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`rounded-full px-5 py-3 ${
                    isSelected
                      ? "bg-background-selected"
                      : "bg-background-element"
                  }`}
                  onPress={() => onToggleIngredient(ingredient)}
                >
                  <Text
                    className={`font-label text-base ${
                      isSelected ? "text-primary" : "text-text"
                    }`}
                  >
                    {ingredient}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <View className="w-full items-center rounded-2xl bg-background-element px-5 py-6">
              <Text className="font-label text-base text-text">
                No ingredients found
              </Text>
              <Text className="mt-1 text-center font-sans text-sm text-text-secondary">
                Try searching for a different ingredient.
              </Text>
            </View>
          )}
        </View>

        <Text className="mt-12 font-heading text-2xl text-text">
          Selected ({selectedIngredients.length})
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-3">
          {selectedIngredients.map((ingredient) => (
            <Pressable
              key={ingredient}
              accessibilityLabel={`Remove ${ingredient}`}
              accessibilityRole="button"
              className="flex-row items-center gap-2 rounded-full bg-background-selected px-5 py-3"
              onPress={() => onToggleIngredient(ingredient)}
            >
              <Text className="font-label text-base text-text">
                {ingredient}
              </Text>
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={theme.text}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-auto flex-row gap-3 px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Go back to dietary preferences"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary py-4"
          onPress={onBack}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={theme.primary}
          />
          <Text className="font-label text-lg text-primary">Back</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Continue to the next meal plan step"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
          onPress={onContinue}
        >
          <Text className="font-label text-lg text-white">Next</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
