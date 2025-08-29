import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Ponto, BancoHoras } from '../types';
import { StorageService } from '../services/storageService';
import { getTodayString, calculateHoursWorked, getMetaHoras } from '../utils/dateUtils';

interface AppState {
  user: User | null;
  pontos: Ponto[];
  currentDayPonto: Ponto | null;
  bancoHoras: BancoHoras;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_PONTOS'; payload: Ponto[] }
  | { type: 'ADD_PONTO'; payload: Ponto }
  | { type: 'UPDATE_PONTO'; payload: Ponto }
  | { type: 'REMOVE_PONTO'; payload: string }
  | { type: 'SET_CURRENT_DAY_PONTO'; payload: Ponto | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CALCULATE_BANCO_HORAS' };

const initialState: AppState = {
  user: null,
  pontos: [],
  currentDayPonto: null,
  bancoHoras: {
    saldoInicial: 0,
    horasTrabalhadas: 0,
    horasPrevistas: 0,
    saldoAtual: 0,
  },
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'SET_PONTOS':
      return { ...state, pontos: action.payload };
    
    case 'ADD_PONTO':
      const updatedPontos = [...state.pontos];
      const existingIndex = updatedPontos.findIndex(p => p.dia === action.payload.dia);
      
      if (existingIndex >= 0) {
        updatedPontos[existingIndex] = action.payload;
      } else {
        updatedPontos.push(action.payload);
      }
      
      return { ...state, pontos: updatedPontos };
    
    case 'UPDATE_PONTO':
      const pontosParaUpdate = [...state.pontos];
      const updateIndex = pontosParaUpdate.findIndex(p => p.dia === action.payload.dia);
      
      if (updateIndex >= 0) {
        pontosParaUpdate[updateIndex] = action.payload;
      }
      
      return { ...state, pontos: pontosParaUpdate };
    
    case 'REMOVE_PONTO':
      const pontosParaRemover = state.pontos.filter(p => p.dia !== action.payload);
      return { ...state, pontos: pontosParaRemover };
    
    case 'SET_CURRENT_DAY_PONTO':
      return { ...state, currentDayPonto: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'CALCULATE_BANCO_HORAS':
      if (!state.user) return state;
      
      const totalHorasTrabalhadas = state.pontos.reduce((total, ponto) => {
        return total + ponto.totalTrabalhado;
      }, 0);
      
      // Calcular horas previstas baseado na meta de cada dia
      const totalHorasPrevistas = state.pontos.reduce((total, ponto) => {
        const dataPonto = new Date(ponto.dia);
        const metaDia = getMetaHoras(dataPonto);
        return total + metaDia;
      }, 0);
      
      return {
        ...state,
        bancoHoras: {
          saldoInicial: state.user.saldoHorasInicial,
          horasTrabalhadas: totalHorasTrabalhadas,
          horasPrevistas: totalHorasPrevistas,
          saldoAtual: state.user.saldoHorasInicial + (totalHorasTrabalhadas - totalHorasPrevistas),
        },
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  baterPonto: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  editarPonto: (dia: string, horarios: string[]) => Promise<void>;
  apagarPonto: (dia: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [user, pontos] = await Promise.all([
        StorageService.getUser(),
        StorageService.getPontos(),
      ]);
      
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
      }
      
      if (pontos.length > 0) {
        dispatch({ type: 'SET_PONTOS', payload: pontos });
        
        // Buscar pontos do dia atual
        const today = getTodayString();
        const todayPonto = pontos.find(p => p.dia === today) || null;
        dispatch({ type: 'SET_CURRENT_DAY_PONTO', payload: todayPonto });
      }
      
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const baterPonto = async () => {
    if (!state.user) return;
    
    try {
      const now = new Date();
      const today = getTodayString();
      const currentTime = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      let todayPonto = state.currentDayPonto;
      
      if (!todayPonto) {
        todayPonto = {
          id: Date.now().toString(),
          dia: today,
          horarios: [],
          totalTrabalhado: 0,
        };
      }
      
      if (todayPonto.horarios.length >= 8) {
        throw new Error('Limite de 8 pontos por dia atingido');
      }
      
      // Criar uma nova cópia do ponto para evitar mutação
      const updatedPonto = {
        ...todayPonto,
        horarios: [...todayPonto.horarios, currentTime],
        totalTrabalhado: 0, // Será recalculado
      };
      
      // Recalcular horas trabalhadas
      updatedPonto.totalTrabalhado = calculateHoursWorked(updatedPonto.horarios);
      
      // Salvar no storage
      await StorageService.addPonto(updatedPonto);
      
      // Atualizar o estado
      dispatch({ type: 'ADD_PONTO', payload: updatedPonto });
      dispatch({ type: 'SET_CURRENT_DAY_PONTO', payload: updatedPonto });
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
      
      console.log('Ponto salvo com sucesso:', updatedPonto);
      console.log('Total de pontos no estado:', state.pontos.length + 1);
    } catch (error) {
      console.error('Erro ao bater ponto:', error);
      throw error;
    }
  };

  const editarPonto = async (dia: string, horarios: string[]) => {
    if (!state.user) return;
    
    try {
      // Encontrar o ponto existente
      const pontoExistente = state.pontos.find(p => p.dia === dia);
      if (!pontoExistente) {
        throw new Error('Ponto não encontrado');
      }
      
      // Criar ponto atualizado
      const pontoAtualizado = {
        ...pontoExistente,
        horarios: horarios,
        totalTrabalhado: calculateHoursWorked(horarios),
      };
      
      // Salvar no storage
      await StorageService.addPonto(pontoAtualizado);
      
      // Atualizar o estado
      dispatch({ type: 'UPDATE_PONTO', payload: pontoAtualizado });
      
      // Se for o dia atual, atualizar também
      if (dia === getTodayString()) {
        dispatch({ type: 'SET_CURRENT_DAY_PONTO', payload: pontoAtualizado });
      }
      
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
      
      console.log('Ponto editado com sucesso:', pontoAtualizado);
    } catch (error) {
      console.error('Erro ao editar ponto:', error);
      throw error;
    }
  };

  const apagarPonto = async (dia: string) => {
    if (!state.user) return;
    
    try {
      // Remover do storage
      const pontosAtuais = await StorageService.getPontos();
      const pontosFiltrados = pontosAtuais.filter(p => p.dia !== dia);
      await StorageService.savePontos(pontosFiltrados);
      
      // Atualizar o estado
      dispatch({ type: 'REMOVE_PONTO', payload: dia });
      
      // Se for o dia atual, limpar também
      if (dia === getTodayString()) {
        dispatch({ type: 'SET_CURRENT_DAY_PONTO', payload: null });
      }
      
      dispatch({ type: 'CALCULATE_BANCO_HORAS' });
      
      console.log('Ponto apagado com sucesso:', dia);
    } catch (error) {
      console.error('Erro ao apagar ponto:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    baterPonto,
    loadInitialData,
    editarPonto,
    apagarPonto,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
