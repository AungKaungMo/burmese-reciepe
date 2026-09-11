import type {
  CookingTime,
  Cuisine,
  DietaryOption,
  DifficultyLevel,
  IngredientIcon,
  IngredientSubstitution,
  MealFilter,
  PopularRecipe,
  RecipeCard,
  RecipeDetail,
  SearchRecipe,
} from "./types";

export const ingredientSubstitutions: Readonly<
  Record<IngredientIcon, readonly IngredientSubstitution[]>
> = {
  "food-drumstick": [
    {
      name: "Firm tofu",
      amount: "Use the same amount",
      description: "A hearty vegetarian option.",
      icon: "food",
    },
    {
      name: "Mushrooms",
      amount: "Use the same amount",
      description: "Adds a savoury, meaty texture.",
      icon: "bowl-mix",
    },
    {
      name: "Chickpeas",
      amount: "Use 1½ cups",
      description: "A simple, protein-rich alternative.",
      icon: "food-apple",
    },
  ],
  "food-apple": [
    {
      name: "Shallots",
      amount: "Use the same amount",
      description: "A milder aromatic alternative.",
      icon: "food-apple",
    },
    {
      name: "Leeks",
      amount: "Use 1½ cups",
      description: "Adds gentle sweetness to the dish.",
      icon: "leaf",
    },
    {
      name: "Fennel",
      amount: "Use the same amount",
      description: "Fresh and slightly sweet in flavour.",
      icon: "leaf",
    },
  ],
  carrot: [
    {
      name: "Sweet potato",
      amount: "Use the same amount",
      description: "Soft, sweet, and filling.",
      icon: "carrot",
    },
    {
      name: "Pumpkin",
      amount: "Use 1½ cups",
      description: "A tender alternative for curries.",
      icon: "food-apple",
    },
    {
      name: "Cauliflower",
      amount: "Use the same amount",
      description: "Light and easy to cook through.",
      icon: "food",
    },
  ],
  food: [
    {
      name: "Garlic powder",
      amount: "Use ⅛ tsp per clove",
      description: "Convenient when fresh garlic is unavailable.",
      icon: "bowl-mix",
    },
    {
      name: "Garlic paste",
      amount: "Use the same amount",
      description: "Keeps the same fragrant flavour.",
      icon: "bowl-mix",
    },
    {
      name: "Shallots",
      amount: "Use 1 tbsp minced",
      description: "A gentler aromatic replacement.",
      icon: "food-apple",
    },
  ],
  leaf: [
    {
      name: "Ground ginger",
      amount: "Use ¼ tsp",
      description: "Warm flavour with a little less freshness.",
      icon: "bowl-mix",
    },
    {
      name: "Galangal",
      amount: "Use the same amount",
      description: "Fragrant and great in Southeast Asian dishes.",
      icon: "leaf",
    },
    {
      name: "Fresh herbs",
      amount: "Use the same amount",
      description: "Brightens the recipe with freshness.",
      icon: "leaf",
    },
  ],
  oil: [
    {
      name: "Peanut oil",
      amount: "Use the same amount",
      description: "A neutral oil for high heat cooking.",
      icon: "oil",
    },
    {
      name: "Sunflower oil",
      amount: "Use the same amount",
      description: "Light and mild in flavour.",
      icon: "oil",
    },
    {
      name: "Ghee",
      amount: "Use 2 tbsp",
      description: "Adds a richer, buttery finish.",
      icon: "bowl-mix",
    },
  ],
  "bowl-mix": [
    {
      name: "Garam masala",
      amount: "Use the same amount",
      description: "A warm and aromatic spice blend.",
      icon: "bowl-mix",
    },
    {
      name: "Cumin and coriander",
      amount: "Use 1 tbsp each",
      description: "A simple homemade spice mix.",
      icon: "bowl-mix",
    },
    {
      name: "Paprika",
      amount: "Use the same amount",
      description: "Adds colour and mild warmth.",
      icon: "chili-hot",
    },
  ],
  "chili-hot": [
    {
      name: "Curry powder",
      amount: "Use the same amount",
      description: "A mild, aromatic replacement.",
      icon: "bowl-mix",
    },
    {
      name: "Paprika",
      amount: "Use the same amount",
      description: "Adds colour without much heat.",
      icon: "chili-hot",
    },
    {
      name: "Cumin",
      amount: "Use ½ tsp",
      description: "Earthy and warming in curries.",
      icon: "bowl-mix",
    },
  ],
  "bottle-tonic": [
    {
      name: "Soy sauce",
      amount: "Use 1–1.5 tbsp",
      description: "A good alternative, slightly darker in flavour.",
      icon: "bottle-tonic",
    },
    {
      name: "Tamari",
      amount: "Use the same amount",
      description: "A gluten-free savoury option.",
      icon: "bottle-tonic",
    },
    {
      name: "Vegetable broth",
      amount: "Use 2 tbsp",
      description: "Adds seasoning with less saltiness.",
      icon: "cup-water",
    },
  ],
  "shaker-outline": [
    {
      name: "Fish sauce",
      amount: "Use 1–1.5 tsp",
      description: "Adds saltiness and umami. Great for Burmese dishes.",
      icon: "bottle-tonic",
    },
    {
      name: "Soy sauce",
      amount: "Use 1–1.5 tsp",
      description: "A good alternative, slightly darker in flavour.",
      icon: "bottle-tonic",
    },
    {
      name: "Vegetable bouillon",
      amount: "Use 1 tsp",
      description: "Adds saltiness with extra flavour.",
      icon: "bowl-mix",
    },
    {
      name: "Sea salt",
      amount: "Use the same amount",
      description: "Works the same as regular salt.",
      icon: "shaker-outline",
    },
  ],
  "cup-water": [
    {
      name: "Vegetable broth",
      amount: "Use the same amount",
      description: "Adds more flavour than plain water.",
      icon: "cup-water",
    },
    {
      name: "Chicken stock",
      amount: "Use the same amount",
      description: "Makes the dish richer and savoury.",
      icon: "cup-water",
    },
    {
      name: "Coconut water",
      amount: "Use the same amount",
      description: "A lightly sweet option for curries.",
      icon: "cup-water",
    },
  ],
  "fruit-citrus": [
    {
      name: "Rice vinegar",
      amount: "Use 1 tbsp",
      description: "Gives the dish a bright acidic note.",
      icon: "bottle-tonic",
    },
    {
      name: "Tamarind",
      amount: "Use 1 tbsp",
      description: "Tangy and delicious in Asian dishes.",
      icon: "food-apple",
    },
    {
      name: "Lemon juice",
      amount: "Use the same amount",
      description: "Fresh and easy to use.",
      icon: "fruit-citrus",
    },
  ],
  egg: [
    {
      name: "Silken tofu",
      amount: "Use ¼ cup per egg",
      description: "Soft and works well in savoury dishes.",
      icon: "food",
    },
    {
      name: "Chickpea flour",
      amount: "Use 3 tbsp",
      description: "A useful plant-based binder.",
      icon: "food-apple",
    },
    {
      name: "Flax egg",
      amount: "Use 1 tbsp flax + 3 tbsp water",
      description: "A simple vegan alternative.",
      icon: "bowl-mix",
    },
  ],
};

export const mealFilters = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
] as const satisfies readonly MealFilter[];

export const dietaryOptions = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Halal",
  "Low-carb",
  "Gluten-free",
] as const satisfies readonly DietaryOption[];

export const cookingTimes = [
  "Any",
  "< 15 mins",
  "15 – 30 mins",
  "30 – 60 mins",
  "> 60 mins",
] as const satisfies readonly CookingTime[];

export const difficultyLevels = [
  "Any",
  "Easy",
  "Medium",
  "Hard",
] as const satisfies readonly DifficultyLevel[];

export const cuisines = [
  "Burmese",
  "Asian",
  "Western",
  "Thai",
  "Indian",
  "Chinese",
  "Japanese",
  "Korean",
  "Mediterranean",
  "Others",
] as const satisfies readonly Cuisine[];

export const popularRecipes: readonly PopularRecipe[] = [
  {
    id: "shan-noodles",
    title: "Shan Noodles",
    rating: "4.8",
    duration: "25 mins",
    difficulty: "Easy",
    trending: true,
    image: require("./assets/shan-noodles.png"),
  },
  {
    id: "chicken-curry",
    title: "Chicken Curry",
    rating: "4.7",
    duration: "35 mins",
    difficulty: "Medium",
    image: require("./assets/chicken-curry.png"),
  },
];

export const recommendedRecipes: readonly RecipeCard[] = [
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    rating: "4.6",
    duration: "10 mins",
    image: require("./assets/avocado-toast.png"),
  },
  {
    id: "tom-yum-soup",
    title: "Tom Yum Soup",
    rating: "4.8",
    duration: "30 mins",
    image: require("./assets/tom-yum-soup.png"),
  },
  {
    id: "avi-loi",
    title: "AVI LOI",
    rating: "4.6",
    duration: "40 mins",
    image: require("./assets/avocado-toast.png"),
  },
];

export const searchRecipes: readonly SearchRecipe[] = [
  {
    id: "chicken-curry",
    title: "Chicken Curry",
    rating: "4.8",
    duration: "25 mins",
    difficulty: "Easy",
    image: require("./assets/chicken-curry.png"),
  },
  {
    id: "honey-garlic-chicken",
    title: "Honey Garlic Chicken",
    rating: "4.9",
    duration: "30 mins",
    difficulty: "Medium",
    image: require("./assets/chicken-curry.png"),
  },
  {
    id: "grilled-chicken-salad",
    title: "Grilled Chicken Salad",
    rating: "4.7",
    duration: "20 mins",
    difficulty: "Easy",
    image: require("./assets/avocado-toast.png"),
  },
  {
    id: "chicken-fried-rice",
    title: "Chicken Fried Rice",
    rating: "4.5",
    duration: "35 mins",
    difficulty: "Easy",
    image: require("./assets/shan-noodles.png"),
  },
  {
    id: "chicken-wrap",
    title: "Chicken Wrap",
    rating: "4.6",
    duration: "15 mins",
    difficulty: "Easy",
    image: require("./assets/avocado-toast.png"),
  },
  {
    id: "lemon-herb-chicken",
    title: "Lemon Herb Chicken",
    rating: "4.8",
    duration: "40 mins",
    difficulty: "Medium",
    image: require("./assets/chicken-curry.png"),
  },
  {
    id: "shan-noodles",
    title: "Shan Noodles",
    rating: "4.8",
    duration: "25 mins",
    difficulty: "Easy",
    image: require("./assets/shan-noodles.png"),
  },
  {
    id: "tom-yum-soup",
    title: "Tom Yum Soup",
    rating: "4.8",
    duration: "30 mins",
    difficulty: "Medium",
    image: require("./assets/tom-yum-soup.png"),
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    rating: "4.6",
    duration: "10 mins",
    difficulty: "Easy",
    image: require("./assets/avocado-toast.png"),
  },
];

export const recipeDetails: Readonly<Record<string, RecipeDetail>> = {
  "chicken-curry": {
    id: "chicken-curry",
    title: "Chicken Curry",
    rating: "4.7",
    duration: "35 mins",
    difficulty: "Easy",
    image: require("./assets/chicken-curry.png"),
    tags: ["Main Dish", "Burmese", "Popular"],
    description:
      "A classic Burmese chicken curry with rich flavors and simple ingredients. Perfect with steamed rice.",
    servings: 4,
    specialties: [
      { label: "Rich flavor", icon: "fire" },
      { label: "Family friendly", icon: "account-group" },
      { label: "Everyday meal", icon: "silverware-fork-knife" },
    ],
    ingredients: [
      {
        name: "Chicken (cut into pieces)",
        amount: 500,
        unit: "g",
        icon: "food-drumstick",
      },
      { name: "Onion (sliced)", amount: 2, unit: "medium", icon: "food-apple" },
      { name: "Potato (cubed)", amount: 2, unit: "medium", icon: "carrot" },
      { name: "Garlic (minced)", amount: 4, unit: "cloves", icon: "food" },
      { name: "Ginger (minced)", amount: 1, unit: "tbsp", icon: "leaf" },
      { name: "Cooking oil", amount: 3, unit: "tbsp", icon: "oil" },
      { name: "Curry powder", amount: 2, unit: "tbsp", icon: "bowl-mix" },
      { name: "Turmeric powder", amount: 1, unit: "tsp", icon: "chili-hot" },
      { name: "Fish sauce", amount: 2, unit: "tbsp", icon: "bottle-tonic" },
      {
        name: "Salt",
        amount: 1,
        unit: "tsp",
        icon: "shaker-outline",
      },
      { name: "Water", amount: 400, unit: "ml", icon: "cup-water" },
    ],
    steps: [
      {
        title: "Prepare ingredients",
        duration: "5 mins",
        instruction:
          "Wash and cut all ingredients. Keep them ready before you start cooking.",
      },
      {
        title: "Heat oil",
        duration: "2 mins",
        instruction:
          "Add 3 tbsp of cooking oil to a pot and heat over medium heat.",
      },
      {
        title: "Sauté aromatics",
        duration: "3 mins",
        instruction:
          "Add sliced onions and sauté until soft and slightly golden. Then add garlic and ginger, and cook for another minute.",
      },
      {
        title: "Add chicken",
        duration: "5 mins",
        instruction:
          "Add the chicken pieces and cook until they are no longer pink.",
      },
      {
        title: "Add spices",
        duration: "2 mins",
        instruction:
          "Add curry powder and turmeric powder. Stir well to coat the chicken.",
      },
      {
        title: "Add water and simmer",
        duration: "15 mins",
        instruction:
          "Pour in 400 ml of water, bring to a boil, then reduce heat and simmer until the chicken and potatoes are tender.",
      },
      {
        title: "Season and finish",
        duration: "3 mins",
        instruction:
          "Add fish sauce and salt to taste. Stir and cook for a few minutes. It's ready!",
      },
    ],
    nutrition: [
      { label: "Calories", value: "420", unit: "kcal", icon: "fire" },
      { label: "Protein", value: "29 g", unit: "", icon: "sprout" },
      { label: "Carbs", value: "18 g", unit: "", icon: "barley" },
      { label: "Fat", value: "24 g", unit: "", icon: "water-outline" },
    ],
    goodToKnow: [
      { label: "High in protein", icon: "briefcase-outline" },
      { label: "Rich in vitamins and minerals", icon: "shield-check" },
      { label: "Great with steamed rice", icon: "bowl-mix" },
      { label: "Can be made less spicy", icon: "chili-hot" },
    ],
    allergens: {
      title: "Contains fish",
      description:
        "This recipe uses fish sauce. Check ingredients for personal allergies.",
    },
    storage: "Keep in an airtight container in the fridge for up to 3 days.",
  },
  "shan-noodles": {
    id: "shan-noodles",
    title: "Shan Noodles",
    rating: "4.8",
    duration: "25 mins",
    difficulty: "Easy",
    image: require("./assets/shan-noodles.png"),
    tags: ["Noodles", "Burmese", "Popular"],
    description:
      "Comforting Shan-style noodles topped with savory chicken and fresh herbs.",
    servings: 2,
    specialties: [
      { label: "Rich flavor", icon: "fire" },
      { label: "Quick to make", icon: "account-group" },
      { label: "Everyday meal", icon: "silverware-fork-knife" },
    ],
    ingredients: [
      { name: "Rice noodles", amount: 250, unit: "g", icon: "bowl-mix" },
      { name: "Chicken", amount: 250, unit: "g", icon: "food-drumstick" },
      { name: "Tomato", amount: 2, unit: "medium", icon: "chili-hot" },
      { name: "Garlic", amount: 3, unit: "cloves", icon: "food" },
      { name: "Fresh herbs", amount: 1, unit: "cup", icon: "leaf" },
    ],
    steps: [
      {
        title: "Cook the noodles",
        duration: "4 - 8 mins",
        instruction:
          "Cook rice noodles until tender, then drain and set aside.",
      },
      {
        title: "Make the topping",
        duration: "10 - 12 mins",
        instruction:
          "Prepare the savoury chicken topping with tomato and garlic.",
      },
      {
        title: "Combine and serve",
        duration: "3 - 5 mins",
        instruction:
          "Top the noodles with chicken and finish with fresh herbs.",
      },
      {
        title: "Make the topping",
        duration: "10 - 12 mins",
        instruction:
          "Prepare the savoury chicken topping with tomato and garlic.",
      },
      {
        title: "Combine and serve",
        duration: "3 - 5 mins",
        instruction:
          "Top the noodles with chicken and finish with fresh herbs.",
      },
      {
        title: "Make the topping",
        duration: "10 - 12 mins",
        instruction:
          "Prepare the savoury chicken topping with tomato and garlic.",
      },
      {
        title: "Combine and serve",
        duration: "3 - 5 mins",
        instruction:
          "Top the noodles with chicken and finish with fresh herbs.",
      },
    ],
    nutrition: [
      { label: "Calories", value: "390", unit: "kcal", icon: "fire" },
      { label: "Protein", value: "21 g", unit: "", icon: "sprout" },
      { label: "Carbs", value: "48 g", unit: "", icon: "barley" },
      { label: "Fat", value: "10 g", unit: "", icon: "water-outline" },
    ],
    goodToKnow: [
      { label: "A satisfying everyday meal", icon: "briefcase-outline" },
      { label: "Full of fresh herbs", icon: "shield-check" },
      { label: "A Burmese classic", icon: "bowl-mix" },
      { label: "Adjust chili to taste", icon: "chili-hot" },
    ],
    allergens: {
      title: "Contains gluten",
      description:
        "Check noodle and seasoning labels for gluten-containing ingredients.",
    },
    storage:
      "Keep the topping and noodles separately in the fridge for up to 2 days.",
  },
  "tom-yum-soup": {
    id: "tom-yum-soup",
    title: "Tom Yum Soup",
    rating: "4.8",
    duration: "30 mins",
    difficulty: "Medium",
    image: require("./assets/tom-yum-soup.png"),
    tags: ["Soup", "Asian", "Spicy"],
    description:
      "A hot and fragrant soup balanced with citrus, herbs, and tender ingredients.",
    servings: 3,
    specialties: [
      { label: "Bold flavor", icon: "fire" },
      { label: "Shareable", icon: "account-group" },
      { label: "Weeknight meal", icon: "silverware-fork-knife" },
    ],
    ingredients: [
      { name: "Broth", amount: 750, unit: "ml", icon: "cup-water" },
      { name: "Lemongrass", amount: 2, unit: "stalks", icon: "leaf" },
      { name: "Mushrooms", amount: 200, unit: "g", icon: "bowl-mix" },
      { name: "Lime", amount: 2, unit: "whole", icon: "fruit-citrus" },
      { name: "Chili", amount: 2, unit: "whole", icon: "chili-hot" },
    ],
    steps: [
      {
        title: "Simmer aromatics",
        duration: "10 mins",
        instruction: "Simmer lemongrass and broth until fragrant.",
      },
      {
        title: "Add vegetables",
        duration: "12 mins",
        instruction: "Add mushrooms and cook until tender.",
      },
      {
        title: "Finish the soup",
        duration: "8 mins",
        instruction:
          "Balance with lime, chili, and fresh herbs before serving.",
      },
    ],
    nutrition: [
      { label: "Calories", value: "260", unit: "kcal", icon: "fire" },
      { label: "Protein", value: "18 g", unit: "", icon: "sprout" },
      { label: "Carbs", value: "20 g", unit: "", icon: "barley" },
      { label: "Fat", value: "9 g", unit: "", icon: "water-outline" },
    ],
    goodToKnow: [
      { label: "Light yet filling", icon: "briefcase-outline" },
      { label: "Rich in fragrant herbs", icon: "shield-check" },
      { label: "Great for sharing", icon: "bowl-mix" },
      { label: "Adjust chili to taste", icon: "chili-hot" },
    ],
    allergens: {
      title: "Check ingredients",
      description:
        "This recipe may contain seafood or fish sauce depending on your choices.",
    },
    storage: "Store in an airtight container in the fridge for up to 2 days.",
  },
  "avocado-toast": {
    id: "avocado-toast",
    title: "Avocado Toast",
    rating: "4.6",
    duration: "10 mins",
    difficulty: "Easy",
    image: require("./assets/avocado-toast.png"),
    tags: ["Breakfast", "Western", "Quick"],
    description:
      "Creamy avocado on crisp toast, finished with bright, fresh toppings.",
    servings: 2,
    specialties: [
      { label: "Fresh flavor", icon: "fire" },
      { label: "Family friendly", icon: "account-group" },
      { label: "Quick meal", icon: "silverware-fork-knife" },
    ],
    ingredients: [
      { name: "Sourdough", amount: 4, unit: "slices", icon: "bowl-mix" },
      { name: "Avocado", amount: 2, unit: "whole", icon: "food-apple" },
      { name: "Lemon", amount: 1, unit: "whole", icon: "fruit-citrus" },
      { name: "Chili flakes", amount: 1, unit: "tsp", icon: "chili-hot" },
      { name: "Eggs", amount: 2, unit: "whole", icon: "egg" },
    ],
    steps: [
      {
        title: "Toast the bread",
        duration: "3 mins",
        instruction: "Toast the sourdough until golden and crisp.",
      },
      {
        title: "Mash the avocado",
        duration: "4 mins",
        instruction: "Mash avocado with lemon, salt, and chili flakes.",
      },
      {
        title: "Top and serve",
        duration: "3 mins",
        instruction:
          "Spread over toast, add eggs if desired, and serve immediately.",
      },
    ],
    nutrition: [
      { label: "Calories", value: "320", unit: "kcal", icon: "fire" },
      { label: "Protein", value: "28 g", unit: "", icon: "sprout" },
      { label: "Carbs", value: "18 g", unit: "", icon: "barley" },
      { label: "Fat", value: "16 g", unit: "", icon: "water-outline" },
    ],
    goodToKnow: [
      { label: "High in protein", icon: "briefcase-outline" },
      { label: "Rich in vitamins and minerals", icon: "shield-check" },
      { label: "Great for a quick breakfast", icon: "bowl-mix" },
      { label: "Can be made less spicy", icon: "chili-hot" },
    ],
    allergens: {
      title: "None",
      description:
        "This recipe does not contain common allergens. Please check ingredients for personal allergies.",
    },
    storage: "Keep in an airtight container in the fridge for up to 3 days.",
  },
};

export function getRecipeDetail(recipeId: string): RecipeDetail {
  const detail = recipeDetails[recipeId];

  if (detail) return detail;

  const preview = [
    ...searchRecipes,
    ...popularRecipes,
    ...recommendedRecipes,
  ].find((recipe) => recipe.id === recipeId);

  if (!preview) return recipeDetails["chicken-curry"];

  return {
    ...preview,
    difficulty: "Easy",
    tags: ["Recipe", "Burmese", "Popular"],
    description: `A delicious ${preview.title.toLowerCase()} recipe made for sharing at home.`,
    servings: 2,
    specialties: [
      { label: "Rich flavor", icon: "fire" },
      { label: "Family friendly", icon: "account-group" },
      { label: "Everyday meal", icon: "silverware-fork-knife" },
    ],
    ingredients: [
      { name: "Fresh ingredients", amount: 2, unit: "cups", icon: "bowl-mix" },
      { name: "Aromatic herbs", amount: 1, unit: "cup", icon: "leaf" },
      {
        name: "Seasoning to taste",
        amount: 1,
        unit: "tsp",
        icon: "shaker-outline",
      },
    ],
    steps: [
      {
        title: "Prepare ingredients",
        duration: "5 mins",
        instruction: "Measure and prepare all ingredients before cooking.",
      },
      {
        title: "Cook the recipe",
        duration: "20 mins",
        instruction: "Cook until fragrant, tender, and fully warmed through.",
      },
      {
        title: "Serve and enjoy",
        duration: "5 mins",
        instruction: "Serve warm and enjoy with your favourite sides.",
      },
    ],
    nutrition: [
      { label: "Calories", value: "350", unit: "kcal", icon: "fire" },
      { label: "Protein", value: "18 g", unit: "", icon: "sprout" },
      { label: "Carbs", value: "32 g", unit: "", icon: "barley" },
      { label: "Fat", value: "14 g", unit: "", icon: "water-outline" },
    ],
    goodToKnow: [
      { label: "Balanced everyday meal", icon: "briefcase-outline" },
      { label: "Made with fresh ingredients", icon: "shield-check" },
      { label: "Great for sharing", icon: "bowl-mix" },
      { label: "Season to your taste", icon: "chili-hot" },
    ],
    allergens: {
      title: "Check ingredients",
      description: "Please check ingredient labels for personal allergies.",
    },
    storage: "Keep in an airtight container in the fridge for up to 3 days.",
  };
}
