import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Alert } from "react-native";
import { useBreathing } from "./src/breathing/useBreathing";
import { formatMMSS } from "./src/utils/time";
import { CircleBreath } from "./src/ui/CircleBreath";
import { PrimaryButton } from "./src/ui/PrimaryButton";
import { SecondaryButton } from "./src/ui/SecondaryButton";

import { AdBanner } from "./src/monetization/AdBanner";
import { PremiumCard } from "./src/monetization/PremiumCard";
import {
  initIAP,
  endIAP,
  getLocalPremium,
  getPremiumProduct,
  buyPremium,
  restorePremium
} from "./src/monetization/premium";

export default function App() {
  const { phaseLabel, remainingSeconds, isRunning, circleScale, start, pause, reset } =
    useBreathing();

  const [isPremium, setIsPremium] = useState(false);
  const [priceLabel, setPriceLabel] = useState("R$ 4,99");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const local = await getLocalPremium();
      if (mounted) setIsPremium(local);

      try {
        await initIAP();
        const product = await getPremiumProduct();
        if (product?.displayPrice && mounted) {
          setPriceLabel(product.displayPrice);
        }
      } catch (e) {
        // Se falhar, mantém preço default e segue
      }
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
      <View style={styles.container}>
        <Text style={styles.title}>Respiração 1 Minuto</Text>

        <Text style={styles.phase}>{phaseLabel}</Text>
        <Text style={styles.timer}>{formatMMSS(remainingSeconds)}</Text>

        <View style={{ height: 22 }} />

        <CircleBreath scale={circleScale} />

        <View style={{ height: 26 }} />

        <View style={styles.buttonsRow}>
          <PrimaryButton label={isRunning ? "Pausar" : "Iniciar"} onPress={isRunning ? pause : start} />
          <View style={{ width: 12 }} />
          <SecondaryButton label="Reiniciar" onPress={reset} />
        </View>

        <View style={{ height: 18 }} />

        <Text style={styles.hint}>
          Faça 5 ciclos: 4s inspirar • 2s segurar • 6s soltar.
        </Text>

        <View style={{ height: 18 }} />

        <PremiumCard
          isPremium={isPremium}
          priceLabel={priceLabel}
          onBuy={onBuy}
          onRestore={onRestore}
        />

        {/* Ads: só para NÃO premium, e só na tela inicial */}
        <AdBanner show={!isPremium} />

        <View style={{ height: 10 }} />
        <Text style={styles.footer}>Sem login. Sem coleta de dados.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  title: { color: "#EAF2FF", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  phase: { color: "#EAF2FF", fontSize: 34, fontWeight: "700", marginTop: 6 },
  timer: { color: "#B7C6E6", fontSize: 26, marginTop: 6 },
  buttonsRow: { flexDirection: "row", alignItems: "center" },
  hint: { color: "#B7C6E6", textAlign: "center", fontSize: 14, lineHeight: 20 },
  footer: { color: "#6F87B6", fontSize: 12 }
});
