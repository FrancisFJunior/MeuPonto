import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Ponto } from '../types';

const STORAGE_KEYS = {
  USER: 'meuponto_user',
  PONTOS: 'meuponto_pontos',
};

export class StorageService {
  // Usuário
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  // Pontos
  static async savePontos(pontos: Ponto[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PONTOS, JSON.stringify(pontos));
    } catch (error) {
      console.error('Erro ao salvar pontos:', error);
      throw error;
    }
  }

  static async getPontos(): Promise<Ponto[]> {
    try {
      const pontosData = await AsyncStorage.getItem(STORAGE_KEYS.PONTOS);
      return pontosData ? JSON.parse(pontosData) : [];
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
      return [];
    }
  }

  static async addPonto(ponto: Ponto): Promise<void> {
    try {
      const pontos = await this.getPontos();
      const existingIndex = pontos.findIndex(p => p.dia === ponto.dia);
      
      if (existingIndex >= 0) {
        pontos[existingIndex] = ponto;
      } else {
        pontos.push(ponto);
      }
      
      await this.savePontos(pontos);
    } catch (error) {
      console.error('Erro ao adicionar ponto:', error);
      throw error;
    }
  }

  static async getPontosByDate(date: string): Promise<Ponto | null> {
    try {
      const pontos = await this.getPontos();
      return pontos.find(p => p.dia === date) || null;
    } catch (error) {
      console.error('Erro ao buscar pontos por data:', error);
      return null;
    }
  }

  // Limpar dados (para desenvolvimento)
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }
}
