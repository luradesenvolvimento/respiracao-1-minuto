import React, { useEffect, useState } from "react";
import { BREATHING_EXERCISES, BreathingExercise } from "../breathing/breathingConfig";
import { addHistoryItem, getHistory } from "../breathing/breathingHistory";
import { View, Alert } from "react-native";
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
    start,
    pause,
    reset
  } = useBreathing(currentExercise);

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
      date: new Date().toISOString()
    });
    const history = await getHistory();
    setHistoryCount(history.length);
  }

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
        onStartPause={() => {
          if (remainingSeconds === 0) {
            reset();
          } else if (isRunning) {
            pause();
          } else {
            start();
          }
        }}
        onReset={reset}
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