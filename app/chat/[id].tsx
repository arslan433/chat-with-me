import { useEffect, useState } from "react";
import {
  View, FlatList, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import MessageBubble from "@/components/MessageBubble";
import { useRef } from "react";
import ReplyBox from "@/components/ReplyBox";
import { updateConversation } from "@/lib/chat";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [conversation, setConversation] = useState<any>(null);


  useEffect(() => {
    if (!id) return;

    loadMessages();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          const newMessage = payload.new;

          setMessages((prev) => {
            // duplicate prevent
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }

            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`conversation-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setConversation(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function loadConversation() {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    setConversation(data);


  }

  useEffect(() => {
    loadConversation();
  }, []);


  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      return;
    }

    setMessages(data || []);

    // unread reset
    await updateConversation(String(id), {
      unread_count: 0,
    });
  }

  async (payload) => {
    const newMessage = payload.new;

    setMessages((prev) => {
      if (prev.some((m) => m.id === newMessage.id)) {
        return prev;
      }

      return [...prev, newMessage];
    });

    await updateConversation(String(id), {
      unread_count: 0,
    });
  }

  async function takeOver() {
    await supabase
      .from("conversations")
      .update({
        status: "human",
      })
      .eq("id", id);

    await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender: "system",
        message: "Human has taken over the conversation. You are now chatting with a Arslan.",
      });
  }

  async function endChat() {
    await supabase
      .from("conversations")
      .update({
        status: "bot",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender: "system",
        message: "Chat ended. AI Assistant has resumed the conversation.",
      });

  }

  useEffect(() => {
    flatListRef.current?.scrollToEnd({
      animated: false,
    });
  }, [messages]);
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#18181b",
          },
          headerTintColor: "#fff",

          headerTitle: () => (
            <View>
              <Text className="text-white font-bold text-base">
                {conversation?.visitor_name || "Anonymous"}
              </Text>

              <Text className="text-xs text-gray-300">
                {conversation?.visitor_email || "No Email"}
              </Text>
            </View>
          ),

          headerRight: () =>
            conversation?.status === "human" ? (
              <TouchableOpacity
                onPress={endChat}
                className="bg-red-600 px-3 py-1 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  End
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={takeOver}
                className="bg-green-600 px-3 py-1 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  Take Over
                </Text>
              </TouchableOpacity>
            ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={90}
      >

        <View className="flex-1 bg-zinc-900">


          <View className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">


            <Text className="text-xs mt-2 text-zinc-400">
              {conversation?.status === "bot"
                ? "Chatting with AI Assistant"
                : conversation?.status === "waiting"
                  ? "🟡 Waiting for Arslan"
                  : "🟢 Chatting with Arslan"}
            </Text>

          </View>




          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} />
            )}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({
                animated: true,
              })
            }
          />

          <ReplyBox
            conversationId={String(id)}
          />

        </View>
      </KeyboardAvoidingView>

    </>

  );
}