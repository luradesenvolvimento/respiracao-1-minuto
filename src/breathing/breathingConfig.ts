
export type Phase = "INHALE" | "HOLD" | "EXHALE" | "DONE";

export type BreathingState =
  | "ANXIETY_RELIEF"
  | "STRESS_RELEASE"
  | "GROUNDING"
  | "GROUNDING1"
  | "FOCUS_CLARITY"
  | "SLEEP_CALM";

export type BreathingDuration = 60 | 120 | 180 | 300 | 1200; // segundos: 1min, 2min, 3min, 5min, 20min

export type GuidedMode = "VOICE" | "SOUND" | "NONE";

export interface GuidedConfig {
  mode: GuidedMode;
  audioFile?: string; // caminho para o arquivo de áudio
}

export interface BreathingExercise {
  state: BreathingState;
  label: string;
  cycle: string;
  description: string;
  phases: Array<{ phase: Exclude<Phase, "DONE">; seconds: number }>;
  duration: BreathingDuration;
  guided?: GuidedConfig;
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    state: "ANXIETY_RELIEF",
    label: "Ansiedade",
    cycle: "4-4-4",
    description: "Respiração para acalmar a ansiedade.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 4 },
      { phase: "EXHALE", seconds: 4 }
    ],
    duration: 60,
    guided: { mode: "VOICE", audioFile: "assets/audio/ansiedade-voz.mp3" }
  },
  {
    state: "STRESS_RELEASE",
    label: "Estresse",
    cycle: "4-6-8",
    description: "Respiração para aliviar o estresse.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 6 },
      { phase: "EXHALE", seconds: 8 }
    ],
    duration: 1200,
    guided: { mode: "SOUND", audioFile: "assets/audio/estresse-som.mp3" }
  },
  {
    state: "GROUNDING",
    label: "Aterramento",
    cycle: "4-7-8",
    description: "Respiração para se sentir presente.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 7 },
      { phase: "EXHALE", seconds: 8 }
    ],
    duration: 120,
    guided: { mode: "NONE" }
  },
  {
    state: "GROUNDING1",
    label: "Aterramento",
    cycle: "4-7-8",
    description: "Respiração para se sentir presente.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 7 },
      { phase: "EXHALE", seconds: 8 }
    ],
    duration: 120,
    guided: { mode: "NONE" }
  },
  {
    state: "FOCUS_CLARITY",
    label: "Personalizado",
    cycle: "Personalizado",
    description: "Crie seu próprio ritmo de respiração.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 4 },
      { phase: "EXHALE", seconds: 6 }
    ],
    duration: 60,
    guided: { mode: "VOICE", audioFile: "assets/audio/foco-voz.mp3" }
  }
];


export function phaseLabel(phase: Phase) {
  switch (phase) {
    case "INHALE":
      return "Inspire";
    case "HOLD":
      return "Segure";
    case "EXHALE":
      return "Solte";
    case "DONE":
      return "Concluído ✨";
  }
}

export function phaseDescription(phase: Phase) {
  switch (phase) {
    case "INHALE":
      return "Agora, inspire profundamente pelo nariz";
    case "HOLD":
      return "Segure o ar nos pulmões";
    case "EXHALE":
      return "Solte o ar devagar pela boca";
    case "DONE":
      return "Parabéns! Você concluiu o ciclo.";
  }
}
