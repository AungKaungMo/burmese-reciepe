import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { BottomDrawer } from "@/shared/components/bottom-drawer";
import { useTheme } from "@/shared/hooks/use-theme";
import {
  cookingTimes,
  cuisines,
  dietaryOptions,
  difficultyLevels,
} from "../constants";
import type {
  CookingTime,
  Cuisine,
  DietaryOption,
  DifficultyLevel,
  FilterChoiceGroupProps,
  FilterDrawerProps,
} from "../types";

export function FilterDrawer({ visible, onClose }: FilterDrawerProps) {
  const theme = useTheme();
  const [dietaryPreference, setDietaryPreference] =
    useState<DietaryOption>("No preference");
  const [cookingTime, setCookingTime] = useState<CookingTime>("Any");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Any");
  const [cuisine, setCuisine] = useState<Cuisine>();

  const resetFilters = () => {
    setDietaryPreference("No preference");
    setCookingTime("Any");
    setDifficulty("Any");
    setCuisine(undefined);
  };

  return (
    <BottomDrawer
      visible={visible}
      onClose={onClose}
      closeAccessibilityLabel="Close filters"
    >
      <>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-heading text-3xl text-text">Filters</Text>
          <Pressable
            className="h-10 w-10 items-center justify-center"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          >
            <MaterialCommunityIcons name="close" size={30} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-6 pb-5"
        >
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="font-heading text-xl text-text">
                Dietary Preferences
              </Text>
              <Pressable onPress={resetFilters} accessibilityRole="button">
                <Text className="font-label text-base text-primary">Reset</Text>
              </Pressable>
            </View>
            <FilterChoiceGroup
              options={dietaryOptions}
              selected={dietaryPreference}
              onSelect={setDietaryPreference}
              hideTitle
            />
          </View>

          <FilterChoiceGroup
            title="Cooking Time"
            options={cookingTimes}
            selected={cookingTime}
            onSelect={setCookingTime}
          />
          <FilterChoiceGroup
            title="Difficulty Level"
            options={difficultyLevels}
            selected={difficulty}
            onSelect={setDifficulty}
            equalWidth
            horizontalPadding="px-3"
          />
          <FilterChoiceGroup
            title="Cuisine"
            options={cuisines}
            selected={cuisine}
            onSelect={setCuisine}
          />
        </ScrollView>

        <Pressable
          className="mb-5 items-center rounded-full bg-primary py-4"
          onPress={onClose}
          accessibilityRole="button"
        >
          <Text className="font-label text-lg text-white">
            Show 128 Recipes
          </Text>
        </Pressable>
      </>
    </BottomDrawer>
  );
}

function FilterChoiceGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
  equalWidth = false,
  horizontalPadding = "px-4",
  hideTitle = false,
}: FilterChoiceGroupProps<T>) {
  return (
    <View className="gap-3">
      {!hideTitle ? (
        <Text className="font-heading text-xl text-text">{title}</Text>
      ) : null}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;

          return (
            <Pressable
              key={option}
              className={`items-center rounded-2xl border py-3 ${horizontalPadding} ${
                equalWidth ? "flex-1" : ""
              } ${
                isSelected
                  ? "border-primary bg-background-selected"
                  : "border-border bg-card"
              }`}
              onPress={() => onSelect(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                className={`font-label text-base ${
                  isSelected ? "text-primary" : "text-text"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
