import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import type { RecentPlansProps } from "../types";

export function RecentPlans({ plans }: RecentPlansProps) {
  const theme = useTheme();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-xl text-text">Recent Plans</Text>
        <Pressable accessibilityLabel="See all plans" accessibilityRole="button">
          <Text className="font-label text-base text-primary">See all</Text>
        </Pressable>
      </View>
      <View className="gap-2">
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            accessibilityLabel={`Open meal plan from ${plan.date}`}
            accessibilityRole="button"
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
          >
            <Image
              source={plan.image}
              className="h-16 w-16 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 gap-0.5">
              <Text className="font-label text-base text-text">
                {plan.date}
              </Text>
              <Text className="font-sans text-sm text-text-secondary">
                {plan.summary}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.textSecondary}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
