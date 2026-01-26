import React from 'react';
import { BreathingExercise } from '../breathing/breathingConfig';
import type { Animated as AnimatedType } from 'react-native';

export interface HomeScreenProps {
  BREATHING_EXERCISES: BreathingExercise[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  isExerciseLocked: (index: number) => boolean;
  currentExercise: BreathingExercise;
  phaseLabel: string;
  remainingSeconds: number;
  isRunning: boolean;
  circleScale: AnimatedType.Value;
  rotateInterpolation: AnimatedType.AnimatedInterpolation<string>;
  rotateInverseInterpolation: AnimatedType.AnimatedInterpolation<string>;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isPremium: boolean | null;
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  priceLabel: string;
  onBuy: () => void;
  onRestore: () => void;
  AdBanner: React.ComponentType<any>;
  PremiumCard: React.ComponentType<any>;
  IS_DEV_MODE: boolean;
  DEBUG_clearPremium: () => void;
  setIsPremium: (isPremium: boolean) => void;
  Alert: any;
  historyCount: number;
  formatDuration: (seconds: number) => string;
}
import { View, Text, Animated, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LockedIcon } from '../ui/icon/LockedIcon';
import { HomeIcon } from '../ui/icon/HomeIcon';
import { PremiumIcon } from '../ui/icon/PremiumIcon';

// Recebe todas as props necessárias do App.tsx
export const HomeScreen: React.FC<HomeScreenProps> = ({
  BREATHING_EXERCISES,
  selectedIndex,
  setSelectedIndex,
  isExerciseLocked,
  currentExercise,
  phaseLabel,
  remainingSeconds,
  isRunning,
  circleScale,
  rotateInterpolation,
  rotateInverseInterpolation,
  start,
  pause,
  reset,
  isPremium,
  showPremiumModal,
  setShowPremiumModal,
  priceLabel,
  onBuy,
  onRestore,
  AdBanner,
  PremiumCard,
  IS_DEV_MODE,
  DEBUG_clearPremium,
  setIsPremium,
  Alert,
  historyCount,
  formatDuration
}) => {
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Respiração 1 Minuto</Text>
        <Text style={styles.subtitle}>Relaxe e respire profundamente.</Text>
      </View>
      {/* Carrossel de Exercícios */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rhythmCarousel}
        snapToInterval={90}
        decelerationRate="fast"
      >
        {BREATHING_EXERCISES.map((exercise: BreathingExercise, index: number) => {
          const locked = isExerciseLocked(index);
          const isLastExercise = index === BREATHING_EXERCISES.length - 1;
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
                  setShowPremiumModal(true);
                } else {
                  setSelectedIndex(index);
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
                { formatDuration(exercise.duration) }
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {/* Respiração Selecionada */}
      <View style={styles.rhythmSelected}>
        <Text style={styles.title}>{currentExercise.label}</Text>
        <Text style={styles.subtitle}>{currentExercise.description}</Text>
        <Text style={styles.subtitle}>{`${currentExercise.cycle} - ${formatDuration(currentExercise.duration)}`}</Text>
      </View>
      {/* Círculo central com contador */}
      <View style={styles.circleContainer}>
        <Animated.View 
          style={[
            styles.circleOuter,
            { 
              transform: [
                { rotate: rotateInterpolation },
                { scale: circleScale }
              ] 
            }
          ]}
        >
          <LinearGradient
            colors={['#00d4aa', '#00b8d4', '#0099cc', '#00d4aa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circleGradient}
          >
            <Animated.View 
              style={[
                styles.circleInner,
                { transform: [{ rotate: rotateInverseInterpolation }] }
              ]}
            >
              <Text style={styles.phaseText}>
                {phaseLabel}
              </Text>
              <Text style={styles.counterText}>{remainingSeconds}</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </View>
      {/* Botão Iniciar/Pausar */}
      <Pressable 
        style={styles.startBtn}
        onPress={() => {
          if (remainingSeconds === 0) {
            reset();
          } else if (isRunning) {
            pause();
          } else {
            start();
          }
        }}
      >
        <LinearGradient
          colors={isRunning ? ['#64b4ffe6', '#4682c8b3', '#1a5a8a'] : ['#1a5a8a', '#0d3a5a', '#0a2a4a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.startBtnGradient}
        >
          <Text style={styles.startBtnText}>
            {remainingSeconds === 0 ? 'Reiniciar' : isRunning ? 'Pausar' : 'Iniciar'}
          </Text>
        </LinearGradient>
      </Pressable>
      {/* Botão Reiniciar (Premium) */}
      {isPremium && (
        <Pressable 
          style={styles.resetBtn}
          onPress={() => {
            reset();
          }}
        >
          <Text style={styles.resetBtnText}>Reiniciar Contagem</Text>
        </Pressable>
      )}
      {/* AdBanner - só mostra se não for premium */}
      {!isPremium && (
        <AdBanner show={true} />
      )}

      {/* Modal Premium */}
      {showPremiumModal && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <View style={{
            backgroundColor: '#101828',
            borderRadius: 18,
            padding: 24,
            minWidth: 300,
            maxWidth: 340,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5
          }}>
            <PremiumCard
              isPremium={!!isPremium}
              priceLabel={priceLabel}
              onBuy={onBuy}
              onRestore={onRestore}
            />
            <Pressable
              style={{
                marginTop: 18,
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#4F8EF7',
                backgroundColor: 'transparent',
                alignSelf: 'center'
              }}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={{ color: '#4F8EF7', fontWeight: '600' }}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Botão de debug para limpar premium (dev mode) */}
      {IS_DEV_MODE && (
        <Pressable onPress={DEBUG_clearPremium}>
          <Text style={{ color: '#666', fontSize: 11, marginTop: 10, marginBottom: 12 }}>
            [DEBUG] Limpar Premium
          </Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 10,
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
  rhythmSelected: {
    alignItems: 'center',
    marginVertical: 12, 
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
  circleContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical: 20,
  },
  circleOuter: {
    width: 240, 
    height: 240,
    borderRadius: 120,
    padding: 6,
    shadowColor: '#00d4aa',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    padding: 6,
  },
  circleInner: {
    flex: 1,
    backgroundColor: '#0d2847',
    borderRadius: 114,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  phaseText: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: '500', 
    marginBottom: 8,
    letterSpacing: 0.5 
  },
  counterText: { 
    color: '#FFFFFF', 
    fontSize: 72, 
    fontWeight: '300',
    letterSpacing: 2 
  },
  startBtn: {
    marginVertical: 24,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#1a5a8a',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  startBtnGradient: {
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(100, 160, 220, 0.4)',
  },
  startBtnText: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: '600', 
    textAlign: 'center',
    letterSpacing: 1 
  },
  resetBtn: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(100, 180, 255, 0.5)',
    backgroundColor: 'rgba(50, 100, 150, 0.3)',
  },
  resetBtnText: {
    color: '#5ac8fa',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
