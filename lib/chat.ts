import { supabase } from "./supabase";

export async function getConversations() {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateConversation(
  id: string,
  updates: any
) {
  const { error } = await supabase
    .from("conversations")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}