import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GlutenFree from "../../../assets/icons/GlutenFree";
import Halal from "../../../assets/icons/Halal";
import LowCarb from "../../../assets/icons/LowCarb";
import NoPreference from "../../../assets/icons/NoPreference";
import Pescatarian from "../../../assets/icons/Pescatarian";
import Vegan from "../../../assets/icons/Vegan";
import Vegetarian from "../../../assets/icons/Vegetarian";
import { useTheme } from "@/shared/hooks/use-theme";
import { dietaryPreferenceOptions } from "../constants";
import type { MealPlanDietaryStepProps } from "../types";
import { MealPlanProgress } from "./meal-plan-progress";

const dietaryIcon = {
  "no-preference": NoPreference,
  vegetarian: Vegetarian,
  vegan: Vegan,
  halal: Halal,
  pescatarian: Pescatarian,
  "low-carb": LowCarb,
  "gluten-free": GlutenFree,
  other: null,
} as const;

export function MealPlanDietaryStep({
  selectedPreference,
  progressFromStep,
  onBack,
  onSelectPreference,
  onContinue,
}: MealPlanDietaryStepProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to serving size"
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
        <MealPlanProgress step={3} fromStep={progressFromStep} />

        <Text className="font-heading text-3xl leading-10 text-text">
          Any dietary preferences?
        </Text>
        <Text className="mt-2 font-sans text-base leading-5 text-text-secondary">
          We&apos;ll only show recipes that match your needs.
        </Text>

        <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
          {dietaryPreferenceOptions.map((preference) => {
            const isSelected = selectedPreference === preference.id;
            const DietaryIcon = dietaryIcon[preference.id];
            const iconColor =
              preference.color === "success"
                ? theme.success
                : preference.color === "accent"
                  ? theme.accent
                  : preference.color === "primary"
                    ? theme.primary
                    : theme.text;

            return (
              <Pressable
                key={preference.id}
                accessibilityLabel={`Choose ${preference.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`h-28 w-[48%] items-center justify-center gap-2 rounded-2xl border ${
                  isSelected
                    ? "border-2 border-primary bg-active-tab-background"
                    : "border-border"
                }`}
                onPress={() => onSelectPreference(preference.id)}
              >
                {DietaryIcon ? (
                  <DietaryIcon width={34} height={34} color={iconColor} />
                ) : (
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={34}
                    color={iconColor}
                  />
                )}
                <Text className="font-label text-base text-text">
                  {preference.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-auto flex-row gap-3 px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Go back to serving size"
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
