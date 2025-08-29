import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    email: '',
    senha: '',
    saldoHorasInicial: '00:00',
  });

  const handleCreateProfile = async () => {
    // Validações
    if (!formData.username.trim()) {
      Alert.alert('Erro', 'O username é obrigatório');
      return;
    }

    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erro', 'O e-mail é obrigatório');
      return;
    }

    if (!formData.senha.trim()) {
      Alert.alert('Erro', 'A senha é obrigatória');
      return;
    }

    if (formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const newUser = {
        username: formData.username.trim().toLowerCase(),
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha.trim(),
        saldoHorasInicial: 0, // Será convertido do formato HH:MM
      };

      await StorageService.saveUser(newUser);
      dispatch({ type: 'SET_USER', payload: newUser });
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
      
      Alert.alert('Sucesso', 'Perfil criado com sucesso!', [
        { text: 'OK' }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o perfil');
    }
  };

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
            {/* Header com animação */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons name="time" size={48} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.title}>Bem-vindo ao Meu Ponto!</Text>
              <Text style={styles.subtitle}>
                Configure seu perfil para começar a controlar suas horas de trabalho
              </Text>
            </View>

            {/* Formulário com design moderno */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) => setFormData({ ...formData, username: text })}
                    placeholder="Digite um nome de usuário"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <Text style={styles.inputHelp}>
                  Este campo não poderá ser alterado posteriormente
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-circle" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    value={formData.nome}
                    onChangeText={(text) => setFormData({ ...formData, nome: text })}
                    placeholder="Digite seu nome completo"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="lock-closed" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    value={formData.senha}
                    onChangeText={(text) => setFormData({ ...formData, senha: text })}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.inputHelp}>
                  Mínimo de 6 caracteres
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="time" size={20} color="#667eea" />
                  <TextInput
                    style={styles.input}
                    value={formData.saldoHorasInicial}
                    onChangeText={(text) => setFormData({ ...formData, saldoHorasInicial: text })}
                    placeholder="00:00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.inputHelp}>
                  Horas extras ou déficit que você já possui (formato HH:MM)
                </Text>
              </View>
            </View>

            {/* Botão de Criação com gradiente */}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateProfile}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.buttonGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Criar Perfil</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Informações com design moderno */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Como funciona?</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.infoText}>Bata até 8 pontos por dia</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="trending-up" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.infoText}>Acompanhe seu progresso</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="calendar" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.infoText}>Histórico completo</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="calculator" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.infoText}>Banco de horas</Text>
                </View>
              </View>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
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
  inputHelp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
    paddingLeft: 36,
  },
  createButton: {
    marginHorizontal: 20,
    marginBottom: 24,
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
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoItem: {
    width: (width - 88) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoIconContainer: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
});
