import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { recommendedRecipes } from "../constants";

export function RecommendedForYou() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-2xl leading-8 text-text">
          Recommended for You
        </Text>
        <Pressable
          className="flex-row items-center gap-0.5"
          accessibilityRole="button"
          accessibilityLabel="See all recommended recipes"
        >
          <Text className="font-label text-base text-primary">See all</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.primary}
          />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {recommendedRecipes.map((recipe) => (
            <Pressable
              key={recipe.title}
              className="w-44 overflow-hidden rounded-2xl bg-card"
              onPress={() =>
                router.push({
                  pathname: "/recipe/[id]",
                  params: { id: recipe.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`View ${recipe.title} recipe`}
            >
              <View className="relative h-28">
                <Image
                  source={recipe.image}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-card">
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={20}
                    color={theme.primary}
                  />
                </View>
              </View>

              <View className="gap-1.5 p-2.5">
                <Text
                  className="font-heading text-lg text-text"
                  numberOfLines={1}
                >
                  {recipe.title}
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color={theme.accent}
                    />
                    <Text className="font-label text-sm text-text">
                      {recipe.rating}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={theme.textSecondary}
                    />
                    <Text className="font-sans text-sm text-text-secondary">
                      {recipe.duration}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
