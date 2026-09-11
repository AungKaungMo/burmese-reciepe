import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import type { RecipeRecommendationsProps } from "../../types";

export function RecipeRecommendations({ recipes }: RecipeRecommendationsProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-2xl text-text">
          You might also like
        </Text>
        <Pressable className="flex-row items-center" accessibilityRole="button">
          <Text className="font-label text-base text-primary">See all</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.primary}
          />
        </Pressable>
      </View>
      <View className="flex-row gap-3">
        {recipes.map((recipe) => (
          <Pressable
            key={recipe.id}
            className="flex-1 gap-1.5"
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: recipe.id },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`View ${recipe.title} recipe`}
          >
            <Image
              source={recipe.image}
              className="h-24 w-full rounded-2xl"
              resizeMode="cover"
            />
            <Text className="font-label text-sm text-text" numberOfLines={1}>
              {recipe.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="star"
                size={15}
                color={theme.accent}
              />
              <Text className="font-label text-sm text-text">
                {recipe.rating}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
