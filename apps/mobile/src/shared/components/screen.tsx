import { type PropsWithChildren } from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/shared/components/themed-view";
import { Spacing } from "@/shared/theme";

type ScreenProps = PropsWithChildren<{ style?: ViewStyle }>;

/** Themed screen wrapper for tab screens. Handles the top safe area; the
 *  tab bar covers the bottom inset. */
export function Screen({ children, style }: ScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top"]} style={[styles.content, style]}>
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
});
