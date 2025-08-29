

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Converte horas decimais para formato HH:MM
export const formatHoursToHHMM = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Converte formato HH:MM para horas decimais
export const parseHHMMToHours = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};

// Verifica se é sexta-feira
export const isFriday = (date: Date): boolean => {
  return date.getDay() === 5; // 0 = Domingo, 5 = Sexta
};

// Retorna a meta de horas para o dia especificado
export const getMetaHoras = (date: Date): number => {
  return isFriday(date) ? 8 : 9;
};

// Retorna a meta de horas para hoje
export const getMetaHorasHoje = (): number => {
  return getMetaHoras(new Date());
};

export const calculateHoursWorked = (horarios: string[]): number => {
  if (horarios.length < 2) return 0;
  
  let totalHours = 0;
  for (let i = 0; i < horarios.length - 1; i += 2) {
    if (horarios[i + 1]) {
      const entrada = new Date(`2000-01-01T${horarios[i]}:00`);
      const saida = new Date(`2000-01-01T${horarios[i + 1]}:00`);
      const diffMs = saida.getTime() - entrada.getTime();
      totalHours += diffMs / (1000 * 60 * 60);
    }
  }
  
  return Math.round(totalHours * 100) / 100; // Arredonda para 2 casas decimais
};

export const canBaterPonto = (horarios: string[]): boolean => {
  return horarios.length < 8;
};

export const getProgressPercentage = (horarios: string[], date?: Date): number => {
  const horasTrabalhadas = calculateHoursWorked(horarios);
  const metaHoras = date ? getMetaHoras(date) : getMetaHorasHoje();
  return Math.min((horasTrabalhadas / metaHoras) * 100, 100);
};

// Formata duração para exibição mais elegante
export const formatDuration = (hours: number): string => {
  if (hours === 0) return '00:00';
  
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) {
    return `${m.toString().padStart(2, '0')}min`;
  } else if (m === 0) {
    return `${h}h`;
  } else {
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  }
};
