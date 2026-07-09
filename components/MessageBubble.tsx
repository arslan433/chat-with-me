import { View, Text } from "react-native";

export default function MessageBubble({ message }: any) {
  const sender = message.sender?.toLowerCase();

  const isUser = sender === "user";
  const isBot = sender === "bot";
  const isAdmin = sender === "admin";
  const isSystem = sender === "system";

  // System Messages
  if (isSystem) {
    return (
      <View className="py-2">
        <Text className="text-center text-xs text-zinc-400">
          {message.message}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`px-4 my-2 ${
        isUser ? "items-start" : "items-end"
      }`}
    >
      {/* Label */}
      {!isUser && (
        <Text
          className={`text-[10px] font-semibold mb-1 mr-1 ${
            isAdmin
              ? "text-green-400"
              : "text-sky-400"
          }`}
        >
          {isAdmin ? "🧑‍💻 Arslan" : "🤖 AI Assistant"}
        </Text>
      )}

      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-zinc-700 rounded-tl-none"
            : isAdmin
            ? "bg-green-600 rounded-tr-none"
            : "bg-sky-700 rounded-tr-none"
        }`}
      >
        <Text className="text-white">
          {message.message}
        </Text>

        <Text
          className={`text-[10px] mt-1 text-right ${
            isUser
              ? "text-zinc-300"
              : "text-blue-100"
          }`}
        >
          {new Date(
            message.created_at || Date.now()
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}