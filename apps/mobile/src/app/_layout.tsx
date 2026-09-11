import "@/shared/styles/global.css";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { fontAssets, FontFamilies } from "@/shared/theme";
import {
  AppColorSchemeProvider,
  useAppColorScheme,
} from "@/shared/hooks/use-app-color-scheme";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...fontAssets,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hide();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppColorSchemeProvider>
      <App />
    </AppColorSchemeProvider>
  );
}

function App() {
  const { colorScheme } = useAppColorScheme();
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colorScheme === "dark" ? "#171310" : "#FFF8ED",
      border: colorScheme === "dark" ? "#493B32" : "#E8D9C9",
      card: colorScheme === "dark" ? "#211B17" : "#FFFFFF",
      notification: colorScheme === "dark" ? "#E06B55" : "#B94A35",
      primary: colorScheme === "dark" ? "#E06B55" : "#B94A35",
      text: colorScheme === "dark" ? "#FFF6EA" : "#2B211B",
    },
    fonts: {
      regular: {
        fontFamily: FontFamilies.primary.regular,
        fontWeight: "normal" as const,
      },
      medium: {
        fontFamily: FontFamilies.primary.medium,
        fontWeight: "normal" as const,
      },
      bold: {
        fontFamily: FontFamilies.primary.bold,
        fontWeight: "normal" as const,
      },
      heavy: {
        fontFamily: FontFamilies.primary.bold,
        fontWeight: "normal" as const,
      },
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
