import { Screen } from "@/shared/components/screen";
import { ThemedText } from "@/shared/components/themed-text";

export function SavedScreen() {
  return (
    <Screen>
      <ThemedText type="subtitle">Saved</ThemedText>
      <ThemedText themeColor="textSecondary">
        Your saved recipes will appear here.
      </ThemedText>
    </Screen>
  );
}
