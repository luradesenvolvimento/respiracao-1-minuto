import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getHistory, BreathingHistoryItem } from '../breathing/breathingHistory';
import { HistoryIcon } from '../ui/icon/HistoryIcon';
import { HomeIcon } from '../ui/icon/HomeIcon';
import { PremiumIcon } from '../ui/icon/PremiumIcon';

function groupByDay(history: BreathingHistoryItem[]) {
  const days: { [date: string]: BreathingHistoryItem[] } = {};
  history.forEach(item => {
    const day = item.date.slice(0, 10); // yyyy-mm-dd
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });
  return days;
}

function getDayLabel(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const diff = (today.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / (1000*60*60*24);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatSeconds(sec: number) {
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min}:${s.toString().padStart(2, '0')}`;
}

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<BreathingHistoryItem[]>([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  const grouped = groupByDay(history);
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>Veja seu progresso de respiração.</Text>
      {days.map(day => (
        <View key={day} style={styles.dayGroup}>
          <Text style={styles.dayLabel}>{getDayLabel(day)}</Text>
          {grouped[day].map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.iconCol}>
                {item.status === 'complete' ? (
                  <HomeIcon width={22} height={22} color="#5ac8fa" />
                ) : item.status === 'partial' ? (
                  <HistoryIcon width={22} height={22} color="#a0b8d0" />
                ) : (
                  <PremiumIcon width={22} height={22} color="#f7b24f" />
                )}
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.time}>{formatTime(item.date)}</Text>
                {item.status === 'complete' ? (
                  <Text style={styles.status}>Completo</Text>
                ) : (
                  <Text style={styles.status}>Parou aos {formatSeconds(item.completedSeconds)}</Text>
                )}
                {/* Barra de progresso para sessões parciais */}
                {item.status === 'partial' && (
                  <View style={styles.progressBarRow}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFg, { width: `${Math.round(100 * item.completedSeconds / item.duration)}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>{formatSeconds(0)}</Text>
                    <Text style={styles.progressLabel}>{formatSeconds(item.completedSeconds)}</Text>
                    <Text style={styles.progressLabel}>{formatSeconds(item.duration)}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  subtitle: { color: '#a8c0d8', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  dayGroup: { marginBottom: 18 },
  dayLabel: { color: '#b7c6e6', fontSize: 16, marginBottom: 8, marginTop: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(20,40,80,0.18)', borderRadius: 10, padding: 8 },
  iconCol: { marginRight: 10 },
  infoCol: { flex: 1 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
  time: { color: '#a0b8d0', fontSize: 13 },
  status: { color: '#5ac8fa', fontSize: 13, fontWeight: '500' },
  progressBarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#233a5a', borderRadius: 6, marginHorizontal: 6, overflow: 'hidden' },
  progressBarFg: { height: 8, backgroundColor: '#5ac8fa', borderRadius: 6 },
  progressLabel: { color: '#a0b8d0', fontSize: 10, marginHorizontal: 2 },
});

export default HistoryScreen;
