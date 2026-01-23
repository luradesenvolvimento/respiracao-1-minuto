import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { BreathingExercise, Phase, phaseLabel as labelFn } from "./breathingConfig";

function nextPhaseIndex(i: number, phases: Array<{ phase: Exclude<Phase, "DONE">; seconds: number }>) {
  return (i + 1) % phases.length;
}

export function useBreathing(exercise: BreathingExercise) {
  const { phases, duration } = exercise;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [phaseRemaining, setPhaseRemaining] = useState<number>(phases[0].seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circleScale = useRef(new Animated.Value(0.85)).current;

  const phase: Phase = useMemo(() => {
    if (remainingSeconds <= 0) return "DONE";
    return phases[phaseIndex].phase;
  }, [remainingSeconds, phaseIndex, phases]);

  const phaseLabel = useMemo(() => labelFn(phase), [phase]);

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
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
    stopTimer();
    setIsRunning(false);
    setRemainingSeconds(duration);
    setPhaseIndex(0);
    setPhaseRemaining(phases[0].seconds);
    circleScale.setValue(0.85);
  }

  function pause() {
    stopTimer();
    setIsRunning(false);
    circleScale.stopAnimation();
  }

  function start() {
    if (isRunning) return;
    setIsRunning(true);
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
            const newIndex = nextPhaseIndex(prevPI, phases);
            const newPhase = phases[newIndex].phase;
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
      setIsRunning(false);
      circleScale.stopAnimation();
    }
  }, [remainingSeconds]);

  useEffect(() => () => stopTimer(), []);

  return {
    phase,
    phaseLabel,
    remainingSeconds,
    isRunning,
    circleScale,
    start,
    pause,
    reset
  };
}
