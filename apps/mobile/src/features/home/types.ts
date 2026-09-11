import type { ImageSourcePropType } from "react-native";

export type MealFilter = "All" | "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export type DietaryOption =
  | "No preference"
  | "Vegetarian"
  | "Vegan"
  | "Pescatarian"
  | "Halal"
  | "Low-carb"
  | "Gluten-free";

export type CookingTime =
  "Any" | "< 15 mins" | "15 – 30 mins" | "30 – 60 mins" | "> 60 mins";

export type DifficultyLevel = "Any" | "Easy" | "Medium" | "Hard";
export type RecipeDifficulty = Exclude<DifficultyLevel, "Any">;

export type Cuisine =
  | "Burmese"
  | "Asian"
  | "Western"
  | "Thai"
  | "Indian"
  | "Chinese"
  | "Japanese"
  | "Korean"
  | "Mediterranean"
  | "Others";

export type RecipeCard = {
  id: string;
  title: string;
  rating: string;
  duration: string;
  image: ImageSourcePropType;
};

export type PopularRecipe = RecipeCard & {
  difficulty: RecipeDifficulty;
  trending?: boolean;
};

export type SearchRecipe = RecipeCard & {
  difficulty: RecipeDifficulty;
};

export type RecipeDetail = RecipeCard & {
  difficulty: RecipeDifficulty;
  tags: readonly string[];
  description: string;
  servings: number;
  specialties: readonly RecipeSpecialty[];
  ingredients: readonly RecipeIngredient[];
  steps: readonly RecipeStep[];
  nutrition: readonly NutritionFact[];
  goodToKnow: readonly NutritionHighlight[];
  allergens: RecipeAllergens;
  storage: string;
};

export type IngredientIcon =
  | "food-drumstick"
  | "food-apple"
  | "carrot"
  | "food"
  | "leaf"
  | "oil"
  | "bowl-mix"
  | "chili-hot"
  | "bottle-tonic"
  | "shaker-outline"
  | "cup-water"
  | "fruit-citrus"
  | "egg";

export type RecipeIngredient = {
  name: string;
  amount: number;
  unit: string;
  icon: IngredientIcon;
  substitutions?: readonly IngredientSubstitution[];
};

export type IngredientSubstitution = {
  name: string;
  amount: string;
  description: string;
  icon: IngredientIcon;
};

export type RecipeStep = {
  title: string;
  duration: string;
  instruction: string;
};

export type RecipeSpecialty = {
  label: string;
  icon: "fire" | "account-group" | "silverware-fork-knife";
};

export type NutritionFact = {
  label: string;
  value: string;
  unit: string;
  icon: "fire" | "sprout" | "barley" | "water-outline";
};

export type NutritionHighlight = {
  label: string;
  icon: "briefcase-outline" | "shield-check" | "bowl-mix" | "chili-hot";
};

export type RecipeAllergens = {
  title: string;
  description: string;
};

export type RecipeDetailTab =
  "Overview" | "Ingredients" | "Steps" | "Nutrition";

export type RecipeHeroProps = {
  recipe: RecipeDetail;
};

export type RecipeImageViewerProps = {
  image: ImageSourcePropType;
  title: string;
  visible: boolean;
  onClose: () => void;
};

export type RecipeSummaryProps = {
  recipe: RecipeDetail;
};

export type RecipeOverviewProps = {
  recipe: RecipeDetail;
  activeTab: RecipeDetailTab;
};

export type RecipeIngredientsProps = Pick<RecipeOverviewProps, "recipe">;

export type RecipeStepsProps = Pick<RecipeOverviewProps, "recipe">;

export type RecipeNutritionProps = Pick<RecipeOverviewProps, "recipe">;

export type IngredientSubstitutesProps = {
  ingredient: RecipeIngredient | null;
  servings: number;
  recipeServings: number;
  visible: boolean;
  onClose: () => void;
  onUseSubstitute: (
    ingredient: RecipeIngredient,
    substitute: IngredientSubstitution,
  ) => void;
};

export type RecipeRecommendationsProps = {
  recipes: readonly RecipeCard[];
};

export type RecipeTabsProps = {
  activeTab: RecipeDetailTab;
  onChange: (tab: RecipeDetailTab) => void;
};

export type FilterDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export type FilterChoiceGroupProps<T extends string> = {
  title?: string;
  options: readonly T[];
  selected: T | undefined;
  onSelect: (value: T) => void;
  equalWidth?: boolean;
  horizontalPadding?: "px-3" | "px-4";
  hideTitle?: boolean;
};
