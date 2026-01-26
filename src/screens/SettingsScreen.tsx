import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "../ui/Header";

export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Configurações"
        subtitle="Personalize sua experiência"
      />

      <View style={styles.settingsContent}>
        <Text style={styles.comingSoon}>Configurações em breve! 🚀</Text>
        <Text style={styles.comingSoonSubtext}>
          Estamos trabalhando em novas funcionalidades para personalizar sua experiência de respiração.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  settingsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  comingSoon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonSubtext: {
    color: '#a8c0d8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});