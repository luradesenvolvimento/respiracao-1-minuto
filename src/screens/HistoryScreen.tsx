import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getHistory, BreathingHistoryItem } from "../breathing/breathingHistory";
import { BREATHING_EXERCISES } from "../breathing/breathingConfig";
import { Header } from "../ui/Header";

// Icon mapping per state
const getIconForState = (state: string) => {
  switch (state) {
    case "ANXIETY_RELIEF": return "↑"; // arrow up
    case "STRESS_RELEASE": return "⏱"; // clock
    case "GROUNDING":
    case "GROUNDING1": return "✓"; // checkmark
    case "FOCUS_CLARITY": return "⭐"; // star
    case "SLEEP_CALM": return "🏠"; // home
    default: return "◉";
  }
};

interface GroupedHistory {
  sectionTitle: string;
  items: BreathingHistoryItem[];
}

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<BreathingHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const historyData = await getHistory();
    setHistory(historyData);
  };

  // Group history by date sections
  const groupByDate = (items: BreathingHistoryItem[]): GroupedHistory[] => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const groups: { [key: string]: BreathingHistoryItem[] } = {};

    items.forEach(item => {
      const itemDate = new Date(item.date);
      const itemStart = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      let key: string;
      if (itemStart.getTime() === todayStart.getTime()) {
        key = "Hoje";
      } else if (itemStart.getTime() === yesterdayStart.getTime()) {
        key = "Ontem";
      } else {
        // Format as "22 de abril"
        key = itemDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    // Convert to array and preserve order (Hoje, Ontem, older dates)
    const result: GroupedHistory[] = [];
    if (groups["Hoje"]) result.push({ sectionTitle: "Hoje", items: groups["Hoje"] });
    if (groups["Ontem"]) result.push({ sectionTitle: "Ontem", items: groups["Ontem"] });
    
    // Add other dates sorted descending
    Object.keys(groups)
      .filter(k => k !== "Hoje" && k !== "Ontem")
      .sort((a, b) => {
        // parse back to compare
        const aDate = groups[a][0] ? new Date(groups[a][0].date) : new Date(0);
        const bDate = groups[b][0] ? new Date(groups[b][0].date) : new Date(0);
        return bDate.getTime() - aDate.getTime();
      })
      .forEach(k => {
        result.push({ sectionTitle: k, items: groups[k] });
      });

    return result;
  };

  const getExerciseName = (state: string) => {
    const exercise = BREATHING_EXERCISES.find(ex => ex.state === state);
    return exercise ? exercise.label : state;
  };

  const getCycle = (state: string) => {
    const exercise = BREATHING_EXERCISES.find(ex => ex.state === state);
    return exercise ? exercise.cycle : "";
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    
    // For older, show time
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatStoppedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const grouped = groupByDate(history);

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle="Veja seu progresso de respiração."
      />

      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhuma sessão registrada ainda.</Text>
            <Text style={styles.emptySubtext}>Comece a respirar para ver seu histórico aqui!</Text>
          </View>
        ) : (
          grouped.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.sectionTitle}</Text>
              {group.items.map((item) => {
                const isComplete = item.completed ?? true; // default to complete for old entries
                const stoppedAt = item.stoppedAt ?? item.duration;
                const progress = item.duration > 0 ? (stoppedAt / item.duration) : 1;

                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.itemRow}>
                      {/* Icon */}
                      <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{getIconForState(item.state)}</Text>
                      </View>

                      {/* Main content */}
                      <View style={styles.itemContent}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.exerciseName}>
                            {getExerciseName(item.state)} {getCycle(item.state)}
                          </Text>
                          {isComplete ? (
                            <View style={styles.completeTag}>
                              <Text style={styles.completeIcon}>✓</Text>
                              <Text style={styles.completeText}>Completo</Text>
                            </View>
                          ) : (
                            <Text style={styles.stoppedText}>
                              Parou aos {formatStoppedTime(stoppedAt)}
                            </Text>
                          )}
                        </View>

                        <Text style={styles.relativeTime}>{getRelativeTime(item.date)}</Text>

                        {/* Progress bar for incomplete */}
                        {!isComplete && (
                          <View style={styles.progressContainer}>
                            <View style={styles.progressBarBg}>
                              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                            </View>
                            <View style={styles.progressLabels}>
                              <Text style={styles.progressLabel}>0:00</Text>
                              <Text style={styles.progressLabel}>{formatStoppedTime(stoppedAt)}</Text>
                              <Text style={styles.progressLabel}>{formatStoppedTime(item.duration)}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#7a9cba',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  historyItem: {
    backgroundColor: 'rgba(30, 50, 80, 0.4)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(80, 130, 180, 0.2)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 200, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: '#5ac8fa',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  completeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 200, 250, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completeIcon: {
    color: '#5ac8fa',
    fontSize: 12,
    marginRight: 4,
  },
  completeText: {
    color: '#5ac8fa',
    fontSize: 12,
    fontWeight: '600',
  },
  stoppedText: {
    color: '#a8c0d8',
    fontSize: 12,
    fontWeight: '500',
  },
  relativeTime: {
    color: '#7a9cba',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(80, 130, 180, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5ac8fa',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    color: '#7a9cba',
    fontSize: 10,
  },
});