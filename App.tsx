


import React, { useEffect, useState, useMemo } from "react";
import { BREATHING_EXERCISES, BreathingExercise, BreathingDuration, phaseLabel as phaseLabelFn } from "./src/breathing/breathingConfig";
// import { BreathingCarousel } from "./src/ui/BreathingCarousel";
import { addHistoryItem, getHistory } from "./src/breathing/breathingHistory";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Alert, Modal, Pressable, Dimensions, ImageBackground, Animated, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AdBanner } from "./src/monetization/AdBanner";
import { PremiumCard } from "./src/premium/PremiumCard";
import { useBreathing } from "./src/breathing/useBreathing";
import { LockedIcon } from "./src/ui/icon/LockedIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
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
import { HomeIcon } from "./src/ui/icon/HomeIcon";
import { HistoryIcon } from "./src/ui/icon/HistoryIcon";
import { PremiumIcon } from "./src/ui/icon/PremiumIcon";

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
  
  // Primeiro exercício é gratuito, os outros são premium
  const isExerciseLocked = (index: number) => index > 0 && !isPremium;

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
              {BREATHING_EXERCISES.map((exercise, index) => {
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
          <View style={styles.tabBar}>
            <Pressable 
              style={styles.tabItem} 
              onPress={() => setActiveTab('respiracao')}
            >
              <Text style={[styles.tabIcon, activeTab === 'respiracao' && styles.tabIconActive]}>
                <HomeIcon width={32} height={32} color="#5ac8fa" />
              </Text>
              <Text style={[styles.tabLabel, activeTab === 'respiracao' && styles.tabLabelActive]}>Respiração</Text>
            </Pressable>
            <Pressable 
              style={styles.tabItem} 
              onPress={() => setActiveTab('historico')}
            >
              <Text style={[styles.tabIcon, activeTab === 'historico' && styles.tabIconActive]}>
                <HistoryIcon width={32} height={32} color="#5ac8fa" />
              </Text>
              <Text style={[styles.tabLabel, activeTab === 'historico' && styles.tabLabelActive]}>Histórico</Text>
            </Pressable>
            <Pressable 
              style={styles.tabItem} 
              onPress={() => {
                setActiveTab('premium');
                setShowPremiumModal(true);
              }}
            >
              <View style={styles.premiumTabIcon}>
                <Text style={styles.tabIcon}>
                  <PremiumIcon width={32} height={32} color="#5ac8fa" />
                </Text>
                <View style={styles.premiumLockBadge}>
                  <Text style={{fontSize: 8}}>
                    <LockedIcon width={14} height={14} color="#ccd0a0ff" />
                  </Text>
                </View>
              </View>
              <Text style={[styles.tabLabel, activeTab === 'premium' && styles.tabLabelActive]}>Premium</Text>
            </Pressable>
            {/* <Pressable 
              style={styles.tabItem} 
              onPress={() => setActiveTab('config')}
            >
              <Text style={[styles.tabIcon, activeTab === 'config' && styles.tabIconActive]}>⚙️</Text>
              <Text style={[styles.tabLabel, activeTab === 'config' && styles.tabLabelActive]}>Configurações</Text>
            </Pressable> */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

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
    backgroundColor: "#0a1628" 
  },
  gradientBackground: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
  },
  debugBtn: { 
    color: "#666", 
    fontSize: 11, 
    marginTop: 10,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
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
  rhythmRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'stretch', 
    marginBottom: 8, 
    gap: 8,
    flexWrap: 'wrap',
  },
  rhythmBtn: {
    backgroundColor: 'rgba(50, 100, 150, 0.5)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    // height: 64,
    borderWidth: 1.5,
    borderColor: 'rgba(80, 130, 180, 0.5)',
    position: 'relative',
    marginRight: 6,
  },
  rhythmBtnActive: {
    backgroundColor: 'rgba(70, 130, 200, 0.7)',
    borderColor: 'rgba(100, 180, 255, 0.9)',
    borderWidth: 2,
    // shadowColor: '#5ac8fa',
    // shadowOpacity: 0.6,
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
  rhythmDescription: {
    color: '#a8c0d8',
    fontSize: 12,
    marginBottom: 4,
  },
  rhythmLabelLocked: { 
    color: '#7a9ab5' 
  },
  lockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  lockIcon: { 
    fontSize: 12 
  },
  lockIconSmall: {
    position: 'absolute',
    top: 6,
    right: 8,
    opacity: 0.9,
  },
  lockIconText: {
    fontSize: 9,
  },
  lockImage: {
    width: 14,
    height: 14,
  },
  starBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
  },
  starIcon: {
    fontSize: 12,
  },
  premiumBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  premiumStar: {
    fontSize: 16,
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
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 150, 200, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: '#7a9cba',
    fontSize: 10,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#5ac8fa',
  },
  premiumTabIcon: {
    position: 'relative',
  },
  premiumLockBadge: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: '#0a1628',
    borderRadius: 6,
    padding: 1,
  },
});

export default App;

