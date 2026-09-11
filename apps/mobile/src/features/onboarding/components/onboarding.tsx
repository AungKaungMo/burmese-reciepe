import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppColorScheme } from "@/shared/hooks/use-app-color-scheme";
import { useTheme } from "@/shared/hooks/use-theme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type OnboardingSlide = {
  title: string;
  description: string;
  icon: IconName;
  iconColor: "primary" | "success";
} & (
  | { photo: ImageSourcePropType } // Full scene photo, shown as a rounded card.
  | { images: Record<"light" | "dark", ImageSourcePropType> } // Themed cutout.
);

const slides: OnboardingSlide[] = [
  {
    title: "Discover\nRecipes",
    description: "Burmese and global recipes for every taste and occasion.",
    icon: "leaf",
    iconColor: "success",
    photo: require("../assets/step1.png"),
  },
  {
    title: "Plan Your\nMeals",
    description: "Get personalized meal plans for your week.",
    icon: "calendar-month-outline",
    iconColor: "primary",
    photo: require("../assets/step2.png"),
  },
  {
    title: "Cook with\nConfidence",
    description:
      "Follow easy, step-by-step recipes with helpful tips and timers.",
    icon: "chef-hat",
    iconColor: "primary",
    photo: require("../assets/step3.png"),
  },
];

export function Onboarding() {
  const { width } = useWindowDimensions();
  const { colorScheme } = useAppColorScheme();
  const theme = useTheme();
  const router = useRouter();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveSlide = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const goToHome = () => router.replace("/home");

  const continueOnboarding = () => {
    if (activeIndex === slides.length - 1) {
      goToHome();
      return;
    }

    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-end px-6 pt-2">
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={goToHome}
            className="p-2 active:opacity-60"
          >
            <Text className="font-heading text-sm text-text-secondary">Skip</Text>
          </Pressable>
        </View>

        {/* <FlatList
          ref={listRef}
          data={slides}
          horizontal
          pagingEnabled
          className="flex-1"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={updateActiveSlide}
          keyExtractor={(slide) => slide.title}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 items-center pt-4">
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color={theme[item.iconColor]}
              />
              <Text className="mt-3 text-center font-title text-4xl leading-[42px] text-text">
                {item.title}
              </Text>
              <Text className="mt-2 max-w-[300px] text-center font-sans text-base leading-6 text-text-secondary">
                {item.description}
              </Text>
              <View className="w-full flex-1 items-center justify-center py-4">
                {"photo" in item ? (
                  <Image
                    source={item.photo}
                    resizeMode="cover"
                    className="w-[395px] flex-1 "
                  />
                ) : (
                  <Image
                    source={item.images[colorScheme]}
                    resizeMode="contain"
                    className="h-full w-full"
                  />
                )}
              </View>
            </View>
          )}
        />

        <View className="gap-4 px-6 pb-3">
          <View
            accessibilityRole="tablist"
            className="flex-row items-center justify-center gap-2"
          >
            {slides.map((slide, index) => (
              <View
                key={slide.title}
                accessibilityRole="tab"
                accessibilityState={{ selected: index === activeIndex }}
                className={
                  index === activeIndex
                    ? "h-2 w-6 rounded-full bg-primary"
                    : "h-2 w-2 rounded-full bg-border"
                }
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={continueOnboarding}
            className="active:opacity-90"
          >
            <View className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4">
              <Text className="font-heading text-base text-white">
                Get Started
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#FFFFFF"
              />
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={goToHome}
            className="active:opacity-60"
          >
            <Text className="text-center font-sans text-sm text-text-secondary">
              I already have an account
            </Text>
          </Pressable>
        </View> */}
      </SafeAreaView>
    </View>
  );
}
