import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import type { RecipeNutritionProps } from "../../types";

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const theme = useTheme();

  return (
    <View className="gap-9">
      <View>
        <Text className="font-heading text-2xl text-text">
          Nutrition (per serving)
        </Text>
        <View className="mt-5 flex-row justify-between">
          {recipe.nutrition.map((fact) => (
            <View key={fact.label} className="flex-1 items-center gap-1.5">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-background-element">
                <MaterialCommunityIcons
                  name={fact.icon}
                  size={30}
                  color={nutritionIconColor(fact.label, theme)}
                />
              </View>
              <Text className="font-label text-xl text-text">{fact.value}</Text>
              <Text className="font-sans text-sm text-text-secondary">
                {fact.unit || fact.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <NutritionSection title="Good to know">
        {recipe.goodToKnow.map((item) => (
          <View key={item.label} className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-background-element">
              <MaterialCommunityIcons
                name={item.icon}
                size={21}
                color={theme.primary}
              />
            </View>
            <Text className="flex-1 font-label text-base text-text">
              {item.label}
            </Text>
          </View>
        ))}
      </NutritionSection>

      <NutritionSection title="Allergens">
        <View className="flex-row gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-background-element">
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={22}
              color={theme.primary}
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="font-label text-lg text-text">
              {recipe.allergens.title}
            </Text>
            <Text className="font-sans text-base leading-6 text-text-secondary">
              {recipe.allergens.description}
            </Text>
          </View>
        </View>
      </NutritionSection>

      <NutritionSection title="Storage">
        <View className="flex-row gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-background-element">
            <MaterialCommunityIcons
              name="archive-outline"
              size={22}
              color={theme.primary}
            />
          </View>
          <Text className="flex-1 pt-1 font-sans text-base leading-6 text-text-secondary">
            {recipe.storage}
          </Text>
        </View>
      </NutritionSection>
    </View>
  );
}

function NutritionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-4">
      <Text className="font-heading text-2xl text-text">{title}</Text>
      <View className="gap-3">{children}</View>
    </View>
  );
}

function nutritionIconColor(label: string, theme: ReturnType<typeof useTheme>) {
  if (label === "Protein") return theme.success;
  if (label === "Carbs") return theme.accent;
  return theme.primary;
}
