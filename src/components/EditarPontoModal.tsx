import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';

interface EditarPontoModalProps {
  visible: boolean;
  onClose: () => void;
  ponto: {
    dia: string;
    horarios: string[];
    totalTrabalhado: number;
  } | null;
}

export const EditarPontoModal: React.FC<EditarPontoModalProps> = ({
  visible,
  onClose,
  ponto,
}) => {
  const { editarPonto, apagarPonto } = useAppContext();
  const [horarios, setHorarios] = useState<string[]>([]);
  const [editandoHorario, setEditandoHorario] = useState<number | null>(null);
  const [novoHorario, setNovoHorario] = useState('');

  useEffect(() => {
    if (ponto) {
      setHorarios([...ponto.horarios]);
    }
  }, [ponto]);

  const formatDia = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date);
  };

  const adicionarHorario = () => {
    if (horarios.length >= 8) {
      Alert.alert('Limite Atingido', 'Máximo de 8 pontos por dia');
      return;
    }
    
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    setHorarios([...horarios, currentTime]);
  };

  const editarHorario = (index: number) => {
    setEditandoHorario(index);
    setNovoHorario(horarios[index]);
  };

  const salvarHorario = (index: number) => {
    if (novoHorario.trim() && /^\d{2}:\d{2}$/.test(novoHorario)) {
      const novosHorarios = [...horarios];
      novosHorarios[index] = novoHorario;
      setHorarios(novosHorarios);
      setEditandoHorario(null);
      setNovoHorario('');
    } else {
      Alert.alert('Formato Inválido', 'Use o formato HH:MM (ex: 08:30)');
    }
  };

  const removerHorario = (index: number) => {
    Alert.alert(
      'Remover Horário',
      'Tem certeza que deseja remover este horário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const novosHorarios = horarios.filter((_, i) => i !== index);
            setHorarios(novosHorarios);
          },
        },
      ]
    );
  };

  const salvarAlteracoes = async () => {
    if (!ponto) return;
    
    try {
      await editarPonto(ponto.dia, horarios);
      Alert.alert('Sucesso', 'Pontos atualizados com sucesso!');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  const confirmarExclusao = () => {
    if (!ponto) return;
    
    Alert.alert(
      'Excluir Dia',
      `Tem certeza que deseja excluir todos os pontos de ${formatDia(ponto.dia)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await apagarPonto(ponto.dia);
              Alert.alert('Sucesso', 'Dia excluído com sucesso!');
              onClose();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o dia');
            }
          },
        },
      ]
    );
  };

  if (!ponto) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Pontos</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Data */}
              <View style={styles.dateContainer}>
                <Ionicons name="calendar" size={20} color="#667eea" />
                <Text style={styles.dateText}>{formatDia(ponto.dia)}</Text>
              </View>

              {/* Lista de Horários */}
              <ScrollView style={styles.horariosContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.horariosHeader}>
                  <Text style={styles.horariosTitle}>Horários ({horarios.length}/8)</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={adicionarHorario}
                    disabled={horarios.length >= 8}
                  >
                    <LinearGradient
                      colors={horarios.length >= 8 ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                      style={styles.addButtonGradient}
                    >
                      <Ionicons name="add" size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {horarios.map((horario, index) => (
                  <View key={index} style={styles.horarioItem}>
                    <View style={styles.horarioInfo}>
                      <View style={[styles.dot, { backgroundColor: index % 2 === 0 ? '#3B82F6' : '#10B981' }]} />
                      <Text style={styles.horarioText}>{horario}</Text>
                      <Text style={styles.tipoText}>
                        {index % 2 === 0 ? 'Entrada' : 'Saída'}
                      </Text>
                    </View>
                    
                    <View style={styles.horarioActions}>
                      {editandoHorario === index ? (
                        <View style={styles.editContainer}>
                          <TextInput
                            style={styles.editInput}
                            value={novoHorario}
                            onChangeText={setNovoHorario}
                            placeholder="HH:MM"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                          />
                          <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => salvarHorario(index)}
                          >
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => editarHorario(index)}
                        >
                          <Ionicons name="pencil" size={16} color="#667eea" />
                        </TouchableOpacity>
                      )}
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removerHorario(index)}
                      >
                        <Ionicons name="trash" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {horarios.length === 0 && (
                  <View style={styles.emptyState}>
                    <Ionicons name="time-outline" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>Nenhum horário registrado</Text>
                    <Text style={styles.emptySubtext}>Toque no botão + para adicionar</Text>
                  </View>
                )}
              </ScrollView>

              {/* Ações */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.deleteDayButton} onPress={confirmarExclusao}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.deleteDayButtonGradient}
                  >
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                    <Text style={styles.deleteDayButtonText}>Excluir Dia</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  horariosContainer: {
    flex: 1,
    padding: 24,
  },
  horariosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  horariosTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: 12,
    borderRadius: 20,
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  horarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  horarioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  tipoText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  horarioActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deleteDayButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteDayButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  deleteDayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
