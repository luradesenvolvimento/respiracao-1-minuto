import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BreathingExercise } from '../breathing/breathingConfig';

interface SelectedExerciseProps {
  exercise: BreathingExercise;
  formatDuration: (seconds: number) => string;
}

export const SelectedExercise: React.FC<SelectedExerciseProps> = ({ exercise, formatDuration }) => {
  return (
    <View style={styles.rhythmSelected}>
      <Text style={styles.title}>{exercise.label}</Text>
      <Text style={styles.subtitle}>{exercise.description}</Text>
      <Text style={styles.subtitle}>{`${exercise.cycle} - ${formatDuration(exercise.duration)}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rhythmSelected: {
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.3
  },
  subtitle: {
    color: "#a8c0d8",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },
});