import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { getConversations } from "@/lib/chat";

import ConversationItem from "@/components/ConversationItem";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { registerForPushNotifications } from "@/lib/notifications";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadConversations();
    registerForPushNotifications();

  }, []);

  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(data as any);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    const channel = supabase
      .channel("conversations")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {

          if (payload.eventType === "INSERT") {

            setConversations(prev => [
              payload.new,
              ...prev,
            ]);

          }

          if (payload.eventType === "UPDATE") {

            setConversations(prev =>

              prev
                .map((c: any) =>
                  c.id === payload.new.id
                    ? payload.new
                    : c
                )
                .sort(
                  (a: any, b: any) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                )

            );

          }

        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  async function deleteConversation(id: string) {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    console.log(error);

    if (!error) {
      setConversations(prev =>
        prev.filter((c: any) => c.id !== id)
      );
    }
  }


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ConversationItem
          conversation={item}
          onPress={() => {
            router.push(`/chat/${item.id}`);
          }}
          onDelete={deleteConversation}
        />
      )}
    />
  );
}