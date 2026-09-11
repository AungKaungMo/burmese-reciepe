import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { ingredientSubstitutions } from "../../constants";
import type {
  IngredientSubstitution,
  RecipeIngredient,
  RecipeIngredientsProps,
} from "../../types";
import { IngredientSubstitutes } from "./ingredient-substitutes";

const minimumServings = 1;

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);

  const useSubstitute = (
    ingredient: RecipeIngredient,
    substitute: IngredientSubstitution,
  ) => {
    const switchBackOption: IngredientSubstitution = {
      name: ingredient.name,
      amount: `Use ${formatAmount(ingredient.amount)} ${ingredient.unit}`,
      description: `Switch back to ${ingredient.name.toLowerCase()}.`,
      icon: ingredient.icon,
    };

    setIngredients((currentIngredients) =>
      currentIngredients.map((currentIngredient) =>
        currentIngredient === ingredient
          ? {
              name: substitute.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              icon: substitute.icon,
              substitutions: [
                switchBackOption,
                ...ingredientSubstitutions[substitute.icon].filter(
                  (option) =>
                    option.name !== ingredient.name &&
                    option.name !== substitute.name,
                ),
              ],
            }
          : currentIngredient,
      ),
    );
  };

  return (
    <>
      <View className="overflow-hidden rounded-2xl border border-border bg-background px-3">
        <ServingsControl
          servings={servings}
          onDecrease={() =>
            setServings((current) => Math.max(minimumServings, current - 1))
          }
          onIncrease={() => setServings((current) => current + 1)}
        />

        {ingredients.map((ingredient, index) => (
          <IngredientRow
            key={`${ingredient.name}-${index}`}
            ingredient={ingredient}
            servings={servings}
            recipeServings={recipe.servings}
            isLast={index === recipe.ingredients.length - 1}
            onPress={() => setSelectedIngredient(ingredient)}
          />
        ))}
      </View>
      <IngredientSubstitutes
        ingredient={selectedIngredient}
        recipeServings={recipe.servings}
        servings={servings}
        visible={selectedIngredient !== null}
        onClose={() => setSelectedIngredient(null)}
        onUseSubstitute={useSubstitute}
      />
    </>
  );
}

function ServingsControl({
  servings,
  onDecrease,
  onIncrease,
}: {
  servings: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-2 border-b border-border py-2">
      <Text className="flex-1 font-label text-base text-text">servings</Text>
      <Pressable
        accessibilityLabel="Decrease servings"
        className="h-10 w-10 items-center justify-center rounded-full bg-background-element"
        onPress={onDecrease}
      >
        <MaterialCommunityIcons name="minus" size={22} color={theme.text} />
      </Pressable>
      <View className="h-10 min-w-[72px] items-center justify-center rounded-full bg-background-element px-4">
        <Text className="font-label text-lg text-text">{servings}</Text>
      </View>
      <Pressable
        accessibilityLabel="Increase servings"
        className="h-10 w-10 items-center justify-center rounded-full bg-primary"
        onPress={onIncrease}
      >
        <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function IngredientRow({
  ingredient,
  servings,
  recipeServings,
  isLast,
  onPress,
}: {
  ingredient: RecipeIngredient;
  servings: number;
  recipeServings: number;
  isLast: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const quantity = (ingredient.amount / recipeServings) * servings;
  const perServing = ingredient.amount / recipeServings;

  return (
    <Pressable
      accessibilityLabel={`Substitute ${ingredient.name}`}
      accessibilityRole="button"
      className="flex-row gap-3"
      onPress={onPress}
    >
      <View className="mt-2 h-12 w-12 items-center justify-center rounded-full bg-background-element">
        <MaterialCommunityIcons
          name={ingredient.icon}
          size={24}
          color={theme.primary}
        />
      </View>
      <View
        className={`min-h-16 flex-1 flex-row items-center gap-2 ${isLast ? "" : "border-b border-border"}`}
      >
        <View className="flex-1 gap-0.5 py-2">
          <Text className="font-label text-base text-text">
            {ingredient.name}
          </Text>
          <Text className="font-sans text-sm text-text-secondary">
            <Text className="font-label text-text">
              {formatAmount(quantity)} {ingredient.unit}
            </Text>{" "}
            ({formatAmount(perServing)} {ingredient.unit} per serving)
          </Text>
        </View>
        <MaterialCommunityIcons
          name="arrow-right"
          size={17}
          color={theme.primary}
        />
      </View>
    </Pressable>
  );
}

function formatAmount(amount: number) {
  return Number.isInteger(amount)
    ? String(amount)
    : String(Number(amount.toFixed(2)));
}
