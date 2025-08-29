import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppContext } from '../src/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../src/services/storageService';
import { LinearGradient } from 'expo-linear-gradient';
import { formatHoursToHHMM, parseHHMMToHours } from '../src/utils/dateUtils';

export default function PerfilScreen() {
  const { state, dispatch } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: state.user?.nome || '',
    email: state.user?.email || '',
    senha: '',
    saldoHorasInicial: state.user ? formatHoursToHHMM(state.user.saldoHorasInicial) : '00:00',
  });

  const handleSave = async () => {
    if (!state.user) return;

    // Validações básicas
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erro', 'O e-mail é obrigatório');
      return;
    }

    if (isEditing && formData.senha.trim() && formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const saldoHoras = parseHHMMToHours(formData.saldoHorasInicial);
      
      const updatedUser = {
        ...state.user,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        ...(formData.senha.trim() && { senha: formData.senha.trim() }),
        saldoHorasInicial: saldoHoras,
      };

      await StorageService.saveUser(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
      
      setIsEditing(false);
      setFormData({ ...formData, senha: '' });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: state.user?.nome || '',
      email: state.user?.email || '',
      senha: '',
      saldoHorasInicial: state.user ? formatHoursToHHMM(state.user.saldoHorasInicial) : '00:00',
    });
    setIsEditing(false);
  };

  const handleResetData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAll();
              dispatch({ type: 'SET_USER', payload: null });
              dispatch({ type: 'SET_PONTOS', payload: [] });
              Alert.alert('Sucesso', 'Todos os dados foram limpos');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar os dados');
            }
          },
        },
      ]
    );
  };

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
            <Text style={styles.noUserTitle}>Perfil não configurado</Text>
            <Text style={styles.noUserSubtitle}>
              Configure seu perfil para começar a usar o app
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header com gradiente */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#EEF2FF', '#E0E7FF']}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={48} color="#667eea" />
                </LinearGradient>
              </View>
              <Text style={styles.username}>{state.user.username}</Text>
              <Text style={styles.usernameSubtitle}>Username (não editável)</Text>
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
              {/* Formulário */}
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="person-circle" size={20} color="#667eea" />
                    <TextInput
                      style={[styles.input, !isEditing && styles.inputDisabled]}
                      value={formData.nome}
                      onChangeText={(text) => setFormData({ ...formData, nome: text })}
                      placeholder="Digite seu nome completo"
                      placeholderTextColor="#9CA3AF"
                      editable={isEditing}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="mail" size={20} color="#667eea" />
                    <TextInput
                      style={[styles.input, !isEditing && styles.inputDisabled]}
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      placeholder="Digite seu e-mail"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={isEditing}
                    />
                  </View>
                </View>

                {isEditing && (
                  <View style={styles.inputGroup}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="lock-closed" size={20} color="#667eea" />
                      <TextInput
                        style={styles.input}
                        value={formData.senha}
                        onChangeText={(text) => setFormData({ ...formData, senha: text })}
                        placeholder="Nova senha (opcional)"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>
                    <Text style={styles.inputHelp}>
                      Deixe em branco para manter a senha atual
                    </Text>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="time" size={20} color="#667eea" />
                    <TextInput
                      style={[styles.input, !isEditing && styles.inputDisabled]}
                      value={formData.saldoHorasInicial}
                      onChangeText={(text) => setFormData({ ...formData, saldoHorasInicial: text })}
                      placeholder="00:00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      editable={isEditing}
                    />
                  </View>
                  <Text style={styles.inputHelp}>
                    Horas extras ou déficit que você já possui (formato HH:MM)
                  </Text>
                </View>
              </View>

              {/* Botões de Ação */}
              <View style={styles.actionsContainer}>
                {isEditing ? (
                  <>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.buttonGradient}
                      >
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Ionicons name="close" size={20} color="#6B7280" />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* Botão de Reset */}
              <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.resetButtonText}>Limpar Todos os Dados</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  usernameSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  content: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputIconContainer: {
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
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  inputHelp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
    paddingLeft: 36,
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  editButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  noUserTitle: {
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