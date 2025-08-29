import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BancoHoras } from '../types';
import { formatHoursToHHMM } from '../utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface BancoHorasCardProps {
  bancoHoras: BancoHoras;
}

export const BancoHorasCard: React.FC<BancoHorasCardProps> = ({ bancoHoras }) => {
  const getSaldoColor = () => {
    if (bancoHoras.saldoAtual >= 0) return '#10B981'; // Verde
    return '#EF4444'; // Vermelho
  };

  const getSaldoText = () => {
    if (bancoHoras.saldoAtual >= 0) return '+';
    return '';
  };

  const getSaldoIcon = () => {
    if (bancoHoras.saldoAtual >= 0) return 'trending-up';
    return 'trending-down';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.gradientBackground}
      >
        {/* Header com ícone */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="calculator" size={24} color="#667eea" />
          </View>
          <Text style={styles.title}>Banco de Horas</Text>
        </View>
        
        {/* Saldo Principal */}
        <View style={styles.saldoContainer}>
          <Text style={styles.saldoLabel}>Saldo Atual</Text>
          <View style={styles.saldoValueContainer}>
            <Ionicons 
              name={getSaldoIcon()} 
              size={28} 
              color={getSaldoColor()} 
              style={styles.saldoIcon}
            />
            <Text style={[styles.saldoValue, { color: getSaldoColor() }]}>
              {getSaldoText()}{formatHoursToHHMM(bancoHoras.saldoAtual)}
            </Text>
          </View>
        </View>
        
        {/* Detalhes em Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="time" size={20} color="#667eea" />
            </View>
            <Text style={styles.detailLabel}>Saldo Inicial</Text>
            <Text style={styles.detailValue}>
              {formatHoursToHHMM(bancoHoras.saldoInicial)}
            </Text>
          </View>
          
          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="briefcase" size={20} color="#10B981" />
            </View>
            <Text style={styles.detailLabel}>Trabalhadas</Text>
            <Text style={styles.detailValue}>
              {formatHoursToHHMM(bancoHoras.horasTrabalhadas)}
            </Text>
          </View>
          
          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.detailLabel}>Previstas</Text>
            <Text style={styles.detailValue}>
              {formatHoursToHHMM(bancoHoras.horasPrevistas)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientBackground: {
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  saldoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saldoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  saldoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saldoIcon: {
    marginRight: 8,
  },
  saldoValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
});
