


import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PremiumModal } from "./src/ui/PremiumModal";
import { TabBar } from "./src/ui/TabBar";
import { NavigationContainer } from "./src/ui/NavigationContainer";

import {
  initIAP,
  endIAP,
  getLocalPremium,
  getPremiumProduct,
  buyPremium,
  restorePremium
} from "./src/premium/premium";

function App() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [priceLabel, setPriceLabel] = useState("R$ 4,99");
  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState<'respiracao'|'historico'|'premium'|'config'>('respiracao');

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
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#0a1628', '#0d2847', '#1a4a7a', '#0d2847', '#0a1628']}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeContent}>
          <NavigationContainer
            activeTab={activeTab}
            isPremium={isPremium}
            onShowPremiumModal={() => setShowPremiumModal(true)}
            onPremiumChange={setIsPremium}
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
});

export default App;

