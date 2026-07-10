import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as LocalAuthentication from 'expo-local-authentication';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Trigger biometric or PIN verification as soon as layout loads
  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      // Bypass security gate if phone doesn't have secure hardware or set up locks
      if (!hasHardware || !isEnrolled) {
        setIsAuthenticated(true);
        return;
      }

      // Prompt native scanner with automatic device PIN/Pattern backup fallback
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Chats & Explore',
        fallbackLabel: 'Use Device PIN',
        disableDeviceFallback: false, 
      });

      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Security Gateway Error:', error);
    }
  };

  // 1. Structural Gate: If unauthorized, block screen layout with NativeWind UI
  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-[#111111] p-6">
        <Text className="text-2xl font-bold text-white mb-3">
          App Locked
        </Text>
        
        <Text className="text-sm text-[#aaaaaa] text-center mb-10 leading-5">
          Please verify your fingerprint, Face ID, or PIN to access your tabs.
        </Text>
        
        <TouchableOpacity 
          className="bg-[#007AFF] py-3.5 px-10 rounded-xl w-4/5 items-center active:opacity-80" 
          onPress={authenticateUser}
        >
          <Text className="text-white text-base font-bold">
            Unlock App
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Authorized State: Serve your normal application routing
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
