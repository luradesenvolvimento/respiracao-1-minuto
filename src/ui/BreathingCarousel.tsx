import React, { useRef } from "react";
import { View, FlatList, Dimensions, Text, TouchableOpacity, StyleSheet } from "react-native";

import { BreathingExercise, phaseLabel as phaseLabelFn, phaseDescription, Phase } from "../breathing/breathingConfig";
import { useBreathing } from "../breathing/useBreathing";
import { formatMMSS } from "../utils/time";
import { CircleBreath } from "./CircleBreath";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

interface BreathingCarouselProps {
  exercises: BreathingExercise[];
  isPremium: boolean;
  onBuy: () => void;
  onSessionEnd: (exercise: BreathingExercise) => void;
}

export const BreathingCarousel: React.FC<BreathingCarouselProps> = ({ exercises, isPremium, onBuy, onSessionEnd }) => {
  const screenWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList>(null);
  // Estado do exercício selecionado
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectedExercise = exercises[selectedIndex];
  const { phaseLabel, remainingSeconds, isRunning, circleScale, start, pause, reset, phase } = useBreathing(selectedExercise);

  return (
    <FlatList
      ref={flatListRef}
      data={exercises}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.state + item.duration}
      onMomentumScrollEnd={e => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setSelectedIndex(idx);
      }}
      renderItem={({ item, index }) => {
        const isBasic = item.state === "ANXIETY_RELIEF" && item.duration === 60;
        const locked = !isPremium && !isBasic;
        return (
          <View style={[styles.carouselItem, { width: screenWidth }]}> 
            <Text style={styles.label}>{item.label}</Text>
            {/* <Text style={styles.duration}>{item.duration / 60} min</Text> */}
            <Text style={styles.description}>{item.description}</Text>
            {locked && (
              <Text style={styles.premium}>Premium</Text>
            )}
            {(!locked || isPremium) ? (
              <>
                {isRunning || remainingSeconds !== item.duration ? (
                  <>
                    <Text style={styles.phase}>{phaseLabel}</Text>
                    <Text style={styles.phaseDesc}>{phaseDescription(phase)}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.phase}>Pronto para começar?</Text>
                    <Text style={styles.phaseDesc}>Toque em "Iniciar" para começar.</Text>
                  </>
                )}
                <Text style={styles.timer}>{formatMMSS(remainingSeconds)}</Text>
                <View style={{ height: 32 }} />
                <CircleBreath scale={circleScale} />
                <View style={{ height: 40 }} />
                <View style={styles.buttonsRow}>
                  <PrimaryButton label={isRunning ? "Pausar" : "Iniciar"} onPress={isRunning ? pause : async () => { start(); await onSessionEnd(selectedExercise); }} />
                  <View style={{ width: 12 }} />
                  <SecondaryButton label="Reiniciar" onPress={reset} />
                </View>
                <View style={{ height: 18 }} />
                <Text style={styles.hint}>
                  {`Faça 5 ciclos: ${item.phases.map((p: { seconds: number; phase: Phase }) => `${p.seconds}s ${phaseLabelFn(p.phase)}`).join(" • ")}.`}
                </Text>
              </>
            ) : (
              <TouchableOpacity onPress={onBuy} style={styles.unlockBtn}>
                <Text style={styles.unlockBtnText}>
                  Unlock more breathing sessions
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#0D1A2D"
  },
  label: { color: "#EAF2FF", fontWeight: "bold", fontSize: 32, marginTop: 8, marginBottom: 8 },
  duration: { color: "#B7C6E6", fontSize: 16, marginBottom: 8 },
  description: { color: "#B7C6E6", fontSize: 16, marginBottom: 20, textAlign: "center" },
  premium: { color: "#F7B24F", fontSize: 13, marginTop: 2 },
  phase: { color: "#EAF2FF", fontSize: 28, fontWeight: "700", marginTop: 20 },
  phaseDesc: { color: "#B7C6E6", fontSize: 18, marginTop: 2, marginBottom: 2, textAlign: "center" },
  timer: { color: "#B7C6E6", fontSize: 26, marginTop: 6 },
  buttonsRow: { flexDirection: "row", alignItems: "center" },
  hint: { color: "#B7C6E6", textAlign: "center", fontSize: 14, lineHeight: 20, marginBottom: 8 },
  unlockBtn: { marginVertical: 8, padding: 8 },
  unlockBtnText: { color: "#4F8EF7", fontWeight: "bold", fontSize: 15 }
});
