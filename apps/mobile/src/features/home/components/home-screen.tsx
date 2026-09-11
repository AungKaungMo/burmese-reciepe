import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Screen } from "@/shared/components/screen";
import { useTheme } from "@/shared/hooks/use-theme";
import { mealFilters } from "../constants";
import type { MealFilter } from "../types";
import { FilterDrawer } from "./filter-drawer";
import { PopularThisWeek } from "./popular-this-week";
import { RecommendedForYou } from "./recommended-for-you";

export function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<MealFilter>("All");
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 pb-8"
      >
        <View className="gap-1">
          <Text className="font-heading text-[36px] leading-[42px] text-text">
            Explore
          </Text>
          <Text className="font-sans text-base leading-6 text-text-secondary">
            Discover recipes for every taste and occasion.
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            className="h-14 flex-1 flex-row items-center rounded-2xl bg-background-element px-4"
            onPress={() => router.push("/search")}
            accessibilityRole="search"
            accessibilityLabel="Search recipes"
          >
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={theme.text}
            />
            <Text
              className="ml-3 flex-1 font-sans text-text-secondary"
              numberOfLines={1}
            >
              Search recipes, ingredients, or cuisines...
            </Text>
          </Pressable>

          <Pressable
            className="h-12 w-9 items-center justify-center"
            onPress={() => setFilterDrawerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter recipes"
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={27}
              color={theme.text}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {mealFilters.map((meal) => {
            const selected = meal === selectedMeal;

            return (
              <Pressable
                key={meal}
                className={`rounded-full px-4 py-2.5 ${
                  selected ? "bg-primary" : "bg-background-element"
                }`}
                onPress={() => setSelectedMeal(meal)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  className={`font-label text-[15px] ${
                    selected ? "text-white" : "text-text"
                  }`}
                >
                  {meal}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <PopularThisWeek />
        <RecommendedForYou />
      </ScrollView>
      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
      />
    </Screen>
  );
}
