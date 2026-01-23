


import React, { useEffect, useState } from "react";
import { BREATHING_EXERCISES, BreathingExercise, BreathingDuration } from "./src/breathing/breathingConfig";
import { BreathingCarousel } from "./src/ui/BreathingCarousel";
import { addHistoryItem, getHistory } from "./src/breathing/breathingHistory";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Alert, Modal, Pressable } from "react-native";
import { AdBanner } from "./src/monetization/AdBanner";
import { PremiumCard } from "./src/premium/PremiumCard";
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container]}>
        <Text style={styles.title}>Respiração 1 Minuto</Text>
        <Text style={[styles.hint]}>Escolha o exercício deslizando para o lado</Text>

        <BreathingCarousel
          exercises={BREATHING_EXERCISES}
          isPremium={isPremium ?? false}
          onBuy={onBuy}
          onSessionEnd={onSessionEnd}
        />

        {/* Sugestão sutil após 3 usos do básico */}
        {!isPremium && historyCount >= 3 && (
          <Text style={{ color: "#F7B24F", fontSize: 13, marginBottom: 8, textAlign: "center" }}>
            Experimente mais exercícios e durações com o Premium!
          </Text>
        )}

        {/* Botão discreto para abrir modal premium */}
        {!isPremium && (
          <Pressable
            style={({ pressed }) => [{
              backgroundColor: pressed ? '#1A2940' : 'transparent',
              borderWidth: 1,
              borderColor: '#4F8EF7',
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 18,
              alignSelf: 'center',
              marginVertical: 8
            }]}
            onPress={() => setShowPremiumModal(true)}
          >
            <Text style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15 }}>Apoiar / Desbloquear Premium</Text>
          </Pressable>
        )}

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

        <View style={{ height: 10 }} />
        <Text style={styles.footer}>Sem login. Sem coleta de dados.</Text>

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
    </SafeAreaView>
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
  safe: { flex: 1, backgroundColor: "#0B1220" },
  debugBtn: { color: "#666", fontSize: 11, marginTop: 20 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 20
  },
  title: { color: "#EAF2FF", fontSize: 32, fontWeight: "700", marginBottom: 12, marginTop: 32 },
  hint: { color: "#B7C6E6", textAlign: "center", fontSize: 16, lineHeight: 20, marginBottom: 20 },
  footer: { color: "#6F87B6", fontSize: 12 }
});

export default App;

