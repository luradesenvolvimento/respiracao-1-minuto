import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";

export function PremiumCard({
  isPremium,
  priceLabel,
  onBuy,
  onRestore
}: {
  isPremium: boolean;
  priceLabel: string;
  onBuy: () => void;
  onRestore: () => void;
}) {
  // Premium ativo = não mostra nada
  if (isPremium) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Apoiar o App 💙</Text>
      <Text style={styles.body}>
        Desbloqueie a versão Premium e remova anúncios. Seu apoio mantém o app vivo.
      </Text>
      <View style={{ height: 12 }} />
      <PrimaryButton label={`Apoiar ${priceLabel}`} onPress={onBuy} />
      <View style={{ height: 10 }} />
      <SecondaryButton label="Restaurar compra" onPress={onRestore} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "rgba(234,242,255,0.06)",
    borderWidth: 1.2,
    borderColor: "rgba(234,242,255,0.18)"
  },
  title: { color: "#EAF2FF", fontSize: 16, fontWeight: "800" },
  body: { color: "#B7C6E6", fontSize: 13, marginTop: 6, lineHeight: 18 }
});
