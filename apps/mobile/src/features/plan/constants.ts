import type {
  GeneratedMealPlanMeal,
  MealPlanDietaryPreference,
  MealPlanAiSuggestion,
  MealPlanEditMealDetail,
  MealPlanGoalOption,
  MealPlanMealType,
  MealReplacementRecipe,
  RecentMealPlan,
} from "./types";

export const mealPlanGoals: readonly MealPlanGoalOption[] = [
  {
    id: "balanced",
    label: "Balanced",
    icon: "scale-balance",
    color: "primary",
  },
  { id: "healthy", label: "Healthy", icon: "leaf", color: "success" },
  { id: "lose-weight", label: "Lose weight", icon: "fire", color: "primary" },
  {
    id: "gain-weight",
    label: "Gain weight",
    icon: "dumbbell",
    color: "primary",
  },
  {
    id: "high-protein",
    label: "High protein",
    icon: "arm-flex",
    color: "primary",
  },
  { id: "other", label: "Other", icon: "dots-horizontal", color: "primary" },
];

export const servingSizeOptions = [
  { value: 1, label: "Just me", icon: "account" },
  { value: 2, label: "2 people", icon: "account-group" },
  { value: 4, label: "3–4 people", icon: "account-group" },
  { value: 5, label: "5+ people", icon: "account-group" },
] as const;

export const dietaryPreferenceOptions: readonly {
  id: MealPlanDietaryPreference;
  label: string;
  color: "primary" | "success" | "text" | "accent";
}[] = [
  {
    id: "no-preference",
    label: "No preference",
    color: "primary",
  },
  { id: "vegetarian", label: "Vegetarian", color: "success" },
  { id: "vegan", label: "Vegan", color: "success" },
  {
    id: "halal",
    label: "Halal",
    color: "text",
  },
  { id: "pescatarian", label: "Pescatarian", color: "accent" },
  { id: "low-carb", label: "Low-carb", color: "text" },
  {
    id: "gluten-free",
    label: "Gluten-free",
    color: "text",
  },
  { id: "other", label: "Other", color: "text" },
];

export const avoidIngredientOptions = [
  "Shellfish",
  "Nuts",
  "Dairy",
  "Eggs",
  "Soy",
  "Gluten",
  "Pork",
  "Beef",
  "Fish",
  "Onion",
  "Garlic",
  "Mushroom",
] as const;

export const mealPlanBudgetOptions: readonly {
  id: "budget" | "normal" | "flexible" | "dont-mind";
  label: string;
  description: string;
}[] = [
  {
    id: "budget",
    label: "Budget",
    description: "Simple &\naffordable",
  },
  {
    id: "normal",
    label: "Normal",
    description: "Balanced\nvariety",
  },
  {
    id: "flexible",
    label: "Flexible",
    description: "No limit",
  },
  {
    id: "dont-mind",
    label: "Don’t mind",
    description: "Any range\nis fine",
  },
];

export const mealPlanCookingTimeOptions: readonly {
  id: "quick" | "normal" | "dont-mind";
  label: string;
  duration: string;
  description: string;
}[] = [
  {
    id: "quick",
    label: "Quick",
    duration: "≤ 30 mins",
    description: "Simple meals for busy days.",
  },
  {
    id: "normal",
    label: "Normal",
    duration: "30 – 60 mins",
    description: "Balanced and varied recipes.",
  },
  {
    id: "dont-mind",
    label: "Don’t mind",
    duration: "Any time",
    description: "I’m flexible with cooking time.",
  },
];

export const generatedMealPlan: readonly GeneratedMealPlanMeal[] = [
  {
    id: "breakfast-oatmeal",
    mealType: "Breakfast",
    title: "Banana Oatmeal Bowl",
    duration: "10 mins",
    calories: "320 kcal",
    image: require("../home/assets/avocado-toast.png"),
  },
  {
    id: "lunch-chicken-salad",
    mealType: "Lunch",
    title: "Grilled Chicken Salad",
    duration: "25 mins",
    calories: "520 kcal",
    image: require("../home/assets/shan-noodles.png"),
  },
  {
    id: "dinner-chicken-curry",
    mealType: "Dinner",
    title: "Chicken Curry",
    duration: "35 mins",
    calories: "480 kcal",
    image: require("../home/assets/chicken-curry.png"),
  },
  {
    id: "snack-fruit-yogurt",
    mealType: "Snacks",
    title: "Fruit & Yogurt",
    duration: "5 mins",
    calories: "180 kcal",
    image: require("../home/assets/tom-yum-soup.png"),
  },
];

export const mealPlanEditDetails: Record<
  MealPlanMealType,
  MealPlanEditMealDetail
> = {
  Breakfast: {
    time: "7:00 AM",
    description: "A healthy and filling breakfast to start your day.",
    tags: [
      { label: "Vegetarian", tone: "success" },
      { label: "High Fiber", tone: "neutral" },
    ],
  },
  Lunch: {
    time: "12:30 PM",
    description: "Fresh, light and packed with nutrients.",
    tags: [
      { label: "High Protein", tone: "primary" },
      { label: "Low Carb", tone: "neutral" },
    ],
  },
  Dinner: {
    time: "7:00 PM",
    description: "A comforting and flavorful classic.",
    tags: [
      { label: "High Protein", tone: "primary" },
      { label: "Gluten Free", tone: "neutral" },
    ],
  },
  Snacks: {
    time: "4:00 PM",
    description: "A quick and refreshing snack to keep you going.",
    tags: [
      { label: "Vegetarian", tone: "success" },
      { label: "Low Sugar", tone: "neutral" },
    ],
  },
};

export const replacementFilters = [
  "Popular",
  "High Protein",
  "Low Carb",
  "Vegetarian",
  "Quick",
] as const;

export const replacementRecipes: readonly MealReplacementRecipe[] = [
  {
    id: "grilled-salmon",
    title: "Grilled Salmon",
    duration: "20 mins",
    calories: "420 kcal",
    image: require("../home/assets/avocado-toast.png"),
    categories: ["Popular", "High Protein", "Quick"],
  },
  {
    id: "beef-stir-fry",
    title: "Beef Stir Fry",
    duration: "25 mins",
    calories: "450 kcal",
    image: require("../home/assets/shan-noodles.png"),
    categories: ["Popular", "High Protein"],
  },
  {
    id: "tofu-vegetable-curry",
    title: "Tofu Vegetable Curry",
    duration: "30 mins",
    calories: "380 kcal",
    image: require("../home/assets/chicken-curry.png"),
    categories: ["Popular", "Vegetarian", "Low Carb"],
    badge: "Vegetarian",
  },
  {
    id: "shan-noodles",
    title: "Shan Noodles",
    duration: "25 mins",
    calories: "410 kcal",
    image: require("../home/assets/shan-noodles.png"),
    categories: ["Popular", "Quick"],
  },
  {
    id: "fish-stew",
    title: "Fish Stew",
    duration: "30 mins",
    calories: "390 kcal",
    image: require("../home/assets/tom-yum-soup.png"),
    categories: ["Popular", "Low Carb", "High Protein"],
  },
];

export const aiSuggestedRecipes: readonly MealPlanAiSuggestion[] = [
  {
    id: "ai-chicken-curry",
    title: "Chicken Curry",
    duration: "35 mins",
    calories: "480 kcal",
    description: "A classic Burmese curry with rich flavors.",
    image: require("../home/assets/chicken-curry.png"),
    tags: [
      { label: "High Protein", tone: "primary" },
      { label: "Gluten Free", tone: "success" },
    ],
  },
  {
    id: "ai-shan-noodles",
    title: "Shan Noodles",
    duration: "25 mins",
    calories: "410 kcal",
    description: "Authentic Shan-style noodles with fresh herbs.",
    image: require("../home/assets/shan-noodles.png"),
    tags: [
      { label: "Quick", tone: "info" },
      { label: "Low Carb", tone: "success" },
    ],
  },
  {
    id: "ai-grilled-fish",
    title: "Grilled Fish with Vegetables",
    duration: "20 mins",
    calories: "390 kcal",
    description: "Simple, healthy and delicious.",
    image: require("../home/assets/avocado-toast.png"),
    tags: [
      { label: "High Protein", tone: "primary" },
      { label: "Low Carb", tone: "success" },
    ],
  },
  {
    id: "ai-beef-stir-fry",
    title: "Beef Stir Fry",
    duration: "25 mins",
    calories: "450 kcal",
    description: "Savory stir fry with fresh vegetables.",
    image: require("../home/assets/tom-yum-soup.png"),
    tags: [
      { label: "High Protein", tone: "primary" },
      { label: "Quick", tone: "info" },
    ],
  },
  {
    id: "ai-tofu-curry",
    title: "Tofu Vegetable Curry",
    duration: "30 mins",
    calories: "380 kcal",
    description: "A comforting and nutritious option.",
    image: require("../home/assets/shan-noodles.png"),
    tags: [
      { label: "Vegetarian", tone: "success" },
      { label: "High Fiber", tone: "neutral" },
    ],
  },
];

export const recentMealPlans: readonly RecentMealPlan[] = [
  {
    id: "sep-7-2026",
    date: "Sep 7, 2026",
    summary: "3 meals · 2 people",
    image: require("../home/assets/chicken-curry.png"),
    badge: "Used",
  },
  {
    id: "sep-6-2026",
    date: "Sep 6, 2026",
    summary: "3 meals · 2 people",
    image: require("../home/assets/shan-noodles.png"),
  },
  {
    id: "sep-5-2026",
    date: "Sep 5, 2026",
    summary: "3 meals · 4 people",
    image: require("../home/assets/tom-yum-soup.png"),
  },
];
