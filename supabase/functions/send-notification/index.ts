import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req : Request) => {
  try {
    const payload = await req.json();

    console.log("Webhook:", payload);

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const message = payload.record;

    // only user messages  notification 
    if (message.sender !== "user") {
      return new Response("Ignored");
    }

    // Conversation details
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", message.conversation_id)
      .single();

    if (!conversation) {
      return new Response("Conversation not found");
    }

    //  admin takeover: no notification 
    if (conversation.status !== "waiting") {
      return new Response("Conversation not waiting");
    }

    // Admin token
    const { data: admin } = await supabase
      .from("admin_devices")
      .select("push_token")
      .eq("id", "admin")
      .single();

    if (!admin?.push_token) {
      return new Response("No push token");
    }

    console.log("Push Token:", admin?.push_token);
console.log("Title:", conversation.visitor_name);
console.log("Body:", message.message);

    // Expo Push Notification
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: admin.push_token,
        title: conversation.visitor_name || "New Visitor",
        body: message.message,
        sound: "default",
        data: {
          conversationId: message.conversation_id,
        },
      }),
    });

    const result = await res.json();

    console.log(result);

    return Response.json(result);
  } catch (err) {
    console.error(err);

    return new Response(String(err), {
      status: 500,
    });
  }
});