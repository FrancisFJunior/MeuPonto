import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Modal, 
  View, 
  TextInput, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatTime, getTodayStringFormatted } from '../utils/dateUtils';

interface FloatingActionButtonProps {
  onPress?: () => void;
  visible?: boolean;
  onClose?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onPress, 
  visible = false, 
  onClose 
}) => {
  const { state, baterPonto } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [customDate, setCustomDate] = useState('');
  
  const canBaterPonto = state.currentDayPonto ? state.currentDayPonto.horarios.length < 8 : true;

  // Preencher campos quando o modal é exibido
  useEffect(() => {
    if (showModal || visible) {
      const now = new Date();
      setCustomTime(formatTime(now));
      setCustomDate(getTodayStringFormatted());
    }
  }, [showModal, visible]);

  const handlePress = () => {
    if (!canBaterPonto) return;
    setShowModal(true);
  };

  const handleBaterPonto = async () => {
    if (!customTime.trim() || !customDate.trim()) {
      Alert.alert('Erro', 'Preencha hora e data');
      return;
    }

    try {
      // Combinar data e hora customizadas
      const [day, month, year] = customDate.split('-').map(Number);
      const [hours, minutes] = customTime.split(':').map(Number);
      
      // Criar um objeto Date com a data e hora customizadas
      const customDateTime = new Date(year, month - 1, day, hours, minutes);
      
      // Verificar se a data é válida
      if (isNaN(customDateTime.getTime())) {
        Alert.alert('Erro', 'Data ou hora inválida');
        return;
      }
      
      // Chamar a função baterPonto com a data customizada
      await baterPonto(customDateTime);
      setShowModal(false);
      setCustomTime('');
      setCustomDate('');
      if (onClose) onClose();
    } catch (error) {
      console.error('Erro ao bater ponto:', error);
      Alert.alert('Erro', 'Não foi possível bater o ponto');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCustomTime('');
    setCustomDate('');
    if (onClose) onClose();
  };

  // Se visible for true, mostrar apenas o modal
  if (visible) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Bater Ponto</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="time" size={20} color="#667eea" />
                    <TextInput
                      style={styles.input}
                      value={customTime}
                      onChangeText={setCustomTime}
                      placeholder="HH:MM"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Data</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar" size={20} color="#667eea" />
                    <TextInput
                      style={styles.input}
                      value={customDate}
                      onChangeText={setCustomDate}
                      placeholder="DD-MM-YYYY"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButton} onPress={handleBaterPonto}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.confirmButtonGradient}
                    >
                      <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // Se visible for false, não renderizar nada
  return null;
};

const styles = StyleSheet.create({
  // Modal styles
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'transparent',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
