
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BreathingStatus = "complete" | "partial" | "stopped";

export interface BreathingHistoryItem {
  id: string;
  state: string;
  label: string; // Ex: "4-4-4"
  duration: number; // duração total em segundos
  completedSeconds: number; // quanto tempo foi feito
  date: string; // ISO string
  status: BreathingStatus;
}

const HISTORY_KEY = 'breathing_history';

export async function addHistoryItem(item: BreathingHistoryItem) {
  const history = await getHistory();
  history.unshift(item);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function getHistory(): Promise<BreathingHistoryItem[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

// Para sincronização futura:
// - Adicione funções para enviar/receber histórico de um backend
// - Use o campo 'id' para identificar cada sessão única
