import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { popularRecipes } from "../constants";

export function PopularThisWeek() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-heading text-2xl leading-8 text-text">
          Popular This Week
        </Text>
        <Pressable
          className="flex-row items-center gap-0.5"
          accessibilityRole="button"
          accessibilityLabel="See all popular recipes"
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
        <View className="flex-row gap-4">
          {popularRecipes.map((recipe) => (
            <Pressable
              key={recipe.title}
              className="w-64 overflow-hidden rounded-3xl bg-card"
              onPress={() =>
                router.push({
                  pathname: "/recipe/[id]",
                  params: { id: recipe.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`View ${recipe.title} recipe`}
            >
              <View className="relative h-48">
                <Image
                  source={recipe.image}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-card">
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={22}
                    color={theme.textSecondary}
                  />
                </View>
                {recipe.trending ? (
                  <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-full bg-card px-2.5 py-1.5">
                    <MaterialCommunityIcons
                      name="fire"
                      size={20}
                      color={theme.primary}
                    />
                    <Text className="font-label text-sm text-text">
                      Trending
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className="gap-2 p-3">
                <Text className="font-heading text-xl text-text">
                  {recipe.title}
                </Text>
                <View className="flex-row items-center justify-between gap-2">
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="star"
                      size={18}
                      color={theme.accent}
                    />
                    <Text className="font-label text-sm text-text">
                      {recipe.rating}
                    </Text>
                    {/* <Text className="font-sans text-sm text-text-secondary">
                      ({recipe.reviews})
                    </Text> */}
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={17}
                      color={theme.textSecondary}
                    />
                    <Text className="font-sans text-sm text-text-secondary">
                      {recipe.duration}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="leaf"
                      size={17}
                      color={theme.success}
                    />
                    <Text className="font-sans text-sm text-text-secondary">
                      {recipe.difficulty}
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
