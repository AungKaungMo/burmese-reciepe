import { Pressable, View, type ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/shared/hooks/use-theme";
import { FontFamilies } from "@/shared/theme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: IconName;
  color: ColorValue;
  size: number;
}) {
  return (
    <View className="h-7 w-[31px] items-center justify-center">
      <MaterialCommunityIcons name={name} color={color} size={size} />
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarButton: (props) => {
          const { ref: _ref, style: _style, ...pressableProps } = props;
          const selected = props["aria-selected"] === true;

          return (
            <Pressable
              {...pressableProps}
              className={`mt-2.5 h-16 w-20 self-center items-center justify-center rounded-2xl ${
                selected ? "bg-active-tab-background" : "bg-transparent"
              }`}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamilies.primary.medium,
          fontSize: 11,
        },
        tabBarIconStyle: {
          overflow: "visible",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "home-variant" : "home-variant-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "calendar-month" : "calendar-month-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "account" : "account-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
