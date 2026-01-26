import React, { useEffect, useState } from "react";
import { BREATHING_EXERCISES, BreathingExercise } from "../breathing/breathingConfig";
import { addHistoryItem, getHistory } from "../breathing/breathingHistory";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Alert, Modal, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AdBanner } from "../monetization/AdBanner";
import { PremiumCard } from "../premium/PremiumCard";
import { useBreathing } from "../breathing/useBreathing";
import { BreathingExerciseSelector } from "../ui/BreathingExerciseSelector";
import { BreathingCircle } from "../ui/BreathingCircle";
import { TabBar } from "../ui/TabBar";
import {
  initIAP,
  endIAP,
  getLocalPremium,
  getPremiumProduct,
  buyPremium,
  restorePremium,
  DEBUG_clearPremium,
  IS_DEV_MODE
} from "../premium/premium";

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
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
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F8EF7',
    backgroundColor: 'transparent',
    alignSelf: 'center'
  }
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  gradientBackground: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#a0b8d0',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 2,
  },
  rhythmSelected: {
    alignItems: 'center',
    marginVertical: 12,
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
    letterSpacing: 1,
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
  debugBtn: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [priceLabel, setPriceLabel] = useState("R$ 4,99");
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'respiracao'|'historico'|'premium'|'config'>('respiracao');
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

  useEffect(() => {
    if (remainingSeconds === 0 && !isRunning) {
      onSessionEnd(currentExercise);
    }
  }, [remainingSeconds, isRunning]);

  useEffect(() => {
    reset();
  }, [selectedIndex]);

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
            <View style={styles.header}>
              <Text style={styles.title}>Respiração 1 Minuto</Text>
              <Text style={styles.subtitle}>Relaxe e respire profundamente.</Text>
            </View>

            {/* Carrossel de Exercícios */}
            <BreathingExerciseSelector
              selectedIndex={selectedIndex}
              isPremium={isPremium}
              onSelectExercise={setSelectedIndex}
              onShowPremiumModal={() => setShowPremiumModal(true)}
            />

            {/* Respiração Selecionada */}
            <View style={styles.rhythmSelected}>
              <Text style={styles.title}>{currentExercise.label}</Text>
              <Text style={styles.subtitle}>{currentExercise.description}</Text>
              <Text style={styles.subtitle}>{`${currentExercise.cycle} - ${Math.floor(currentExercise.duration / 60)} min`}</Text>
            </View>

            {/* Círculo central com contador */}
            <BreathingCircle
              phaseLabel={phaseLabel}
              remainingSeconds={remainingSeconds}
              circleScale={circleScale}
              circleRotation={circleRotation}
            />

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

            {/* Modal Premium */}
            <Modal
              visible={showPremiumModal}
              animationType="slide"
              transparent
              onRequestClose={() => setShowPremiumModal(false)}
            >
              <View style={modalStyles.overlay}>
                <View style={modalStyles.cardContainer}>
                  <PremiumCard
                    isPremium={isPremium ?? false}
                    priceLabel={priceLabel}
                    onBuy={onBuy}
                    onRestore={onRestore}
                  />
                  <Pressable onPress={() => setShowPremiumModal(false)} style={modalStyles.closeBtn}>
                    <Text style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15 }}>Fechar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {/* Ads: só para NÃO premium */}
            <AdBanner show={isPremium === false} />

            {/* DEBUG: Só aparece em desenvolvimento (Expo Go) */}
            {IS_DEV_MODE && (
              <Text
                style={[styles.debugBtn, {borderWidth: 1, borderColor: "#444", padding: 4, borderRadius: 4}]}
                onPress={async () => {
                  if (isPremium) {
                    await DEBUG_clearPremium();
                    setIsPremium(false);
                    Alert.alert("Debug", "Premium removido!");
                  } else {
                    Alert.alert("Debug", "Você ainda não é premium. Clique em Apoiar primeiro.");
                  }
                }}
              >
                [DEV] {isPremium ? "Resetar Premium ✓" : "Premium inativo"}
              </Text>
            )}
          </View>

          {/* Bottom Tab Bar */}
          <TabBar
            activeTab={activeTab}
            onTabPress={setActiveTab}
            onPremiumPress={() => setShowPremiumModal(true)}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}