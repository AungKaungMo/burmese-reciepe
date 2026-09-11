import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import type { PlanCreatorProps } from "../types";

export function PlanCreator({ onCreate }: PlanCreatorProps) {
  return (
    <View className=" overflow-hidden rounded-3xl bg-primary-soft">
      <Image
        source={require("../../../assets/images/plan/plan.png")}
        resizeMode="cover"
        className="absolute right-0 top-0 h-full w-4/5"
      />
      <View className="flex-1 justify-between p-5">
        <View className="w-1/2 gap-2">
          <Text className="font-heading  text-3xl leading-9 text-text">
            Create{"\n"}today&apos;s plan
          </Text>
          <Text className="font-sans text-sm leading-5 text-text">
            Personalized meal ideas for your goals.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create today's plan"
          className="flex-row items-center mt-3 gap-2 self-start rounded-full bg-primary px-5 py-3"
          onPress={onCreate}
        >
          <Text className="font-label text-base text-white">Create Plan</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color='white' />
        </Pressable>
      </View>
    </View>
  );
}
