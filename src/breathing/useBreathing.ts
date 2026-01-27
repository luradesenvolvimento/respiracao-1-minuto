import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { BreathingExercise, Phase, phaseLabel as labelFn } from "./breathingConfig";

function nextPhaseIndex(i: number, phases: Array<{ phase: Exclude<Phase, "DONE">; seconds: number }>) {
  return (i + 1) % phases.length;
}

export function useBreathing(exercise: BreathingExercise, handlers?: { onBreathComplete?: () => void }) {
  const { phases, duration } = exercise;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [phaseRemaining, setPhaseRemaining] = useState<number>(phases[0].seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circleScale = useRef(new Animated.Value(0.85)).current;
  const circleRotation = useRef(new Animated.Value(0)).current;
  const rotationAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const resettingRef = useRef<boolean>(false);

  const phase: Phase = useMemo(() => {
    if (remainingSeconds <= 0) return "DONE";
    return phases[phaseIndex].phase;
  }, [remainingSeconds, phaseIndex, phases]);

  const phaseLabel = useMemo(() => labelFn(phase), [phase]);

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function startRotation() {
    // Para rotação contínua durante a sessão
    rotationAnimRef.current = Animated.loop(
      Animated.timing(circleRotation, {
        toValue: 1,
        duration: 8000, // Uma rotação completa a cada 8 segundos
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    rotationAnimRef.current.start();
  }

  function stopRotation() {
    if (rotationAnimRef.current) {
      rotationAnimRef.current.stop();
      rotationAnimRef.current = null;
    }
  }

  function animateForPhase(p: Exclude<Phase, "DONE">) {
    const seconds = phases.find(x => x.phase === p)?.seconds ?? 1;
    Animated.timing(circleScale, {
      toValue: p === "INHALE" ? 1.15 : p === "EXHALE" ? 0.85 : 1.15,
      duration: seconds * 1000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true
    }).start();
  }

  function reset() {
    // Prevent concurrent resets which can cause animation conflicts
    if (resettingRef.current) return;
    resettingRef.current = true;

    stopTimer();
    stopRotation();
    setIsRunning(false);
    setRemainingSeconds(duration);
    setPhaseIndex(0);
    setPhaseRemaining(phases[0].seconds);

    // Stop any running scale animation, then force value to base
    try {
      circleScale.stopAnimation(() => {
        circleScale.setValue(0.85);
      });
    } catch (e) {
      // In case stopAnimation isn't available or fails, fallback to setValue
      try { circleScale.setValue(0.85); } catch {}
    }

    // Stop rotation animation and reset value. Use stopAnimation to ensure
    // any native animation is halted before setting the value.
    try {
      circleRotation.stopAnimation(() => {
        circleRotation.setValue(0);
        resettingRef.current = false;
      });
    } catch (e) {
      try { circleRotation.setValue(0); } catch {}
      resettingRef.current = false;
    }
  }

  function pause() {
    stopTimer();
    stopRotation();
    setIsRunning(false);
    circleScale.stopAnimation();
  }

  function start() {
    if (isRunning) return;
    setIsRunning(true);
    startRotation();
    const currentPhase = phases[phaseIndex].phase;
    animateForPhase(currentPhase);
    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
      setPhaseRemaining(prevPR => {
        const nextPR = prevPR - 1;
        if (nextPR <= 0) {
          setPhaseIndex(prevPI => {
            // prevPI is the phase index that's finishing now
            const finishingPhase = phases[prevPI].phase;
            const newIndex = nextPhaseIndex(prevPI, phases);
            const newPhase = phases[newIndex].phase;
            // If we finished an EXHALE, that means a full breath cycle completed
            if (finishingPhase === 'EXHALE') {
              try {
                handlers?.onBreathComplete?.();
              } catch (e) {
                // swallow errors from handlers to avoid breaking the timer
                // handler is responsible for its own async work
              }
            }
            animateForPhase(newPhase);
            return newIndex;
          });
          return 0;
        }
        return nextPR;
      });
    }, 1000);
  }

  useEffect(() => {
    setPhaseRemaining(phases[phaseIndex].seconds);
  }, [phaseIndex, phases]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      stopTimer();
      stopRotation();
      setIsRunning(false);
      circleScale.stopAnimation();
    }
  }, [remainingSeconds]);

  useEffect(() => () => {
    stopTimer();
    stopRotation();
  }, []);

  return {
    phase,
    phaseLabel,
    remainingSeconds,
    isRunning,
    circleScale,
    circleRotation,
    phaseIndex,
    phaseRemaining,
    start,
    pause,
    reset
  };
}
