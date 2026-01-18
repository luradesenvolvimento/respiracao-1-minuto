import React from "react";
import { View, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

// Use TEST ID durante desenvolvimento.
// Troque pelo seu Ad Unit real no build de produção.
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

export function AdBanner({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <View style={styles.wrap}>
      <BannerAd unitId={TEST_BANNER_ID} size={BannerAdSize.BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center"
  }
});
