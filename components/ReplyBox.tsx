import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { supabase } from "@/lib/supabase";

export default function ReplyBox({
  conversationId,
}: {
  conversationId: string;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // async function sendReply() {
  //   if (!message.trim() || sending) return;

  //   setSending(true);

  //   try {
  //     const text = message.trim();

  //     const { error } = await supabase
  //       .from("messages")
  //       .insert({
  //         conversation_id: conversationId,
  //         sender: "admin",
  //         message: text,
  //       });

  //     if (error) throw error;

  //     await supabase
  //       .from("conversations")
  //       .update({
  //         last_message: text,
  //         updated_at: new Date().toISOString(),
  //       })
  //       .eq("id", conversationId);

  //     setMessage("");

  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setSending(false);
  //   }
  // }

  async function sendReply() {
  if (!message.trim()) return;

  setSending(true);

  try {
    // 1. Conversation Human
    await supabase
      .from("conversations")
      .update({
        status: "human",
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // 2. Save Admin Message
    const { error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender: "admin",
        message: message.trim(),
      });

    if (error) throw error;

    setMessage("");

  } catch (err) {
    console.log(err);
  } finally {
    setSending(false);
  }
}

  return (
    <View className="flex-row p-3 border-t border-zinc-800 bg-zinc-900"
    style={{
    paddingBottom: Platform.OS === "android" ? 8 : 0,
  }}
    >

      <TextInput
  value={message}
  onChangeText={setMessage}
  placeholder="Type message..."
  placeholderTextColor="#888"
  className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-3"

  autoCorrect={false}
  autoComplete="off"
  spellCheck={false}
/>

      <TouchableOpacity
        onPress={sendReply}
        className="ml-2 bg-blue-600 px-5 justify-center rounded-xl"
      >
        <Text className="text-white font-bold">
          Send
        </Text>
      </TouchableOpacity>

    </View>
  );
}