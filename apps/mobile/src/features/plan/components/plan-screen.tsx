import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Screen } from "@/shared/components/screen";
import { useTheme } from "@/shared/hooks/use-theme";
import { recentMealPlans } from "../constants";
import type { MealPlanPeriod } from "../types";
import { MealPlanToggle } from "./meal-plan-toggle";
import { PlanCreator } from "./plan-creator";
import { RecentPlans } from "./recent-plans";

export function PlanScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<MealPlanPeriod>("Daily");

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 pb-8"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 gap-0.5">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="sprout"
                size={26}
                color={theme.success}
              />
              <Text className="font-heading text-[34px] leading-10 text-text">
                Meal Plan
              </Text>
            </View>
            <Text className="font-sans text-base text-text-secondary">
              Simple plans for a better you
            </Text>
          </View>
        </View>
         <View className="mt-1">
            <MealPlanToggle
              selectedPeriod={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </View>

        <PlanCreator onCreate={() => router.push("/plan-creator")} />
        <RecentPlans plans={recentMealPlans} />

      </ScrollView>
    </Screen>
  );
}
