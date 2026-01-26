import React from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { BreathingExercise } from '../breathing/breathingConfig';
import { LockedIcon } from './icon/LockedIcon';

interface BreathingExerciseSelectorProps {
  exercises: BreathingExercise[];
  selectedIndex: number;
  isPremium: boolean | null;
  onSelectExercise: (index: number) => void;
  onShowPremium: () => void;
}

export const BreathingExerciseSelector: React.FC<BreathingExerciseSelectorProps> = ({
  exercises,
  selectedIndex,
  isPremium,
  onSelectExercise,
  onShowPremium,
}) => {
  // Primeiro exercício é gratuito, os outros são premium
  const isExerciseLocked = (index: number) => index > 0 && !isPremium;

  // Formatar duração em minutos
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rhythmCarousel}
      snapToInterval={90}
      decelerationRate="fast"
    >
      {exercises.map((exercise, index) => {
        const locked = isExerciseLocked(index);
        return (
          <Pressable
            key={exercise.state}
            style={[
              styles.rhythmBtn,
              selectedIndex === index && styles.rhythmBtnActive,
              locked && styles.rhythmBtnLocked
            ]}
            onPress={() => {
              if (locked) {
                onShowPremium();
              } else {
                onSelectExercise(index);
              }
            }}
          >
            {/* Cadeado para exercícios bloqueados */}
            {locked && (
              <View style={styles.lockIconSmall}>
                <LockedIcon width={14} height={14} color="#ccd0a0ff" />
              </View>
            )}
            <Text style={[styles.rhythmLabel, locked && styles.rhythmLabelLocked]}>
              {exercise.label}
            </Text>
            <Text style={[styles.rhythmLabel, locked && styles.rhythmLabelLocked]}>
              {exercise.cycle}
            </Text>
            <Text style={[styles.rhythmSublabel, locked && styles.rhythmLabelLocked]}>
              {formatDuration(exercise.duration)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rhythmCarousel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    height: 72,
  },
  rhythmBtn: {
    backgroundColor: 'rgba(50, 100, 150, 0.5)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    borderWidth: 1.5,
    borderColor: 'rgba(80, 130, 180, 0.5)',
    position: 'relative',
    marginRight: 6,
  },
  rhythmBtnActive: {
    backgroundColor: 'rgba(70, 130, 200, 0.7)',
    borderColor: 'rgba(100, 180, 255, 0.9)',
    borderWidth: 2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  rhythmBtnLocked: {
    opacity: 0.85,
    backgroundColor: 'rgba(40, 70, 110, 0.4)',
  },
  rhythmLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
  },
  rhythmSublabel: {
    color: '#a0b8d0',
    fontSize: 10,
    fontWeight: '400',
    marginTop: 0,
    textAlign: 'center',
  },
  rhythmLabelLocked: {
    color: '#7a9ab5'
  },
  lockIconSmall: {
    position: 'absolute',
    top: 6,
    right: 8,
    opacity: 0.9,
  },
});