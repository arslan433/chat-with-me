import { Pressable, Text, View, Alert } from "react-native";

interface Props {
  conversation: any;
  onPress: () => void;
  onDelete: (id: string | number) => void; // New callback function for deleting
}

export default function ConversationItem({
  conversation,
  onPress,
  onDelete,
}: Props) {

  const getStatusStyles = (status: string | null) => {
    const currentStatus = status?.toLowerCase();

    switch (currentStatus) {
      case 'human':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/30',
          text: 'text-emerald-400'
        };
      case 'waiting':
        return {
          bg: 'bg-amber-500/20 border-amber-500/30',
          text: 'text-amber-400'
        };
      case 'bot':
        return {
          bg: 'bg-sky-500/20 border-sky-500/30',
          text: 'text-sky-400'
        };
      default:
        return {
          bg: 'bg-neutral-500/20 border-neutral-500/30',
          text: 'text-neutral-400'
        };
    }
  };

  const statusStyle = getStatusStyles(conversation.status);

  // Function to show native confirmation popup
  const handleLongPress = () => {
    Alert.alert(
      "Delete Conversation",
      `Are you sure you want to delete the chat with ${conversation.visitor_name || "Anonymous"}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive", // Shows red text on iOS for safety warnings
          onPress: () => onDelete(conversation.id) // Executes delete backend logic
        }
      ]
    );
  };



  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress} // Triggers the popup on press & hold
      delayLongPress={600} // Time in milliseconds required to trigger long press
      className="px-4 py-4 border-b border-zinc-800 active:bg-zinc-900/50" // Visual feedback on click
    >
      <View className="flex-row items-center">

        <View className={`w-14 h-14 items-center justify-center ${statusStyle.bg} rounded-full` }>
          <Text className="text-white font-bold text-lg">
            {(conversation.visitor_name || "A")
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <View className="flex-1 ml-3">

          <View className="flex-row justify-between">

            <View className="flex-row items-center gap-2.5">
              {/* Visitor Name */}
              <Text className="text-white text-base font-semibold tracking-wide">
                {conversation.visitor_name || "Anonymous"}
              </Text>

              {/* Dynamic Status Badge */}
              {conversation.status && (
                <View className={`border px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                  <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
                    {conversation.status}
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-zinc-500 text-xs">
              {new Date(conversation.updated_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

          </View>

          <View className="flex-row justify-between mt-1">

            <Text
              className="text-zinc-400 flex-1"
              numberOfLines={1}
            >
              {conversation.last_message}
            </Text>

            {conversation.unread_count > 0 && (
              <View className="bg-green-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs">
                  {conversation.unread_count}
                </Text>
              </View>
            )}

          </View>

        </View>

      </View>
    </Pressable>
  );
}
