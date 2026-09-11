import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/use-theme";
import { mealPlanGoals } from "../constants";
import type { MealPlanGoalStepProps } from "../types";
import { MealPlanProgress } from "./meal-plan-progress";

export function MealPlanGoalStep({
  selectedGoal,
  progressFromStep,
  onClose,
  onSelectGoal,
  onContinue,
}: MealPlanGoalStepProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to meal plans"
          accessibilityRole="button"
          className="h-11 w-11 items-start justify-center"
          hitSlop={8}
          onPress={onClose}
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
        <MealPlanProgress step={1} fromStep={progressFromStep} />

        <Text className="font-heading text-3xl leading-10 text-text">
          What&apos;s your goal?
        </Text>
        <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
          This helps us choose the right recipes for you.
        </Text>

        <View className="mt-9 flex-row flex-wrap justify-between gap-y-4">
          {mealPlanGoals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            const iconColor =
              goal.color === "success" ? theme.success : theme.primary;

            return (
              <Pressable
                key={goal.id}
                accessibilityLabel={`Choose ${goal.label} goal`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`h-36 w-[47%] items-center justify-center gap-3 rounded-2xl border bg-card ${
                  isSelected ? "border-2 border-primary" : "border-border"
                }`}
                onPress={() => onSelectGoal(goal.id)}
              >
                <MaterialCommunityIcons
                  name={goal.icon}
                  size={43}
                  color={iconColor}
                />
                <Text className="font-label text-base text-text">
                  {goal.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-auto px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Continue to the next meal plan step"
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
          onPress={onContinue}
        >
          <Text className="font-label text-lg text-white">Next</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
