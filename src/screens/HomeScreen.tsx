import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { BancoHorasCard } from '../components/BancoHorasCard';
import { TimelineCard } from '../components/TimelineCard';
import { formatDate, formatHoursToHHMM, getMetaHorasHoje } from '../utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onProfilePress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onProfilePress }) => {
  const { state } = useAppContext();
  const today = new Date();

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
        >
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIconContainer}>
              <Ionicons name="time" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
        >
          <View style={styles.noUserContainer}>
            <View style={styles.noUserIconContainer}>
              <Ionicons name="person-outline" size={64} color="#FFFFFF" />
            </View>
            <Text style={styles.noUserText}>Usuário não configurado</Text>
            <Text style={styles.noUserSubtitle}>Configure seu perfil para começar</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const metaHoras = getMetaHorasHoje();
  const primeiroNome = state.user.nome.split(' ')[0];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header com gradiente */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Olá, {primeiroNome}!</Text>
                <Text style={styles.date}>{formatDate(today)}</Text>
              </View>
              
              {/* Botão de perfil */}
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={onProfilePress}
              >
                <View style={styles.profileIconContainer}>
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Resumo rápido compacto */}
            <View style={styles.quickSummary}>
              <View style={styles.summaryItem}>
                <Ionicons name="time" size={18} color="#FFFFFF" />
                <Text style={styles.summaryText}>
                  {formatHoursToHHMM(state.currentDayPonto?.totalTrabalhado || 0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="flag" size={18} color="#FFFFFF" />
                <Text style={styles.summaryText}>
                  Meta: {formatHoursToHHMM(metaHoras)}
                </Text>
              </View>
            </View>
          </View>

          {/* Conteúdo principal */}
          <View style={styles.content}>
            {/* Banco de Horas */}
            <BancoHorasCard bancoHoras={state.bancoHoras} />

            {/* Timeline do Dia */}
            <TimelineCard ponto={state.currentDayPonto} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSummary: {
    flexDirection: 'row',
    gap: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    height: '100%',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noUserIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  noUserText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  noUserSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
