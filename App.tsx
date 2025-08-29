import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { useAppContext } from './src/context/AppContext';

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  // Se não há usuário, mostrar onboarding
  if (!state.user) {
    return <OnboardingScreen />;
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

