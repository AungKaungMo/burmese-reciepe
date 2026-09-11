import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

type BottomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  closeAccessibilityLabel: string;
  showHandle?: boolean;
  children: ReactNode;
};

export function BottomDrawer({
  visible,
  onClose,
  closeAccessibilityLabel,
  showHandle = false,
  children,
}: BottomDrawerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <BlurView
          intensity={40}
          tint="dark"
          blurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            accessibilityLabel={closeAccessibilityLabel}
            accessibilityRole="button"
            className="flex-1"
            onPress={onClose}
          />
        </BlurView>

        <Animated.View
          entering={SlideInDown.duration(300)}
          className="max-h-[88%] rounded-t-3xl bg-background px-6 pt-5"
        >
          {showHandle ? (
            <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-text-disabled/60" />
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
