import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/use-theme";
import type { MealPlanAiLoadingProps } from "../types";

const analysisSteps = [
  "Analyzing your preferences",
  "Finding suitable recipes",
  "Matching with your goals",
  "Preparing recommendations",
] as const;

const STEP_DURATION = 1400;

type StepStatus = "pending" | "loading" | "complete";

export function MealPlanAiLoading({
  mealType,
  onComplete,
}: MealPlanAiLoadingProps) {
  const theme = useTheme();
  const mealLabel = mealType === "Snacks" ? "snack" : mealType.toLowerCase();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (completedCount >= analysisSteps.length) {
      const finishTimer = setTimeout(onComplete, 400);

      return () => clearTimeout(finishTimer);
    }

    const stepTimer = setTimeout(
      () => setCompletedCount((count) => count + 1),
      STEP_DURATION,
    );

    return () => clearTimeout(stepTimer);
  }, [completedCount, onComplete]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-1 px-10 pt-12">
        <Image
          source={require("../../../assets/images/plan/ai-cooking.png")}
          className="h-52 w-full self-center"
          resizeMode="contain"
        />

        <View className="mt-8 items-center gap-3">
          <Text className="text-center font-heading text-3xl leading-10 text-text">
            Finding the best {mealLabel}{"\n"}options for you...
          </Text>
          <Text className="text-center font-sans text-lg leading-7 text-text-secondary">
            Based on your goals, preferences{"\n"}and ingredients.
          </Text>
        </View>

        <View className="mt-10 gap-5">
          {analysisSteps.map((step, index) => {
            const status: StepStatus =
              index < completedCount
                ? "complete"
                : index === completedCount
                  ? "loading"
                  : "pending";

            return <ProgressItem key={step} label={step} status={status} />;
          })}
        </View>

        <View className="mt-auto mb-10 flex-row items-start gap-3 rounded-2xl bg-background-element px-5 py-5">
          <MaterialCommunityIcons name="lightbulb-on-outline" size={34} color={theme.accent} />
          <View className="flex-1 gap-1">
            <Text className="font-label text-base text-text">Did you know?</Text>
            <Text className="font-sans text-sm leading-5 text-text-secondary">
              Our AI considers your calorie goal, cooking time, available ingredients, and your past favorites.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProgressItem({ label, status }: { label: string; status: StepStatus }) {
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-4">
      {status === "complete" ? (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
          <MaterialCommunityIcons name="check" size={19} color="white" />
        </View>
      ) : status === "loading" ? (
        <CircularSpinner size={28} color={theme.primary} />
      ) : (
        <View className="h-8 w-8 rounded-full border-2 border-border" />
      )}
      <Text
        className={`font-sans text-lg ${
          status === "pending" ? "text-text-secondary" : "text-text"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

function CircularSpinner({ size, color }: { size: number; color: string }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => loop.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: color,
        borderTopColor: "transparent",
        transform: [{ rotate: spin }],
      }}
    />
  );
}
