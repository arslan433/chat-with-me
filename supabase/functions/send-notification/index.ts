import { createClient } from "npm:@supabase/supabase-js@2.45.0";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    console.log(`Blocked: Received ${req.method} request instead of POST.`);
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    console.log("1. Webhook Raw Payload Received:", JSON.stringify(payload));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const message = payload.record;
    if (!message) {
      console.log("Error: Payload record is missing");
      return new Response("No record found in payload", { status: 400 });
    }

    // Validation: Sirf User ke messages par trigger karein
    if (message.sender !== "user") {
      console.log(`Ignored: Sender is '${message.sender}', not 'user'`);
      return new Response("Ignored: Not a user message");
    }

    // Conversation layout state check
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", message.conversation_id)
      .single();

    if (convError || !conversation) {
      console.log("Error: Conversation not found for ID:", message.conversation_id);
      return new Response("Conversation not found", { status: 404 });
    }

    if (conversation.status !== "waiting") {
      console.log(`Ignored: Status is '${conversation.status}', not 'waiting'`);
      return new Response("Conversation not waiting");
    }

    // Admin Devices Push Token
    const { data: admin, error: adminError } = await supabase
      .from("admin_devices")
      .select("push_token")
      .eq("id", "admin")
      .single();

    if (adminError || !admin?.push_token) {
      console.log("Error: Admin push token missing in Database");
      return new Response("No push token", { status: 404 });
    }

        console.log("Sending High-Priority Push Notification to Token:", admin.push_token);

    const expoPayload = [
      {
        to: admin.push_token,
        title: conversation.visitor_name || "New Visitor Chat",
        body: message.message,
        sound: "default",
        priority: "high",           // App closed notification delivery
        channelId: "default",       // Android notification channel setup
        data: { conversationId: message.conversation_id },
      }
    ];

    // Clean API call with essential security headers
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate" // Expo route handling verification 
      },
      body: JSON.stringify(expoPayload),
    });


    // Handle plain text response to avoid crash
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await res.json();
      console.log("Expo Delivery Receipt Result:", JSON.stringify(result));
      return Response.json(result);
    } else {
      const textError = await res.text();
      console.error("Expo Server did not return JSON:", textError);
      return new Response(`Expo Error: ${textError}`, { status: res.status });
    }

  } catch (err) {
    console.error("CRITICAL EXCEPTION:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
