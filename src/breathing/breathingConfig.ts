export type Phase = "INHALE" | "HOLD" | "EXHALE" | "DONE";

export const TOTAL_SECONDS = 60;

// 4–2–6 = 12s por ciclo => 5 ciclos = 60s
export const PHASES: Array<{ phase: Exclude<Phase, "DONE">; seconds: number }> = [
  { phase: "INHALE", seconds: 4 },
  { phase: "HOLD", seconds: 2 },
  { phase: "EXHALE", seconds: 6 }
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
