import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
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
    backgroundColor: "#4F8CFF",
    borderRadius: 12
  },
  txt: { color: "#0B1220", fontWeight: "800", fontSize: 16 }
});
