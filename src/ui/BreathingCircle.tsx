import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BreathingCircleProps {
  phaseLabel: string;
  remainingSeconds: number;
  circleScale: Animated.AnimatedInterpolation<string | number>;
  circleRotation: Animated.AnimatedInterpolation<string | number>;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phaseLabel,
  remainingSeconds,
  circleScale,
  circleRotation,
}) => {
  // Interpolação da rotação para graus
  const rotateInterpolation = circleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Rotação inversa para manter o texto estático
  const rotateInverseInterpolation = circleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  });

  return (
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
  );
};

const styles = StyleSheet.create({
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
});