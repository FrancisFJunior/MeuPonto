import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ponto } from '../types';
import { getProgressPercentage, formatHoursToHHMM, getMetaHorasHoje } from '../utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TimelineCardProps {
  ponto: Ponto | null;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ ponto }) => {
  const progress = ponto ? getProgressPercentage(ponto.horarios) : 0;
  const horarios = ponto?.horarios || [];
  const canBaterPonto = horarios.length < 8;
  const metaHoras = getMetaHorasHoje();

  const renderHorario = (horario: string, index: number) => {
    const isEntrada = index % 2 === 0;
    const isUltimo = index === horarios.length - 1;
    
    return (
      <View key={index} style={styles.horarioItem}>
        <View style={styles.horarioContainer}>
          <View style={[
            styles.dot, 
            { 
              backgroundColor: isEntrada ? '#667eea' : '#10B981',
              borderColor: isEntrada ? '#EEF2FF' : '#ECFDF5'
            }
          ]} />
          <View style={styles.horarioInfo}>
            <Text style={styles.horarioText}>{horario}</Text>
            <Text style={styles.tipoText}>
              {isEntrada ? 'Entrada' : 'Saída'}
            </Text>
          </View>
        </View>
        {isUltimo && !isEntrada && (
          <View style={styles.finalizadoBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.finalizadoText}>Finalizado</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="time-outline" size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyText}>Nenhum ponto registrado hoje</Text>
      <Text style={styles.emptySubtext}>Toque no botão para bater o primeiro ponto</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="list" size={24} color="#667eea" />
            </View>
            <View>
              <Text style={styles.title}>Timeline do Dia</Text>
              <Text style={styles.subtitle}>
                {progress.toFixed(1)}% da meta de {metaHoras}h
              </Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: canBaterPonto ? '#10B981' : '#EF4444' }
            ]} />
            <Text style={styles.statusText}>
              {canBaterPonto ? 'Ativo' : 'Limite Atingido'}
            </Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso Diário</Text>
            <Text style={styles.progressValue}>
              {formatHoursToHHMM(ponto?.totalTrabalhado || 0)} / {formatHoursToHHMM(metaHoras)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#667eea', '#10B981']}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        {/* Lista de Horários */}
        <ScrollView style={styles.horariosList} showsVerticalScrollIndicator={false}>
          {horarios.length > 0 ? (
            horarios.map(renderHorario)
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
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
    maxHeight: 500,
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  horariosList: {
    maxHeight: '100%',
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
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
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 3,
  },
  horarioInfo: {
    flex: 1,
  },
  horarioText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  tipoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  finalizadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  finalizadoText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
