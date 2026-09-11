import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { BottomDrawer } from "@/shared/components/bottom-drawer";
import { useTheme } from "@/shared/hooks/use-theme";
import { ingredientSubstitutions } from "../../constants";
import type {
  IngredientSubstitutesProps,
  IngredientSubstitution,
} from "../../types";

export function IngredientSubstitutes({
  ingredient,
  servings,
  recipeServings,
  visible,
  onClose,
  onUseSubstitute,
}: IngredientSubstitutesProps) {
  const theme = useTheme();
  const [selectedSubstitute, setSelectedSubstitute] =
    useState<IngredientSubstitution | null>(null);

  useEffect(() => {
    setSelectedSubstitute(null);
  }, [ingredient?.name]);

  if (!ingredient) return null;

  const amount = (ingredient.amount / recipeServings) * servings;
  const perServing = ingredient.amount / recipeServings;
  const name = ingredient.name.replace(/ \(.+\)/, "");
  const substitutes =
    ingredient.substitutions ?? ingredientSubstitutions[ingredient.icon];

  return (
    <BottomDrawer
      visible={visible}
      onClose={onClose}
      closeAccessibilityLabel="Close substitutions"
      showHandle
    >
      <>
        <View className="flex-row items-start gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-background-element">
            <MaterialCommunityIcons
              name={ingredient.icon}
              size={32}
              color={theme.primary}
            />
          </View>
          <View className="flex-1 pt-1">
            <Text className="font-heading text-2xl text-text">{name}</Text>
            <Text className="mt-0.5 font-sans text-base text-text-secondary">
              <Text className="font-label text-text">
                {formatAmount(amount)} {ingredient.unit}
              </Text>{" "}
              ({formatAmount(perServing)} {ingredient.unit} per serving)
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Close substitutions"
            className="-mr-1 -mt-1 h-11 w-11 items-center justify-center rounded-full"
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={28} color={theme.text} />
          </Pressable>
        </View>

        <Text className="mt-5 font-heading text-3xl text-text">
          Don&apos;t have {name.toLowerCase()}?
        </Text>
        <Text className="mt-1 font-sans text-base text-text-secondary">
          Here are some good alternatives:
        </Text>

        <ScrollView
          className="mt-4 max-h-[420px]"
          contentContainerClassName="gap-2 pb-3"
          showsVerticalScrollIndicator={false}
        >
          {substitutes.map((substitute) => {
            const isSelected = selectedSubstitute?.name === substitute.name;

            return (
              <Pressable
                key={substitute.name}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                className={`flex-row items-center gap-3 rounded-2xl border p-3 ${
                  isSelected
                    ? "border-primary bg-background-selected"
                    : "border-border bg-background-element"
                }`}
                onPress={() => setSelectedSubstitute(substitute)}
              >
                <View className="h-14 w-14 items-center justify-center rounded-full bg-background">
                  <MaterialCommunityIcons
                    name={substitute.icon}
                    size={27}
                    color={theme.primary}
                  />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-label text-base text-text">
                    {substitute.name}
                  </Text>
                  <Text className="font-label text-sm text-text-secondary">
                    {substitute.amount}
                  </Text>
                  <Text className="font-sans text-sm leading-5 text-text-secondary">
                    {substitute.description}
                  </Text>
                </View>
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-primary" : "border-text-secondary"
                  }`}
                >
                  {isSelected ? (
                    <View className="h-3.5 w-3.5 rounded-full bg-primary" />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: selectedSubstitute === null }}
          className={`mb-5 mt-4 items-center rounded-3xl bg-primary py-4 ${
            selectedSubstitute ? "" : "opacity-50"
          }`}
          disabled={selectedSubstitute === null}
          onPress={() => {
            if (!selectedSubstitute) return;

            onUseSubstitute(ingredient, selectedSubstitute);
            onClose();
          }}
        >
          <Text className="font-label text-lg text-white">
            Use This Instead
          </Text>
        </Pressable>
      </>
    </BottomDrawer>
  );
}

function formatAmount(amount: number) {
  return Number.isInteger(amount)
    ? String(amount)
    : String(Number(amount.toFixed(2)));
}
