import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";

import type { RecipeHeroProps } from "../../types";
import { RecipeImageViewer } from "./recipe-image-viewer";

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const router = useRouter();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  return (
    <View className="relative h-[355px]">
      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel={`View ${recipe.title} image`}
        className="h-full w-full"
        onPress={() => setIsImageViewerOpen(true)}
      >
        <Image
          source={recipe.image}
          className="h-full w-full"
          resizeMode="cover"
        />
      </Pressable>
      <View className="absolute left-5 right-5 top-14 flex-row items-center justify-between">
        <Pressable
          className="h-12 w-12 items-center justify-center rounded-full bg-black/55"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </Pressable>

        <View className="flex-row gap-3">
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-full bg-black/55"
            accessibilityRole="button"
            accessibilityLabel={`Save ${recipe.title}`}
          >
            <MaterialCommunityIcons name="heart" size={24} color="white" />
          </Pressable>
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-full bg-black/55"
            accessibilityRole="button"
            accessibilityLabel={`Share ${recipe.title}`}
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={24}
              color="white"
            />
          </Pressable>
        </View>
      </View>
      <RecipeImageViewer
        image={recipe.image}
        title={recipe.title}
        visible={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </View>
  );
}
