export function numericDraft(value: number) {
  return String(value);
}

export function parseNumericDraft(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
