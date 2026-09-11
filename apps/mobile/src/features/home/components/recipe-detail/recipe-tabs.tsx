import { Pressable, Text, View } from "react-native";

import type { RecipeDetailTab, RecipeTabsProps } from "../../types";

const recipeTabs: readonly RecipeDetailTab[] = [
  "Overview",
  "Ingredients",
  "Steps",
  "Nutrition",
];

export function RecipeTabs({ activeTab, onChange }: RecipeTabsProps) {
  return (
    <View className="flex-row border-b border-border">
      {recipeTabs.map((tab) => {
        const selected = tab === activeTab;

        return (
          <Pressable
            key={tab}
            className={`flex-1 items-center border-b-2 pb-3 ${
              selected ? "border-primary" : "border-transparent"
            }`}
            onPress={() => onChange(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text
              className={`font-label text-[13px] ${
                selected ? "text-primary" : "text-text-secondary"
              }`}
              numberOfLines={1}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
