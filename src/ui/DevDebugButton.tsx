import React from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { DEBUG_clearPremium, IS_DEV_MODE } from '../premium/premium';

interface DevDebugButtonProps {
  isPremium: boolean | null;
  onPremiumChange: (isPremium: boolean) => void;
}

export const DevDebugButton: React.FC<DevDebugButtonProps> = ({
  isPremium,
  onPremiumChange
}) => {
  if (!IS_DEV_MODE) {
    return null;
  }

  return (
    <Text
      style={[styles.debugBtn, {borderWidth: 1, borderColor: "#444", padding: 4, borderRadius: 4}]}
      onPress={async () => {
        if (isPremium) {
          await DEBUG_clearPremium();
          onPremiumChange(false);
          Alert.alert("Debug", "Premium removido!");
        } else {
          Alert.alert("Debug", "Você ainda não é premium. Clique em Apoiar primeiro.");
        }
      }}
    >
      [DEV] {isPremium ? "Resetar Premium ✓" : "Premium inativo"}
    </Text>
  );
};

const styles = StyleSheet.create({
  debugBtn: {
    color: "#666",
    fontSize: 11,
    marginTop: 10,
    marginBottom: 40,
  },
});