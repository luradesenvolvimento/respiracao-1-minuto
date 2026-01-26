


import React, { useEffect, useState } from "react";
import { BREATHING_EXERCISES, BreathingExercise } from "./src/breathing/breathingConfig";
import { addHistoryItem, getHistory } from "./src/breathing/breathingHistory";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AdBanner } from "./src/monetization/AdBanner";
import { useBreathing } from "./src/breathing/useBreathing";
import { Header } from "./src/ui/Header";
import { SelectedExercise } from "./src/ui/SelectedExercise";
import { BreathingCircle } from "./src/ui/BreathingCircle";
import { ControlButtons } from "./src/ui/ControlButtons";
import { PremiumModal } from "./src/ui/PremiumModal";
import { TabBar } from "./src/ui/TabBar";
import { ExerciseCarousel } from "./src/ui/ExerciseCarousel";
import { DevDebugButton } from "./src/ui/DevDebugButton";

import {
  initIAP,
  endIAP, 
  getLocalPremium,
  getPremiumProduct,
  buyPremium,
  restorePremium,
  DEBUG_clearPremium,
  IS_DEV_MODE
} from "./src/premium/premium";

function App() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // ...existing code...
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [priceLabel, setPriceLabel] = useState("R$ 4,99");
  const [historyCount, setHistoryCount] = useState<number>(0);

  // Estado para seleção de exercício (índice do BREATHING_EXERCISES)
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState<'respiracao'|'historico'|'premium'|'config'>('respiracao');

  // Usar o exercício selecionado diretamente do BREATHING_EXERCISES
  const currentExercise = BREATHING_EXERCISES[selectedIndex];
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      const local = await getLocalPremium();
      if (mounted) setIsPremium(local);
      try {
        await initIAP();
        const product = await getPremiumProduct();
        if (product && "displayPrice" in product && mounted) {
          setPriceLabel((product as any).displayPrice);
        }
      } catch (e) {}
      // Carrega histórico para sugestão de upgrade
      const history = await getHistory();
      setHistoryCount(history.length);
    })();
    return () => {
      mounted = false;
      endIAP();
    };
  }, []);

  async function onBuy() {
    try {
      await buyPremium();
      setIsPremium(true);
      Alert.alert("Obrigado 💙", "Premium ativado! Você apoiou o app.");
    } catch (e: any) {
      const msg = e?.message || "Não foi possível concluir a compra.";
      Alert.alert("Compra não concluída", msg);
    }
  }

  // Adiciona ao histórico ao concluir uma sessão
  // Recebe o exercício usado como parâmetro
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

  async function onRestore() {
    try {
      const ok = await restorePremium();
      if (ok) {
        setIsPremium(true);
        Alert.alert("Restaurado ✨", "Sua compra foi restaurada.");
      } else {
        Alert.alert("Nada para restaurar", "Não encontramos compra associada.");
      }
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Falha ao restaurar.");
    }
  }
  
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

  // Formatar duração em minutos
  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#0a1628', '#0d2847', '#1a4a7a', '#0d2847', '#0a1628']}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeContent}>
          <View style={styles.container}>

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
              onPremiumPress={() => setShowPremiumModal(true)}
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

            {/* Modal Premium */}
            <PremiumModal
              visible={showPremiumModal}
              onClose={() => setShowPremiumModal(false)}
              isPremium={isPremium}
              priceLabel={priceLabel}
              onBuy={onBuy}
              onRestore={onRestore}
            />

            {/* Ads: só para NÃO premium */}
            <AdBanner 
              show={isPremium === false} 
            />

            {/* DEBUG: Só aparece em desenvolvimento (Expo Go) */}
            <DevDebugButton
              isPremium={isPremium}
              onPremiumChange={setIsPremium}
            />
          </View>

          {/* Bottom Tab Bar */}
          <TabBar
            activeTab={activeTab}
            onTabPress={(tab) => {
              setActiveTab(tab);
              if (tab === 'premium') {
                setShowPremiumModal(true);
              }
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#0a1628" 
  },
  gradientBackground: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
});

export default App;

