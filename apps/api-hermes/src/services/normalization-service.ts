const aliases = new Map<string, string>([
  ["bouteille verre recycle", "verre"],
  ["aluminium anodise", "aluminium"],
  ["carton double cannelure", "carton"],
  ["pet", "plastique PET"]
]);

function simplify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

export function normalizeMaterialLabel(label: string) {
  return aliases.get(simplify(label)) ?? label;
}
