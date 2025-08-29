import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import { FloatingActionButton } from '../components/FloatingActionButton';

export const AppNavigator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [showBaterPontoModal, setShowBaterPontoModal] = useState(false);
  const { state } = useAppContext();

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen onProfilePress={() => setCurrentTab('perfil')} />;
      case 'historico':
        return <HistoricoScreen />;
      case 'bater-ponto':
        // Abre o modal de bater ponto
        setShowBaterPontoModal(true);
        setCurrentTab('home'); // Volta para home
        return <HomeScreen onProfilePress={() => setCurrentTab('perfil')} />;
      case 'perfil':
        return <PerfilScreen />;
      default:
        return <HomeScreen onProfilePress={() => setCurrentTab('perfil')} />;
    }
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === 'bater-ponto') {
      setShowBaterPontoModal(true);
    } else {
      setCurrentTab(tabName);
    }
  };

  const closeBaterPontoModal = () => {
    setShowBaterPontoModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo principal */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Barra de navegação inferior */}
      <BottomTabBar 
        currentTab={currentTab} 
        onTabPress={handleTabPress} 
      />

      {/* Modal de Bater Ponto */}
      <FloatingActionButton 
        visible={showBaterPontoModal}
        onClose={closeBaterPontoModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
});
