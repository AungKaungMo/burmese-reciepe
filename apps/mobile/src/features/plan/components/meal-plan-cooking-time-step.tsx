import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Clock from "../../../assets/icons/Clock";
import DontMind from "../../../assets/icons/DontMind";
import Thunder from "../../../assets/icons/Thunder";
import { useTheme } from "@/shared/hooks/use-theme";
import { mealPlanCookingTimeOptions } from "../constants";
import type { MealPlanCookingTimeStepProps } from "../types";
import { MealPlanProgress } from "./meal-plan-progress";

const cookingTimeIcon = {
  quick: Thunder,
  normal: Clock,
  "dont-mind": DontMind,
} as const;

export function MealPlanCookingTimeStep({
  selectedCookingTime,
  progressFromStep,
  onBack,
  onSelectCookingTime,
  onContinue,
}: MealPlanCookingTimeStepProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to budget"
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

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <MealPlanProgress step={6} fromStep={progressFromStep} />

        <Text className="font-heading text-3xl leading-9 text-text">
          How much time do you want{"\n"}to spend cooking?
        </Text>
        <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
          We&apos;ll match recipes to your available time.
        </Text>

        <View className="mt-6 gap-3">
          {mealPlanCookingTimeOptions.map((cookingTime) => {
            const isSelected = selectedCookingTime === cookingTime.id;
            const CookingTimeIcon = cookingTimeIcon[cookingTime.id];

            return (
              <Pressable
                key={cookingTime.id}
                accessibilityLabel={`Choose ${cookingTime.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`h-32 flex-row items-center rounded-2xl border px-4 ${
                  isSelected
                    ? "border-2 border-primary bg-active-tab-background"
                    : "border-border"
                }`}
                onPress={() => onSelectCookingTime(cookingTime.id)}
              >
                <View className="h-16 w-16 items-center justify-center rounded-full">
                  <CookingTimeIcon
                    width={48}
                    height={48}
                    color={isSelected ? theme.primary : theme.textSecondary}
                  />
                </View>
                <View className="ml-4 flex-1 gap-0.5">
                  <Text className="font-label text-xl text-text">
                    {cookingTime.label}
                  </Text>
                  <Text className="font-label text-lg text-text-secondary">
                    {cookingTime.duration}
                  </Text>
                  <Text className="font-sans text-sm leading-5 text-text-secondary">
                    {cookingTime.description}
                  </Text>
                </View>
                {isSelected ? (
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <MaterialCommunityIcons
                      name="check"
                      size={19}
                      color="white"
                    />
                  </View>
                ) : (
                  <View className="h-8 w-8 rounded-full border border-text-secondary/60" />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="mt-auto flex-row gap-3 px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Go back to budget"
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
          accessibilityLabel="Generate meal plan"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
          onPress={onContinue}
        >
          <Text className="font-label text-lg text-white">Generate Plan</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
