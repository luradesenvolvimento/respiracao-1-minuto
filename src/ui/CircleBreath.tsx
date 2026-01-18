import React from "react";
import { Animated, StyleSheet, View } from "react-native";

export function CircleBreath({ scale }: { scale: Animated.Value }) {
  return (
    <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
      <View style={styles.inner} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(120, 170, 255, 0.12)",
    borderWidth: 2,
    borderColor: "rgba(120, 170, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center"
  },
  inner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(234, 242, 255, 0.75)"
  }
});
