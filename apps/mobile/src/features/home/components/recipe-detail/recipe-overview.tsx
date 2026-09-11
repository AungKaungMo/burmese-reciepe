import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import type { RecipeOverviewProps } from "../../types";
import { RecipeIngredients } from "./recipe-ingredients";
import { RecipeNutrition } from "./recipe-nutrition";
import { RecipeSteps } from "./recipe-steps";

export function RecipeOverview({ recipe, activeTab }: RecipeOverviewProps) {
  if (activeTab === "Ingredients") {
    return <RecipeIngredients recipe={recipe} />;
  }

  if (activeTab === "Steps") {
    return <RecipeSteps recipe={recipe} />;
  }

  if (activeTab === "Nutrition") {
    return <RecipeNutrition recipe={recipe} />;
  }

  return <OverviewContent recipe={recipe} />;
}

function OverviewContent({ recipe }: Pick<RecipeOverviewProps, "recipe">) {
  const theme = useTheme();

  return (
    <View className="gap-6">
      <View className="flex-row gap-3">
        <Stat
          icon="account-group"
          label="Serves"
          value={String(recipe.servings)}
        />
        <Stat icon="clock-outline" label="Time" value={recipe.duration} />
        <Stat icon="signal" label="Level" value={recipe.difficulty} />
      </View>

      <View className="gap-4">
        <Text className="font-heading text-2xl text-text">
          What makes this special?
        </Text>
        <View className="flex-row justify-between">
          {recipe.specialties.map((specialty) => (
            <View key={specialty.label} className="flex-1 items-center gap-2">
              <MaterialCommunityIcons
                name={specialty.icon}
                size={28}
                color={theme.primary}
              />
              <Text
                className="text-center font-label text-sm text-text-secondary"
                numberOfLines={2}
              >
                {specialty.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: "account-group" | "clock-outline" | "signal";
  label: string;
  value: string;
}) {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center gap-1.5 rounded-2xl bg-background-element px-2 py-4">
      <MaterialCommunityIcons name={icon} size={25} color={theme.primary} />
      <Text className="font-sans text-xs text-text-secondary">{label}</Text>
      <Text className="font-label text-base text-text">{value}</Text>
    </View>
  );
}
