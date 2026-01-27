import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ControlButtonsProps {
  remainingSeconds: number;
  isRunning: boolean;
  isPremium: boolean | null;
  // allow handler to return a Promise (we call async wrappers sometimes)
  onStartPause: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  remainingSeconds,
  isRunning,
  isPremium,
  onStartPause,
  onReset
}) => {
  return (
    <>
      {/* Botão Iniciar/Pausar */}
      <Pressable
        style={styles.startBtn}
        onPress={onStartPause}
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
          onPress={onReset}
        >
          <Text style={styles.resetBtnText}>Reiniciar Contagem</Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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