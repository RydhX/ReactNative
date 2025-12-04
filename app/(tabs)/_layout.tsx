import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome5 } from '@expo/vector-icons';

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8a2be2',
        tabBarInactiveTintColor: '#4a3d6e',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false, // Hide all labels
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#4a3d6e',
          height: 100, 
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="atom" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Lokasi",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="layer-group" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Peta",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="crosshairs" color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
