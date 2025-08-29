export interface User {
  username: string;
  nome: string;
  email: string;
  senha: string;
  saldoHorasInicial: number;
}

export interface Ponto {
  id: string;
  dia: string; // formato: YYYY-MM-DD
  horarios: string[]; // formato: HH:MM
  totalTrabalhado: number; // em horas
}

export interface BancoHoras {
  saldoInicial: number;
  horasTrabalhadas: number;
  horasPrevistas: number;
  saldoAtual: number;
}

export interface DayProgress {
  dia: string;
  pontos: Ponto;
  progresso: number; // 0-100
  metaHoras: number;
}
