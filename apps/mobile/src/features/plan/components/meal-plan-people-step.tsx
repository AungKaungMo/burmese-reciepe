import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/use-theme";
import { servingSizeOptions } from "../constants";
import type { MealPlanPeopleStepProps } from "../types";
import { MealPlanProgress } from "./meal-plan-progress";

export function MealPlanPeopleStep({
  people,
  progressFromStep,
  onBack,
  onChangePeople,
  onContinue,
}: MealPlanPeopleStepProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back to meal plan goals"
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
        <MealPlanProgress step={2} fromStep={progressFromStep} />

        <Text className="font-heading text-3xl leading-10 text-text">
          How many people are you cooking for?
        </Text>
        <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
          Adjust the serving size for your household.
        </Text>

        <View className="mt-10 flex-row items-center justify-center gap-8">
          <Pressable
            accessibilityLabel="Decrease number of people"
            accessibilityRole="button"
            accessibilityState={{ disabled: people === 1 }}
            className="h-16 w-16 items-center justify-center rounded-full bg-background-element"
            disabled={people === 1}
            onPress={() => onChangePeople(Math.max(1, people - 1))}
          >
            <MaterialCommunityIcons
              name="minus"
              size={31}
              color={people === 1 ? theme.textDisabled : theme.text}
            />
          </Pressable>
          <Text className="w-12 text-center font-heading text-4xl text-text">
            {people}
          </Text>
          <Pressable
            accessibilityLabel="Increase number of people"
            accessibilityRole="button"
            className="h-16 w-16 items-center justify-center rounded-full bg-primary"
            onPress={() => onChangePeople(people + 1)}
          >
            <MaterialCommunityIcons name="plus" size={34} color="white" />
          </Pressable>
        </View>

        <View className="mt-12 flex-row justify-between">
          {servingSizeOptions.map((option) => {
            const isSelected =
              option.value === 5
                ? people >= option.value
                : people === option.value;

            return (
              <Pressable
                key={option.label}
                accessibilityLabel={`Choose ${option.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className="w-[23%] items-center gap-3"
                onPress={() => onChangePeople(option.value)}
              >
                <View
                  className={`h-16 w-16 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-2 border-primary bg-card"
                      : "border-transparent bg-background-element"
                  }`}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={34}
                    color={isSelected ? theme.primary : theme.textSecondary}
                  />
                </View>
                <Text
                  className={`text-center font-label text-sm ${
                    isSelected ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-auto flex-row gap-3 px-6 pb-6 pt-5">
        <Pressable
          accessibilityLabel="Go back to meal plan goals"
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
