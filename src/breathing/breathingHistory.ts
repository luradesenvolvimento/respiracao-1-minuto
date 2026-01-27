import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BreathingHistoryItem {
  id: string;
  state: string;
  duration: number; // configured total duration (seconds)
  date: string; // ISO string when the session was recorded
  completed: boolean; // true if the session reached the end
  // stoppedAt: seconds elapsed from the start when the session stopped.
  // If completed === true, stoppedAt should be equal to duration.
  stoppedAt?: number | null;
}

const HISTORY_KEY = 'breathing_history';
const MAX_HISTORY = 90;

export async function addHistoryItem(item: BreathingHistoryItem) {
  const history = await getHistory();
  history.unshift(item);
  // enforce max history length: remove oldest entries beyond MAX_HISTORY
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY); // remove items starting at index MAX_HISTORY
  }
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
