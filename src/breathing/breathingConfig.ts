
export type Phase = "INHALE" | "HOLD" | "EXHALE" | "DONE";

export type BreathingState =
  | "ANXIETY_RELIEF"
  | "STRESS_RELEASE"
  | "GROUNDING"
  | "FOCUS_CLARITY"
  | "SLEEP_CALM";

export type BreathingDuration = 60 | 180 | 300; // segundos: 1min, 3min, 5min

export type GuidedMode = "VOICE" | "SOUND" | "NONE";

export interface GuidedConfig {
  mode: GuidedMode;
  audioFile?: string; // caminho para o arquivo de áudio
}

export interface BreathingExercise {
  state: BreathingState;
  label: string;
  description: string;
  phases: Array<{ phase: Exclude<Phase, "DONE">; seconds: number }>;
  duration: BreathingDuration;
  guided?: GuidedConfig;
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    state: "ANXIETY_RELIEF",
    label: "Alívio da Ansiedade",
    description: "Respiração para acalmar a ansiedade.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 2 },
      { phase: "EXHALE", seconds: 6 }
    ],
    duration: 60
    ,guided: { mode: "VOICE", audioFile: "assets/audio/ansiedade-voz.mp3" }
  },
  {
    state: "STRESS_RELEASE",
    label: "Liberação do Estresse",
    description: "Respiração para aliviar o estresse.",
    phases: [
      { phase: "INHALE", seconds: 5 },
      { phase: "HOLD", seconds: 3 },
      { phase: "EXHALE", seconds: 7 }
    ],
    duration: 180
    ,guided: { mode: "SOUND", audioFile: "assets/audio/estresse-som.mp3" }
  },
  {
    state: "GROUNDING",
    label: "Aterramento",
    description: "Respiração para se sentir presente.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 4 },
      { phase: "EXHALE", seconds: 4 }
    ],
    duration: 300
    ,guided: { mode: "NONE" }
  },
  {
    state: "FOCUS_CLARITY",
    label: "Foco e Clareza",
    description: "Respiração para aumentar o foco.",
    phases: [
      { phase: "INHALE", seconds: 3 },
      { phase: "HOLD", seconds: 3 },
      { phase: "EXHALE", seconds: 6 }
    ],
    duration: 60
    ,guided: { mode: "VOICE", audioFile: "assets/audio/foco-voz.mp3" }
  },
  {
    state: "SLEEP_CALM",
    label: "Calma para Dormir",
    description: "Respiração para relaxar antes de dormir.",
    phases: [
      { phase: "INHALE", seconds: 4 },
      { phase: "HOLD", seconds: 7 },
      { phase: "EXHALE", seconds: 8 }
    ],
    duration: 180
    ,guided: { mode: "SOUND", audioFile: "assets/audio/dormir-som.mp3" }
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
