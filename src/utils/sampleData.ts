import { User, Ponto } from '../types';

export const sampleUser: User = {
  username: 'joao.silva',
  nome: 'João Silva',
  email: 'joao.silva@empresa.com',
  senha: '123456',
  saldoHorasInicial: 2.5,
};

export const samplePontos: Ponto[] = [
  {
    id: '1',
    dia: '2024-01-15',
    horarios: ['08:00', '12:00', '13:00', '17:00'],
    totalTrabalhado: 8.0,
  },
  {
    id: '2',
    dia: '2024-01-16',
    horarios: ['08:15', '12:30', '13:15', '17:30'],
    totalTrabalhado: 8.5,
  },
  {
    id: '3',
    dia: '2024-01-17',
    horarios: ['08:00', '12:00', '13:00', '17:00'],
    totalTrabalhado: 8.0,
  },
  {
    id: '4',
    dia: '2024-01-18',
    horarios: ['08:30', '12:00', '13:00', '17:30'],
    totalTrabalhado: 8.0,
  },
  {
    id: '5',
    dia: '2024-01-19',
    horarios: ['08:00', '12:00', '13:00', '17:00'],
    totalTrabalhado: 8.0,
  },
];

// Função para popular dados de exemplo
export const populateSampleData = async (storageService: any) => {
  try {
    await storageService.saveUser(sampleUser);
    await storageService.savePontos(samplePontos);
    console.log('Dados de exemplo carregados com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar dados de exemplo:', error);
  }
};
