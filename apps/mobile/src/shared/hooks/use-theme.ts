/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/shared/theme";
import { useAppColorScheme } from "@/shared/hooks/use-app-color-scheme";

export function useTheme() {
  const { colorScheme: theme } = useAppColorScheme();

  return Colors[theme];
}
