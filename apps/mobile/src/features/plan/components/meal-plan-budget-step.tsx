import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Budget from "../../../assets/icons/Budget";
import Clock from "../../../assets/icons/Clock";
import Flexible from "../../../assets/icons/Flexible";
import Normal from "../../../assets/icons/Normal";
import { useTheme } from "@/shared/hooks/use-theme";
import { mealPlanBudgetOptions } from "../constants";
import type { MealPlanBudgetStepProps } from "../types";

const budgetIcon = {
  budget: Budget,
  normal: Normal,
  flexible: Flexible,
  "dont-mind": Clock,
} as const;

const budgetRows = [
  mealPlanBudgetOptions.slice(0, 2),
  mealPlanBudgetOptions.slice(2, 4),
];

export function MealPlanBudgetStep({
  selectedBudget,
  onBack,
  onSelectBudget,
  onContinue,
}: MealPlanBudgetStepProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to ingredients to avoid"
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
        <View className="mb-10 flex-row items-center gap-3">
          <View className="h-2 flex-1 overflow-hidden rounded-full bg-background-element">
            <View className="h-full w-[71.429%] rounded-full bg-primary" />
          </View>
          <Text className="font-label text-sm text-text-secondary">5/7</Text>
        </View>

        <Text className="font-heading text-3xl leading-9 text-text">
          What&apos;s your budget per meal?
        </Text>
        <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
          This helps us suggest suitable recipes.
        </Text>

        <View className="mt-6 gap-3">
          {budgetRows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((budget) => {
                const isSelected = selectedBudget === budget.id;
                const BudgetIcon = budgetIcon[budget.id];

                return (
                  <Pressable
                    key={budget.id}
                    accessibilityLabel={`Choose ${budget.label} budget`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`h-40 flex-1 items-center justify-center gap-2 rounded-2xl border px-2 ${
                      isSelected
                        ? "border-2 border-primary bg-active-tab-background"
                        : "border-border"
                    }`}
                    onPress={() => onSelectBudget(budget.id)}
                  >
                    <BudgetIcon
                      width={48}
                      height={48}
                      color={isSelected ? theme.primary : theme.textSecondary}
                    />
                    <Text className="font-label text-lg text-text">
                      {budget.label}
                    </Text>
                    <Text className="-mt-1 text-center font-sans text-sm leading-4 text-text-secondary">
                      {budget.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View className="mt-auto flex-row gap-3 px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Go back to ingredients to avoid"
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
