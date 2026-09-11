import { Text, View } from "react-native";

import type { RecipeSummaryProps } from "../../types";

export function RecipeSummary({ recipe }: RecipeSummaryProps) {
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {recipe.tags.map((tag, index) => (
          <View
            key={tag}
            className={`rounded-full px-3 py-1.5 ${
              index === 0
                ? "bg-primary"
                : index === recipe.tags.length - 1
                  ? "bg-success/20"
                  : "bg-background-selected"
            }`}
          >
            <Text
              className={`font-label text-sm ${
                index === 0 ? "text-white" : "text-text"
              }`}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
      <Text className="font-heading text-[36px] leading-[42px] text-text">
        {recipe.title}
      </Text>
      <Text className="font-sans text-base leading-6 text-text-secondary">
        {recipe.description}
      </Text>
    </View>
  );
}
