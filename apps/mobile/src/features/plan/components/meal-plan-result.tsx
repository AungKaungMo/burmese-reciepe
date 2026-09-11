import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomDrawer } from "@/shared/components/bottom-drawer";
import Breakfast from "../../../assets/icons/Breakfast";
import Dinner from "../../../assets/icons/Dinner";
import Lunch from "../../../assets/icons/Lunch";
import Snack from "../../../assets/icons/Snack";
import { useTheme } from "@/shared/hooks/use-theme";
import { mealPlanEditDetails } from "../constants";
import { MealPlanReplacement } from "./meal-plan-replacement";
import type {
  GeneratedMealPlanMeal,
  MealPlanResultProps,
  MealPlanRecipeSelection,
} from "../types";

const mealTypeIcon = {
  Breakfast,
  Lunch,
  Dinner,
  Snacks: Snack,
} as const;

const editTagStyles = {
  primary: "bg-tag-red-bg text-tag-red-text",
  success: "bg-tag-green-bg text-tag-green-text",
  neutral: "bg-tag-gold-bg text-tag-gold-text",
} as const;

const editMealTypeBackground = {
  Breakfast: "bg-accent-soft",
  Lunch: "bg-accent-soft",
  Dinner: "bg-info-background",
  Snacks: "bg-primary-soft",
} as const;

export function MealPlanResult({
  meals,
  onSavePlan,
  onGoHome,
}: MealPlanResultProps) {
  const theme = useTheme();
  const [plannedMeals, setPlannedMeals] = useState(meals);
  const [mealToReplace, setMealToReplace] = useState<GeneratedMealPlanMeal | null>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const replaceMeal = (recipe: MealPlanRecipeSelection) => {
    if (!mealToReplace) return;

    setPlannedMeals((currentMeals) =>
      currentMeals.map((currentMeal) =>
        currentMeal.id === mealToReplace.id
          ? {
              ...currentMeal,
              title: recipe.title,
              duration: recipe.duration,
              calories: recipe.calories,
              image: recipe.image,
            }
          : currentMeal,
      ),
    );
    setMealToReplace(null);
  };

  if (mealToReplace) {
    return (
      <MealPlanReplacement
        meal={mealToReplace}
        onClose={() => setMealToReplace(null)}
        onSelectRecipe={replaceMeal}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-heading text-3xl text-text">Your Meal Plan</Text>
          <Pressable
            accessibilityLabel="Open meal plan calendar"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-background-element"
          >
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={22}
              color={theme.text}
            />
          </Pressable>
        </View>
        <Pressable
          accessibilityLabel="Select meal plan date"
          accessibilityRole="button"
          className="mt-2 flex-row items-center gap-2 self-start"
          onPress={() => setIsDatePickerVisible(true)}
        >
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={20}
            color={theme.primary}
          />
          <Text className="font-label text-lg text-text">
            {formatPlanDate(selectedDate)}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={22} color={theme.text} />
        </Pressable>
      </View>

      {isDatePickerVisible && Platform.OS === "android" && (
        <DateTimePicker
          mode="date"
          value={selectedDate}
          minimumDate={startOfToday()}
          accentColor={theme.primary}
          onValueChange={(_event, date) => {
            setSelectedDate(date);
            setIsDatePickerVisible(false);
          }}
          onDismiss={() => setIsDatePickerVisible(false)}
        />
      )}

      {Platform.OS !== "android" && (
        <BottomDrawer
          visible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          closeAccessibilityLabel="Close date picker"
          showHandle
        >
          <View className="pb-8">
            <Text className="mb-2 text-center font-heading text-3xl text-text">
              Select Date
            </Text>
            <DateTimePicker
              mode="date"
              display="inline"
              value={selectedDate}
              minimumDate={startOfToday()}
              accentColor={theme.primary}
              style={{ height: 360 }}
              onValueChange={(_event, date) => setSelectedDate(date)}
            />
            <Pressable
              accessibilityLabel="Confirm selected date"
              accessibilityRole="button"
              className="mt-2 items-center rounded-full bg-primary py-4"
              onPress={() => setIsDatePickerVisible(false)}
            >
              <Text className="font-label text-lg text-white">Done</Text>
            </Pressable>
          </View>
        </BottomDrawer>
      )}

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-6 pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-4 rounded-2xl bg-background-element px-5 py-4">
          <MaterialCommunityIcons name="leaf" size={40} color={theme.success} />
          <View>
            <Text className="font-sans text-base text-text-secondary">
              A personalized plan for your goals
            </Text>
            <Text className="font-label text-base text-text-secondary">
              Balanced · ~1,500 kcal
            </Text>
          </View>
        </View>

        {plannedMeals.map((meal) => (
          <EditableMealCard
            key={meal.id}
            meal={meal}
            onSwap={() => setMealToReplace(meal)}
          />
        ))}

        <View className="flex-row items-center rounded-2xl bg-background-element px-4 py-3">
          <View className="mr-3 h-14 w-14 items-center justify-center rounded-full bg-background-selected">
            <MaterialCommunityIcons name="chart-bar" size={30} color={theme.primary} />
          </View>
          <View className="mr-auto">
            <Text className="font-sans text-sm text-text-secondary">Daily total</Text>
            <Text className="font-heading text-2xl text-text">~1,500 kcal</Text>
          </View>
          <Macro label="Protein" value="90g" />
          <Macro label="Carbs" value="180g" />
          <Macro label="Fat" value="50g" />
        </View>
      </ScrollView>

      <View className="flex-row gap-3 px-6 pb-6 pt-3">
        <Pressable
          accessibilityLabel="Go to home"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary py-4"
          onPress={onGoHome}
        >
          <MaterialCommunityIcons name="home-outline" size={21} color={theme.primary} />
          <Text className="font-label text-base text-primary">Go Home</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Save plan"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
          onPress={onSavePlan}
        >
          <MaterialCommunityIcons name="content-save-outline" size={21} color="white" />
          <Text className="font-label text-base text-white">Save Plan</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function formatPlanDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View className="ml-4 items-center">
      <Text className="font-sans text-xs text-text-secondary">{label}</Text>
      <Text className="font-label text-sm text-text">{value}</Text>
    </View>
  );
}

function Info({ icon, label }: { icon: "clock-outline" | "fire"; label: string }) {
  const theme = useTheme();

  return (
    <View className="shrink flex-row items-center gap-1">
      <MaterialCommunityIcons name={icon} size={15} color={theme.textSecondary} />
      <Text className="font-sans text-xs text-text-secondary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function EditableMealCard({
  meal,
  onSwap,
}: {
  meal: GeneratedMealPlanMeal;
  onSwap: () => void;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 480;
  const MealTypeIcon = mealTypeIcon[meal.mealType];
  const detail = mealPlanEditDetails[meal.mealType];
  const iconColor =
    meal.mealType === "Breakfast" || meal.mealType === "Lunch"
      ? theme.accent
      : meal.mealType === "Dinner"
        ? theme.text
        : theme.primary;

  return (
    <View className="gap-3 rounded-[28px] bg-info-background p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`h-14 w-14 items-center justify-center rounded-full ${
              editMealTypeBackground[meal.mealType]
            }`}
          >
            <MealTypeIcon width={34} height={34} color={iconColor} />
          </View>
          <View>
            <Text className="font-heading text-2xl text-text">{meal.mealType}</Text>
            <Text className="font-sans text-base text-text-secondary">{detail.time}</Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel={`Swap ${meal.mealType}`}
          accessibilityRole="button"
          className="p-2 flex-row gap-1 items-center justify-center rounded-full bg-primary-soft"
          onPress={onSwap}
        >
          <MaterialCommunityIcons name="refresh" size={24} color={theme.primary} />
          <Text className="text-base text-primary">Replace</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-4">
        <Image
          source={meal.image}
          className={`${isWideLayout ? "h-36 w-36" : "h-28 w-28"} rounded-2xl`}
          resizeMode="cover"
        />
        <View className="min-w-0 flex-1 justify-center gap-3">
          <Text className={`${isWideLayout ? "text-2xl" : "text-xl"} font-heading text-text`} numberOfLines={2}>
            {meal.title}
          </Text>
          <View className="flex-row items-center gap-3">
            <Info icon="clock-outline" label={meal.duration} />
            <Info icon="fire" label={meal.calories} />
          </View>
          <View className="flex-row flex-wrap gap-2">
            {detail.tags.map((tag) => {
              const [backgroundClass, textClass] = editTagStyles[tag.tone].split(" ");

              return (
                <View key={tag.label} className={`rounded-full px-3 py-2 ${backgroundClass}`}>
                  <Text className={`font-label text-sm ${textClass}`}>{tag.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
