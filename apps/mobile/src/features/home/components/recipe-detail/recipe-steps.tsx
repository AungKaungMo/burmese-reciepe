import { Text, View } from "react-native";

import type { RecipeStepsProps } from "../../types";

export function RecipeSteps({ recipe }: RecipeStepsProps) {
  return (
    <View>
      {recipe.steps.map((step, index) => {
        const isLast = index === recipe.steps.length - 1;

        return (
          <View key={step.title + index} className="flex-row gap-3">
            <View className="w-10 items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Text className="font-heading text-xl text-white">
                  {index + 1}
                </Text>
              </View>
              {!isLast ? <View className="w-0.5 flex-1 bg-primary/60" /> : null}
            </View>
            <View className={`flex-1 ${isLast ? "pb-1" : "pb-7"}`}>
              <View className="flex-row items-baseline justify-between gap-3">
                <Text className="flex-1 font-label text-lg text-text">
                  {step.title}
                </Text>
                <Text className="font-label text-base text-text-secondary">
                  {step.duration}
                </Text>
              </View>
              <Text className="mt-2 font-sans text-base leading-6 text-text-secondary">
                {step.instruction}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
