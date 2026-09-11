import { router } from "expo-router";
import { useState } from "react";

import { MealPlanAvoidIngredientsStep } from "@/features/plan/components/meal-plan-avoid-ingredients-step";
import { MealPlanBudgetStep } from "@/features/plan/components/meal-plan-budget-step";
import { MealPlanCookingTimeStep } from "@/features/plan/components/meal-plan-cooking-time-step";
import { MealPlanDietaryStep } from "@/features/plan/components/meal-plan-dietary-step";
import { MealPlanGoalStep } from "@/features/plan/components/meal-plan-goal-step";
import { MealPlanPeopleStep } from "@/features/plan/components/meal-plan-people-step";
import { MealPlanResult } from "@/features/plan/components/meal-plan-result";
import { generatedMealPlan } from "@/features/plan/constants";
import type {
  MealPlanBudget,
  MealPlanCookingTime,
  MealPlanDietaryPreference,
  MealPlanGoal,
} from "@/features/plan/types";

export default function PlanCreatorScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressFromStep, setProgressFromStep] = useState(1);
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<MealPlanGoal>("balanced");
  const [people, setPeople] = useState(2);
  const [selectedPreference, setSelectedPreference] =
    useState<MealPlanDietaryPreference>("no-preference");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    "Pork",
    "Mushroom",
  ]);
  const [selectedBudget, setSelectedBudget] =
    useState<MealPlanBudget>("budget");
  const [selectedCookingTime, setSelectedCookingTime] =
    useState<MealPlanCookingTime>("quick");

  const goBack = () => {
    if (currentStep === 1) {
      router.back();
      return;
    }

    setProgressFromStep(currentStep);
    setCurrentStep((step) => step - 1);
  };

  const goNext = () => {
    setProgressFromStep(currentStep);
    setCurrentStep((step) => Math.min(step + 1, 6));
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((currentIngredients) =>
      currentIngredients.includes(ingredient)
        ? currentIngredients.filter((item) => item !== ingredient)
        : [...currentIngredients, ingredient],
    );
  };

  if (isPlanGenerated) {
    return (
      <MealPlanResult
        meals={generatedMealPlan}
        onSavePlan={() => router.replace("/home")}
        onGoHome={() => router.replace("/home")}
      />
    );
  }

  if (currentStep === 1) {
    return (
      <MealPlanGoalStep
        selectedGoal={selectedGoal}
        progressFromStep={progressFromStep}
        onClose={goBack}
        onSelectGoal={setSelectedGoal}
        onContinue={goNext}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <MealPlanPeopleStep
        people={people}
        progressFromStep={progressFromStep}
        onBack={goBack}
        onChangePeople={setPeople}
        onContinue={goNext}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <MealPlanDietaryStep
        selectedPreference={selectedPreference}
        progressFromStep={progressFromStep}
        onBack={goBack}
        onSelectPreference={setSelectedPreference}
        onContinue={goNext}
      />
    );
  }

  if (currentStep === 4) {
    return (
      <MealPlanAvoidIngredientsStep
        searchTerm={searchTerm}
        selectedIngredients={selectedIngredients}
        progressFromStep={progressFromStep}
        onBack={goBack}
        onChangeSearchTerm={setSearchTerm}
        onToggleIngredient={toggleIngredient}
        onContinue={goNext}
      />
    );
  }

  if (currentStep === 5) {
    return (
      <MealPlanBudgetStep
        selectedBudget={selectedBudget}
        progressFromStep={progressFromStep}
        onBack={goBack}
        onSelectBudget={setSelectedBudget}
        onContinue={goNext}
      />
    );
  }

  return (
    <MealPlanCookingTimeStep
      selectedCookingTime={selectedCookingTime}
      progressFromStep={progressFromStep}
      onBack={goBack}
      onSelectCookingTime={setSelectedCookingTime}
      onContinue={() => setIsPlanGenerated(true)}
    />
  );
}
