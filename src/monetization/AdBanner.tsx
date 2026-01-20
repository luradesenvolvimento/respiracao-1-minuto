import React from "react";
import { View, StyleSheet, Text } from "react-native";

// Anúncios desabilitados para Expo Go - requer build nativo
const isAdsAvailable = false;

export function AdBanner({ show }: { show: boolean }) {
  if (!show) return null;

  // Anúncios não estão disponíveis no Expo Go
  return (
    <View style={[styles.wrap, styles.placeholder]}>
      <Text style={styles.placeholderText}>
        [Anúncio - requer build nativo]
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  placeholder: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6
  },
  placeholderText: {
    color: "#888",
    fontSize: 12
  }
});
