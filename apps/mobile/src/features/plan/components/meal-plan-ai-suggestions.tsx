import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { aiSuggestedRecipes } from "../constants";
import type { MealPlanAiSuggestionsProps } from "../types";
import { useTheme } from "@/shared/hooks/use-theme";

const tagStyles = {
  primary: "bg-tag-red-bg text-tag-red-text",
  success: "bg-tag-green-bg text-tag-green-text",
  neutral: "bg-tag-gold-bg text-tag-gold-text",
  info: "bg-tag-gold-bg text-tag-gold-text",
} as const;

export function MealPlanAiSuggestions({
  meal,
  onClose,
  onSelectRecipe,
}: MealPlanAiSuggestionsProps) {
  const theme = useTheme();
  const mealLabel = meal.mealType === "Snacks" ? "snack" : meal.mealType.toLowerCase();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="relative flex-row items-center px-6 pb-2 pt-2">
        <Pressable
          accessibilityLabel="Back to replacement recipes"
          accessibilityRole="button"
          className="z-10 h-10 w-10 items-center justify-center"
          onPress={onClose}
        >
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </Pressable>
        <Text className="absolute left-0 right-0 text-center font-heading text-3xl text-text">
          {meal.mealType === "Snacks" ? "Snack" : meal.mealType} Suggestions
        </Text>
      </View>

      <Text className="px-6 pb-4 text-center font-sans text-text-secondary">
        Here are some {mealLabel} options for you.
      </Text>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {aiSuggestedRecipes.map((recipe) => (
          <View
            key={recipe.id}
            className="flex-row gap-3 rounded-2xl bg-info-background p-3"
          >
            <Image source={recipe.image} className="h-24 w-24 rounded-xl" resizeMode="cover" />
            <View className="min-w-0 flex-1 gap-2">
              <View className="flex-row items-center justify-between gap-2">
                <Text className="shrink font-heading text-xl text-text" numberOfLines={1}>
                  {recipe.title}
                </Text>
                <Pressable
                  accessibilityLabel={`Use ${recipe.title} for ${meal.mealType}`}
                  accessibilityRole="button"
                  className="rounded-xl bg-primary px-4 py-2"
                  onPress={() => onSelectRecipe(recipe)}
                >
                  <Text className="font-label text-sm text-white">Use This</Text>
                </Pressable>
              </View>

              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={15}
                    color={theme.textSecondary}
                  />
                  <Text className="font-sans text-xs text-text-secondary">
                    {recipe.duration}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="fire" size={15} color={theme.textSecondary} />
                  <Text className="font-sans text-xs text-text-secondary">
                    {recipe.calories}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {recipe.tags.map((tag) => {
                  const [backgroundClass, textClass] = tagStyles[tag.tone].split(" ");

                  return (
                    <View key={tag.label} className={`rounded-full px-3 py-1 ${backgroundClass}`}>
                      <Text className={`font-label text-xs ${textClass}`}>{tag.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
