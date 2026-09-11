import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getRecipeDetail, recipeDetails } from "../../constants";
import type { RecipeDetailTab } from "../../types";
import { RecipeHero } from "./recipe-hero";
import { RecipeOverview } from "./recipe-overview";
import { RecipeRecommendations } from "./recipe-recommendations";
import { RecipeSummary } from "./recipe-summary";
import { RecipeTabs } from "./recipe-tabs";

export function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<RecipeDetailTab>("Overview");
  const contentScrollRef = useRef<ScrollView>(null);
  const recipe = getRecipeDetail(id);
  const relatedRecipes = useMemo(
    () =>
      Object.values(recipeDetails)
        .filter((item) => item.id !== recipe.id)
        .slice(0, 3),
    [recipe.id],
  );

  const handleTabChange = (tab: RecipeDetailTab) => {
    setActiveTab(tab);
    contentScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 h-[355px]">
        <RecipeHero recipe={recipe} />
      </View>

      <View className="absolute bottom-0 mb-6 left-0 right-0 top-64 overflow-hidden rounded-t-3xl bg-background">
        <View className="bg-background px-5 pb-6 pt-5">
          <RecipeSummary recipe={recipe} />
        </View>
        <View className="z-10 bg-background px-5">
          <RecipeTabs activeTab={activeTab} onChange={handleTabChange} />
        </View>
        <ScrollView
          ref={contentScrollRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-6 px-5 pb-28 pt-6"
        >
          <RecipeOverview recipe={recipe} activeTab={activeTab} />
          {activeTab === "Overview" ? (
            <RecipeRecommendations recipes={relatedRecipes} />
          ) : null}
        </ScrollView>
      </View>

      <SafeAreaView
        edges={["bottom"]}
        className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-3 pt-2"
      >
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
          accessibilityRole="button"
          accessibilityLabel={`Start cooking ${recipe.title}`}
        >
          <MaterialCommunityIcons name="chef-hat" size={23} color="white" />
          <Text className="font-label text-lg text-white">Start Cooking</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
