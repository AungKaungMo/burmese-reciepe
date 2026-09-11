import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/shared/hooks/use-theme";
import { debounce } from "@/shared/utils/debounce";
import { searchRecipes } from "../constants";
import type { RecipeDifficulty, SearchRecipe } from "../types";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const difficultyIcon: Record<RecipeDifficulty, IconName> = {
  Easy: "speedometer-slow",
  Medium: "speedometer-medium",
  Hard: "speedometer",
};

export function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("chicken");
  const [debouncedQuery, setDebouncedQuery] = useState("chicken");
  const [isSearching, setIsSearching] = useState(false);
  const updateDebouncedQuery = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), 350),
    [],
  );

  useEffect(() => () => updateDebouncedQuery.cancel(), [updateDebouncedQuery]);

  // Debounce the query: show a loading state while the user is still typing,
  // then commit the term ~350ms after they stop.
  useEffect(() => {
    if (query === debouncedQuery) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    updateDebouncedQuery(query);
  }, [query, debouncedQuery, updateDebouncedQuery]);

  const results = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return searchRecipes;
    return searchRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(term),
    );
  }, [debouncedQuery]);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Search field */}
        <View className="flex-row items-center gap-2 px-4 pb-3 pt-2">
          <Pressable
            className="h-10 w-9 items-center justify-center"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color={theme.text}
            />
          </Pressable>

          <View className="h-12 flex-1 flex-row items-center rounded-2xl bg-background-element px-3">
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color={theme.textSecondary}
            />
            <TextInput
              className="ml-2 flex-1 font-sans text-text"
              value={query}
              onChangeText={setQuery}
              placeholder="Search recipes, ingredients..."
              placeholderTextColor={theme.textSecondary}
              returnKeyType="search"
              autoFocus
              accessibilityLabel="Search recipes"
            />
            {query.length > 0 ? (
              <Pressable
                onPress={() => setQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={8}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {isSearching ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color={theme.primary} />
            <Text className="font-sans text-sm text-text-secondary">
              Searching…
            </Text>
          </View>
        ) : (
          <>
            {/* Results header */}
            <View className="flex-row items-center justify-between px-4 pb-2">
              <Text className="font-sans text-sm text-text-secondary">
                <Text className="font-label text-text">{results.length}</Text>{" "}
                results
                {debouncedQuery.trim() ? (
                  <Text className="font-sans text-text-secondary">
                    {" "}
                    for &ldquo;{debouncedQuery.trim()}&rdquo;
                  </Text>
                ) : null}
              </Text>

              <Pressable
                className="flex-row items-center gap-1"
                accessibilityRole="button"
                accessibilityLabel="Sort results"
              >
                <Text className="font-label text-sm text-text-secondary">
                  Most Relevant
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>

            <FlatList
              data={results}
              keyExtractor={(recipe) => recipe.id}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-3 px-4 pb-8 pt-1"
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <RecipeResultRow recipe={item} />}
              ListEmptyComponent={
                <View className="items-center gap-2 pt-16">
                  <MaterialCommunityIcons
                    name="magnify"
                    size={40}
                    color={theme.textSecondary}
                  />
                  <Text className="font-label text-base text-text">
                    No recipes found
                  </Text>
                  <Text className="font-sans text-sm text-text-secondary">
                    Try a different search term.
                  </Text>
                </View>
              }
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function RecipeResultRow({ recipe }: { recipe: SearchRecipe }) {
  const theme = useTheme();
  const router = useRouter();
  const difficultyColor =
    recipe.difficulty === "Easy"
      ? theme.success
      : recipe.difficulty === "Medium"
        ? theme.accent
        : theme.error;

  return (
    <Pressable
      className="flex-row gap-3 rounded-2xl bg-card p-2.5"
      onPress={() =>
        router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`View ${recipe.title} recipe`}
    >
      <Image
        source={recipe.image}
        className="h-20 w-20 rounded-xl"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center gap-1.5">
        <Text className="font-heading text-lg text-text" numberOfLines={1}>
          {recipe.title}
        </Text>

        <View className="flex-row items-center gap-1">
          <MaterialCommunityIcons name="star" size={16} color={theme.accent} />
          <Text className="font-label text-sm text-text">{recipe.rating}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="clock-outline"
              size={15}
              color={theme.textSecondary}
            />
            <Text className="font-sans text-sm text-text-secondary">
              {recipe.duration}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name={difficultyIcon[recipe.difficulty]}
              size={15}
              color={difficultyColor}
            />
            <Text className="font-sans text-sm text-text-secondary">
              {recipe.difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View className="items-center justify-between py-0.5">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`More options for ${recipe.title}`}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Save ${recipe.title}`}
        >
          <MaterialCommunityIcons
            name="heart-outline"
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
