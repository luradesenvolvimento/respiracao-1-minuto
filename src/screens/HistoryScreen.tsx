import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getHistory, BreathingHistoryItem } from "../breathing/breathingHistory";
import { BREATHING_EXERCISES } from "../breathing/breathingConfig";
import { Header } from "../ui/Header";

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<BreathingHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const historyData = await getHistory();
    setHistory(historyData);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  const getExerciseName = (state: string) => {
    const exercise = BREATHING_EXERCISES.find(ex => ex.state === state);
    return exercise ? exercise.label : state;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle="Suas sessões de respiração"
      />

      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhuma sessão registrada ainda.</Text>
            <Text style={styles.emptySubtext}>Comece a respirar para ver seu histórico aqui!</Text>
          </View>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.exerciseName}>{getExerciseName(item.state)}</Text>
                <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  historyList: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#a8c0d8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyItem: {
    backgroundColor: 'rgba(50, 100, 150, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(80, 130, 180, 0.3)',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    color: '#5ac8fa',
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    color: '#a8c0d8',
    fontSize: 12,
  },
});