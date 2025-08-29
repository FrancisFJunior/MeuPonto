import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="historico" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}