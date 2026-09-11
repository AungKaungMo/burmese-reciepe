import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import type { MealPlanPeriod, MealPlanToggleProps } from "../types";

const periods: readonly MealPlanPeriod[] = ["Daily", "Weekly"];

export function MealPlanToggle({
  selectedPeriod,
  onChange,
}: MealPlanToggleProps) {
  const theme = useTheme();

  return (
    <View className="flex-row self-start rounded-full bg-background-element p-1">
      {periods.map((period) => {
        const selected = period === selectedPeriod;

        return (
          <Pressable
            key={period}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`py-4 w-6/12 flex-row items-center justify-center gap-1 rounded-full px-4 ${
              selected ? "bg-primary" : ""
            }`}
            onPress={() => onChange(period)}
          >
            <Text
              className={`font-label ${
                selected ? "text-white" : "text-text-secondary"
              }`}
            >
              {period}
            </Text>
            {period === "Weekly" ? (
              <MaterialCommunityIcons name="crown" size={16} color={theme.accent} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
