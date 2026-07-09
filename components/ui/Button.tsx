import { Pressable, Text } from "react-native";

export default function Button({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-blue-600 py-3 rounded-xl items-center"
    >
      <Text className="text-white font-semibold">
        {title}
      </Text>
    </Pressable>
  );
}