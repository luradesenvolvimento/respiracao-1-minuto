import React, { useEffect, useState, useRef } from "react";
import { BREATHING_EXERCISES, BreathingExercise } from "../breathing/breathingConfig";
import { addHistoryItem, getHistory } from "../breathing/breathingHistory";
import { View, Alert, AppState, AppStateStatus } from "react-native";
import { useBreathing } from "../breathing/useBreathing";
import { Header } from "../ui/Header";
import { SelectedExercise } from "../ui/SelectedExercise";
import { BreathingCircle } from "../ui/BreathingCircle";
import { ControlButtons } from "../ui/ControlButtons";
import { ExerciseCarousel } from "../ui/ExerciseCarousel";
import { AdBanner } from "../monetization/AdBanner";
import { DevDebugButton } from "../ui/DevDebugButton";

interface HomeScreenProps {
  isPremium: boolean | null;
  onShowPremiumModal: () => void;
  onPremiumChange: (isPremium: boolean) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isPremium,
  onShowPremiumModal,
  onPremiumChange
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [historyCount, setHistoryCount] = useState<number>(0);

  // Usar o exercício selecionado diretamente do BREATHING_EXERCISES
  const currentExercise = BREATHING_EXERCISES[selectedIndex];

  // Hook de respiração
  const {
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
  } = useBreathing(currentExercise, {
    onBreathComplete: async () => {
      // called everytime a full breath cycle finishes (EXHALE completed)
      // record a completed breath in history
      const breathDuration = currentExercise.phases.reduce((s, p) => s + p.seconds, 0);
      await addHistoryItem({
        id: `${Date.now()}`,
        state: currentExercise.state,
        duration: breathDuration,
        date: new Date().toISOString(),
        completed: true,
        stoppedAt: breathDuration
      });
      const history = await getHistory();
      setHistoryCount(history.length);
    }
  });

  // Quando terminar a sessão
  useEffect(() => {
    if (remainingSeconds === 0 && !isRunning) {
      onSessionEnd(currentExercise);
    }
  }, [remainingSeconds, isRunning]);

  // Reset quando trocar de exercício
  useEffect(() => {
    reset();
  }, [selectedIndex]);

  // Adiciona ao histórico ao concluir uma sessão
  async function onSessionEnd(exercise: BreathingExercise) {
    await addHistoryItem({
      id: `${Date.now()}`,
      state: exercise.state,
      duration: exercise.duration,
      date: new Date().toISOString(),
      completed: true,
      stoppedAt: exercise.duration
    });
    const history = await getHistory();
    setHistoryCount(history.length);
  }

  // We'll record incomplete session entries only on reset, exit (unmount) or app background.
  // Pausar NÃO registra nada.
  const hasRecordedOnExitRef = useRef(false);

  async function recordIncompleteIfNeeded() {
    try {
      if (hasRecordedOnExitRef.current) return;
      if (remainingSeconds === 0 || remainingSeconds === currentExercise.duration) return;

      // Record an incomplete BREATH entry at the current point in the breath
      const breathDuration = currentExercise.phases.reduce((s, p) => s + p.seconds, 0);
      const phases = currentExercise.phases;
      const elapsedBeforePhase = phases.slice(0, phaseIndex).reduce((s, p) => s + p.seconds, 0);
      const currentPhaseSeconds = phases[phaseIndex]?.seconds ?? 0;
      const elapsedInPhase = currentPhaseSeconds - phaseRemaining;
      const elapsedInBreath = Math.max(0, elapsedBeforePhase + elapsedInPhase);

      await addHistoryItem({
        id: `${Date.now()}`,
        state: currentExercise.state,
        duration: breathDuration,
        date: new Date().toISOString(),
        completed: false,
        stoppedAt: elapsedInBreath
      });
      const history = await getHistory();
      setHistoryCount(history.length);
      hasRecordedOnExitRef.current = true;
    } catch (e) {
      // swallow errors to avoid blocking unmount/background
    }
  }

  // Register AppState listener to record when app goes to background/inactive
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        // fire and forget
        recordIncompleteIfNeeded();
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
      // also record once more on unmount/navigation away
      // don't await in cleanup
      recordIncompleteIfNeeded();
    };
  }, [remainingSeconds, phaseIndex, phaseRemaining, currentExercise]);

  // Formatar duração em minutos
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 40, paddingHorizontal: 16 }}>
      {/* Header */}
      <Header
        title="Respiração 1 Minuto"
        subtitle="Relaxe e respire profundamente."
      />

      {/* Carrossel de Exercícios */}
      <ExerciseCarousel
        selectedIndex={selectedIndex}
        isPremium={isPremium}
        onExerciseSelect={setSelectedIndex}
        onPremiumPress={onShowPremiumModal}
        formatDuration={formatDuration}
      />

      {/* Respiração Selecionada */}
      <SelectedExercise
        exercise={currentExercise}
        formatDuration={formatDuration}
      />

      {/* Círculo central com contador */}
      <BreathingCircle
        phaseLabel={phaseLabel}
        remainingSeconds={remainingSeconds}
        circleScale={circleScale}
        circleRotation={circleRotation}
      />

      {/* Botões de Controle */}
        <ControlButtons
        remainingSeconds={remainingSeconds}
        isRunning={isRunning}
        isPremium={isPremium}
        onStartPause={async () => {
          if (remainingSeconds === 0) {
            reset();
          } else if (isRunning) {
            // apenas pausar — não gravamos nada aqui
            pause();
          } else {
            // starting a new session -> allow future exit-recordings again
            hasRecordedOnExitRef.current = false;
            start();
          }
        }}
        onReset={async () => {
          // se reset for chamado durante uma sessão (não completa), gravar como incompleta
          if (remainingSeconds > 0 && remainingSeconds < currentExercise.duration) {
            await recordIncompleteIfNeeded();
          }
          // reset guard so next session can record on exit again
          hasRecordedOnExitRef.current = false;
          reset();
        }}
      />

      {/* Ads: só para NÃO premium */}
      <AdBanner
        show={isPremium === false}
      />

      {/* DEBUG: Só aparece em desenvolvimento (Expo Go) */}
      <DevDebugButton
        isPremium={isPremium}
        onPremiumChange={onPremiumChange}
      />
    </View>
  );
};