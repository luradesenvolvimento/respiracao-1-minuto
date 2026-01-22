import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { PHASES, TOTAL_SECONDS, Phase, phaseLabel as labelFn } from "./breathingConfig";

function nextPhaseIndex(i: number) {
  return (i + 1) % PHASES.length;
}

export function useBreathing() {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // fase atual é index em PHASES (INHALE/HOLD/EXHALE)
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [phaseRemaining, setPhaseRemaining] = useState<number>(PHASES[0].seconds);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // animação do círculo (escala)
  const circleScale = useRef(new Animated.Value(0.85)).current;

  const phase: Phase = useMemo(() => {
    if (remainingSeconds <= 0) return "DONE";
    return PHASES[phaseIndex].phase;
  }, [remainingSeconds, phaseIndex]);

  const phaseLabel = useMemo(() => labelFn(phase), [phase]);

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function animateForPhase(p: Exclude<Phase, "DONE">) {
    const seconds = PHASES.find(x => x.phase === p)?.seconds ?? 1;

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
    setRemainingSeconds(TOTAL_SECONDS);
    setPhaseIndex(0);
    setPhaseRemaining(PHASES[0].seconds);
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

    // sincroniza animação com a fase atual
    const currentPhase = PHASES[phaseIndex].phase;
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
            const newIndex = nextPhaseIndex(prevPI);
            const newPhase = PHASES[newIndex].phase;
            animateForPhase(newPhase);
            return newIndex;
          });
          // O tempo será sincronizado pelo useEffect abaixo
          return 0;
        }
        return nextPR;
      });
    }, 1000);
  }
  
  // Sincroniza o tempo da fase sempre que o índice muda
  useEffect(() => {
    setPhaseRemaining(PHASES[phaseIndex].seconds);
  }, [phaseIndex]);

  // quando termina, para tudo e marca DONE
  useEffect(() => {
    if (remainingSeconds === 0) {
      stopTimer();
      setIsRunning(false);
      circleScale.stopAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds]);

  // cleanup
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
