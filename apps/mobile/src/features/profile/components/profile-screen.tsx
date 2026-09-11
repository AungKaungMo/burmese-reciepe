import { Screen } from "@/shared/components/screen";
import { ThemedText } from "@/shared/components/themed-text";

export function ProfileScreen() {
  return (
    <Screen>
      <ThemedText type="subtitle">Profile</ThemedText>
      <ThemedText themeColor="textSecondary">
        Manage your account and preferences.
      </ThemedText>
    </Screen>
  );
}
