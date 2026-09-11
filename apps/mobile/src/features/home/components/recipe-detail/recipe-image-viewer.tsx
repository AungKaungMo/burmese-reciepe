import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Modal, Pressable, Text, View } from "react-native";

import type { RecipeImageViewerProps } from "../../types";

export function RecipeImageViewer({
  image,
  title,
  visible,
  onClose,
}: RecipeImageViewerProps) {
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <Pressable
          accessibilityLabel="Close image viewer"
          className="flex-1 items-center justify-center"
          onPress={onClose}
        >
          <Image
            source={image}
            className="h-full w-full"
            resizeMode="contain"
            accessibilityLabel={title}
          />
        </Pressable>

        <Pressable
          accessibilityLabel="Close image viewer"
          className="absolute right-5 top-14 h-12 w-12 items-center justify-center rounded-full bg-black/55"
          onPress={onClose}
        >
          <MaterialCommunityIcons name="close" size={29} color="white" />
        </Pressable>
        <Text
          className="absolute bottom-12 left-6 right-6 text-center font-label text-lg text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </Modal>
  );
}
