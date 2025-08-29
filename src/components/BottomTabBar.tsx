import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

interface BottomTabBarProps {
  currentTab: string;
  onTabPress: (tabName: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onTabPress }) => {
  const { state } = useAppContext();

  const tabs = [
    { name: 'home', label: 'Início', icon: 'home' as const },
    { name: 'bater-ponto', label: 'Bater Ponto', icon: 'time' as const, isSpecial: true },
    { name: 'historico', label: 'Histórico', icon: 'calendar' as const },
  ];

  const renderTab = (tab: typeof tabs[0]) => {
    const isActive = currentTab === tab.name;
    const isSpecial = tab.isSpecial;

    if (isSpecial) {
      return (
        <TouchableOpacity
          key={tab.name}
          style={styles.specialTab}
          onPress={() => onTabPress(tab.name)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.specialTabGradient}
          >
            <Ionicons 
              name={tab.icon} 
              size={28} 
              color="#FFFFFF" 
            />
            <Text style={styles.specialTabText}>{tab.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={tab.name}
        style={styles.tab}
        onPress={() => onTabPress(tab.name)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={tab.icon} 
          size={24} 
          color={isActive ? '#667eea' : '#9CA3AF'} 
        />
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map(renderTab)}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  specialTab: {
    flex: 1.5,
    marginHorizontal: 8,
  },
  specialTabGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  specialTabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
});
