import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { replacementFilters, replacementRecipes } from "../constants";
import type { MealReplacementProps } from "../types";
import { useTheme } from "@/shared/hooks/use-theme";
import { MealPlanAiLoading } from "./meal-plan-ai-loading";
import { MealPlanAiSuggestions } from "./meal-plan-ai-suggestions";

export function MealPlanReplacement({
  meal,
  onClose,
  onSelectRecipe,
}: MealReplacementProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
  const visibleRecipes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return replacementRecipes.filter(
      (recipe) =>
        recipe.categories.includes(activeFilter) &&
        (!normalizedSearch || recipe.title.toLowerCase().includes(normalizedSearch)),
    );
  }, [activeFilter, searchTerm]);

  if (isAiLoading) {
    return (
      <MealPlanAiLoading
        mealType={meal.mealType}
        onClose={() => setIsAiLoading(false)}
        onComplete={() => {
          setIsAiLoading(false);
          setIsShowingSuggestions(true);
        }}
      />
    );
  }

  if (isShowingSuggestions) {
    return (
      <MealPlanAiSuggestions
        meal={meal}
        onClose={() => setIsShowingSuggestions(false)}
        onSelectRecipe={onSelectRecipe}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="relative flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Back to edit plan"
          accessibilityRole="button"
          className="z-10 h-10 w-10 items-center justify-center"
          onPress={onClose}
        >
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </Pressable>
        <Text className="absolute left-0 right-0 text-center font-heading text-3xl text-text">
          Replace {meal.mealType === "Snacks" ? "Snack" : meal.mealType}
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-6 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityLabel="Get AI meal suggestions"
          accessibilityRole="button"
          className="flex-row items-center gap-4 rounded-2xl border border-border bg-info-background p-4"
          onPress={() => setIsAiLoading(true)}
        >
          <View className="h-16 w-16 items-center justify-center rounded-xl bg-background-element">
            <MaterialCommunityIcons name="creation" size={34} color={theme.accent} />
          </View>
          <View className="flex-1 gap-1">
            <Text className="font-label text-lg text-text">Let AI suggest for me</Text>
            <Text className="font-sans text-sm text-text-secondary">
              Get a new {meal.mealType.toLowerCase()} based on your goals
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={27} color={theme.text} />
        </Pressable>

        <View className="flex-row items-center gap-3 rounded-full bg-background-element px-4 py-3">
          <MaterialCommunityIcons name="magnify" size={23} color={theme.textSecondary} />
          <TextInput
            accessibilityLabel="Search replacement recipes"
            className="flex-1 font-sans text-base text-text"
            placeholder="Search recipes..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {replacementFilters.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                className={`rounded-full px-4 py-3 ${
                  isActive ? "bg-primary" : "bg-background-element"
                }`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text className={`font-label text-sm ${isActive ? "text-white" : "text-text-secondary"}`}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View>
          {visibleRecipes.map((recipe) => (
            <View
              key={recipe.id}
              className="flex-row items-center gap-4 border-b border-border py-3"
            >
              <Image source={recipe.image} className="h-20 w-20 rounded-xl" resizeMode="cover" />
              <View className="min-w-0 flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="shrink font-label text-lg text-text" numberOfLines={1}>
                    {recipe.title}
                  </Text>
                  {recipe.badge && (
                    <View className="rounded-full bg-[#E7F1DF] px-2 py-1">
                      <Text className="font-label text-xs text-success">{recipe.badge}</Text>
                    </View>
                  )}
                </View>
                <Text className="font-sans text-sm text-text-secondary">
                  {recipe.duration} · {recipe.calories}
                </Text>
              </View>
              <Pressable
                accessibilityLabel={`Use ${recipe.title} for ${meal.mealType}`}
                accessibilityRole="button"
                className="rounded-xl border border-primary px-3 py-2"
                onPress={() => onSelectRecipe(recipe)}
              >
                <Text className="font-label text-sm text-primary">Use This</Text>
              </Pressable>
            </View>
          ))}
          {visibleRecipes.length === 0 && (
            <Text className="py-8 text-center font-sans text-base text-text-secondary">
              No recipes found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
