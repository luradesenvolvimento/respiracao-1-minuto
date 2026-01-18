import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(234,242,255,0.35)",
    backgroundColor: "rgba(234,242,255,0.06)"
  },
  txt: { color: "#EAF2FF", fontWeight: "700", fontSize: 16 }
});
