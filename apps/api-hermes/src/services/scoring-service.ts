export function resolveConfidenceLevel(scores: string[]) {
  if (scores.every((score) => score === "A" || score === "B")) {
    return "eleve";
  }

  if (scores.some((score) => score === "D" || score === "E")) {
    return "faible";
  }

  return "moyen";
}
