import type { ImageSourcePropType } from "react-native";

export type MealPlanPeriod = "Daily" | "Weekly";

export type MealPlanGoal =
  | "balanced"
  | "healthy"
  | "lose-weight"
  | "gain-weight"
  | "high-protein"
  | "other";

export type MealPlanGoalOption = {
  id: MealPlanGoal;
  label: string;
  icon:
    | "scale-balance"
    | "leaf"
    | "fire"
    | "dumbbell"
    | "arm-flex"
    | "dots-horizontal";
  color: "primary" | "success";
};

export type RecentMealPlan = {
  id: string;
  date: string;
  summary: string;
  image: ImageSourcePropType;
  badge?: string;
};

export type MealPlanToggleProps = {
  selectedPeriod: MealPlanPeriod;
  onChange: (period: MealPlanPeriod) => void;
};

export type PlanCreatorProps = {
  onCreate: () => void;
};

export type MealPlanGoalStepProps = {
  selectedGoal: MealPlanGoal;
  progressFromStep?: number;
  onClose: () => void;
  onSelectGoal: (goal: MealPlanGoal) => void;
  onContinue: () => void;
};

export type MealPlanPeopleStepProps = {
  people: number;
  progressFromStep?: number;
  onBack: () => void;
  onChangePeople: (people: number) => void;
  onContinue: () => void;
};

export type MealPlanDietaryPreference =
  | "no-preference"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "pescatarian"
  | "low-carb"
  | "gluten-free"
  | "other";

export type MealPlanDietaryStepProps = {
  selectedPreference: MealPlanDietaryPreference;
  progressFromStep?: number;
  onBack: () => void;
  onSelectPreference: (preference: MealPlanDietaryPreference) => void;
  onContinue: () => void;
};

export type MealPlanAvoidIngredientsStepProps = {
  searchTerm: string;
  selectedIngredients: readonly string[];
  progressFromStep?: number;
  onBack: () => void;
  onChangeSearchTerm: (searchTerm: string) => void;
  onToggleIngredient: (ingredient: string) => void;
  onContinue: () => void;
};

export type MealPlanBudget = "budget" | "normal" | "flexible" | "dont-mind";

export type MealPlanBudgetStepProps = {
  selectedBudget: MealPlanBudget;
  progressFromStep?: number;
  onBack: () => void;
  onSelectBudget: (budget: MealPlanBudget) => void;
  onContinue: () => void;
};

export type MealPlanCookingTime = "quick" | "normal" | "dont-mind";

export type MealPlanCookingTimeStepProps = {
  selectedCookingTime: MealPlanCookingTime;
  progressFromStep?: number;
  onBack: () => void;
  onSelectCookingTime: (cookingTime: MealPlanCookingTime) => void;
  onContinue: () => void;
};

export type MealPlanMealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export type GeneratedMealPlanMeal = {
  id: string;
  mealType: MealPlanMealType;
  title: string;
  duration: string;
  calories: string;
  image: ImageSourcePropType;
};

export type MealReplacementRecipe = {
  id: string;
  title: string;
  duration: string;
  calories: string;
  image: ImageSourcePropType;
  categories: readonly string[];
  badge?: string;
};

export type MealPlanRecipeSelection = Pick<
  GeneratedMealPlanMeal,
  "title" | "duration" | "calories" | "image"
>;

export type MealPlanEditMealDetail = {
  time: string;
  description: string;
  tags: readonly {
    label: string;
    tone: "primary" | "success" | "neutral";
  }[];
};

export type MealReplacementProps = {
  meal: GeneratedMealPlanMeal;
  onClose: () => void;
  onSelectRecipe: (recipe: MealPlanRecipeSelection) => void;
};

export type MealPlanAiLoadingProps = {
  mealType: MealPlanMealType;
  onClose: () => void;
  onComplete: () => void;
};

export type MealPlanAiSuggestion = {
  id: string;
  title: string;
  duration: string;
  calories: string;
  description: string;
  image: ImageSourcePropType;
  tags: readonly {
    label: string;
    tone: "primary" | "success" | "info" | "neutral";
  }[];
};

export type MealPlanAiSuggestionsProps = {
  meal: GeneratedMealPlanMeal;
  onClose: () => void;
  onSelectRecipe: (recipe: MealPlanRecipeSelection) => void;
};

export type MealPlanResultProps = {
  meals: readonly GeneratedMealPlanMeal[];
  onSavePlan: () => void;
  onGoHome: () => void;
};

export type RecentPlansProps = {
  plans: readonly RecentMealPlan[];
};
