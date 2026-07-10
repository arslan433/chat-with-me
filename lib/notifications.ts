import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "./supabase";

// 🚀 FIXED: Properties ko sahi standard par set kiya taake popup show ho
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // ✅ ZAROORI: Iske bina popup banner nahi aayega
    shouldPlaySound: true,  // ✅ Notification sound ke liye
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) {
      console.log("Push notifications require a physical device.");
      return null;
    }

    // Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX, // Max importance for popup
        vibrationPattern: [0, 250, 250, 250], // Vibration pattern
        lightColor: "#2563EB",
      });
    }

    // Permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    // EAS Project ID
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log("EAS Project ID not found.");
      return null;
    }

    // Expo Push Token
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    console.log("Expo Push Token:", token);

    // Save token to Supabase
    const { error } = await supabase
      .from("admin_devices")
      .upsert(
        {
          id: "admin",
          push_token: token,
          device_name: `${Device.brand} ${Device.modelName}`,
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.log("Failed to save token:", error);
    }

    return token;
  } catch (err) {
    console.log("Notification Error:", err);
    return null;
  }
}