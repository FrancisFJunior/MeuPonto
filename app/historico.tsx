import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../src/context/AppContext';
import { formatDate, getMetaHoras } from '../src/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { EditarPontoModal } from '../src/components/EditarPontoModal';

interface HistoricoItemProps {
  item: {
    dia: string;
    horarios: string[];
    totalTrabalhado: number;
  };
  onEdit: (item: any) => void;
}

const HistoricoItem: React.FC<HistoricoItemProps> = ({ item, onEdit }) => {
  const { dia, horarios, totalTrabalhado } = item;
  const dataPonto = new Date(dia);
  const metaHoras = getMetaHoras(dataPonto);
  const progress = (totalTrabalhado / metaHoras) * 100;

  const formatDia = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date);
  };

  const getStatusColor = () => {
    if (progress >= 100) return '#10B981'; // Verde - Meta atingida
    if (progress >= 75) return '#F59E0B'; // Amarelo - Quase lá
    return '#EF4444'; // Vermelho - Abaixo da meta
  };

  const getStatusText = () => {
    if (progress >= 100) return 'Meta Atingida';
    if (progress >= 75) return 'Quase Lá';
    return 'Abaixo da Meta';
  };

  return (
    <TouchableOpacity 
      style={styles.historicoItem}
      onPress={() => onEdit(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDia(dia)}</Text>
          <Text style={styles.dayText}>
            {new Date(dia).toLocaleDateString('pt-BR', { weekday: 'long' })}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progress, 100)}%`, backgroundColor: getStatusColor() }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {totalTrabalhado.toFixed(2)}h / {metaHoras}h ({progress.toFixed(1)}%)
        </Text>
      </View>

      <View style={styles.horariosContainer}>
        <View style={styles.horariosHeader}>
          <Text style={styles.horariosTitle}>Pontos ({horarios.length}/8)</Text>
          <View style={styles.editIndicator}>
            <Ionicons name="pencil" size={16} color="#667eea" />
            <Text style={styles.editText}>Toque para editar</Text>
          </View>
        </View>
        
        <View style={styles.horariosList}>
          {horarios.length > 0 ? (
            horarios.map((horario: string, index: number) => (
              <View key={index} style={styles.horarioItem}>
                <View style={[styles.dot, { backgroundColor: index % 2 === 0 ? '#3B82F6' : '#10B981' }]} />
                <Text style={styles.horarioText}>{horario}</Text>
                <Text style={styles.tipoText}>
                  {index % 2 === 0 ? 'Entrada' : 'Saída'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noPontosText}>Nenhum ponto registrado</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HistoricoScreen() {
  const { state } = useAppContext();
  const [editingPonto, setEditingPonto] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Ordenar pontos por data (mais recente primeiro)
  const sortedPontos = [...state.pontos].sort((a, b) => 
    new Date(b.dia).getTime() - new Date(a.dia).getTime()
  );

  // Debug: verificar se os pontos estão sendo carregados
  console.log('HistoricoScreen - Total de pontos no estado:', state.pontos.length);
  console.log('HistoricoScreen - Pontos ordenados:', sortedPontos);

  const handleEditPonto = (item: any) => {
    setEditingPonto(item);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPonto(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <HistoricoItem item={item} onEdit={handleEditPonto} />
  );

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>
          {sortedPontos.length} dias registrados
        </Text>
      </View>

      {sortedPontos.length > 0 ? (
        <FlatList
          data={sortedPontos}
          renderItem={renderItem}
          keyExtractor={(item) => item.dia}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Seus pontos aparecerão aqui após bater o primeiro ponto
          </Text>
        </View>
      )}

      {/* Modal de Edição */}
      <EditarPontoModal
        visible={showEditModal}
        onClose={closeEditModal}
        ponto={editingPonto}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Add padding for the modal
  },
  historicoItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    textAlign: 'right',
  },
  horariosContainer: {
    marginTop: 10,
  },
  horariosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  horariosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 5,
  },
  horariosList: {
    //
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  horarioText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tipoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  noPontosText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});