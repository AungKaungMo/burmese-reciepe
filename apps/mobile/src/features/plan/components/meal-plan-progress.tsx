import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type MealPlanProgressProps = {
  step: number;
  fromStep?: number;
  totalSteps?: number;
};

export function MealPlanProgress({
  step,
  fromStep = step,
  totalSteps = 6,
}: MealPlanProgressProps) {
  const startingProgress = Math.max(0, fromStep / totalSteps);
  const progress = useRef(new Animated.Value(startingProgress)).current;

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(startingProgress);
    Animated.timing(progress, {
      toValue: step / totalSteps,
      duration: 360,
      useNativeDriver: false,
    }).start();
  }, [progress, startingProgress, step, totalSteps]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="mb-10 flex-row items-center gap-3">
      <View className="h-2 flex-1 overflow-hidden rounded-full bg-background-element">
        <Animated.View
          className="h-full rounded-full bg-primary"
          style={{ width }}
        />
      </View>
      <Text className="font-label text-sm text-text-secondary">
        {step}/{totalSteps}
      </Text>
    </View>
  );
}
