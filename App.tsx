import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}