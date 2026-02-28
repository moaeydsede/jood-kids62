export function extractNumber(value: string | number): number | null {
  const s = String(value ?? "").trim();
  const digits = s.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

/**
 * القاعدة:
 * - لو الرقم >= 1000 => أول رقمين
 * - لو أقل من 1000 => أول رقم
 * عملياً: floor(n / 100)
 */
export function modelSortKey(modelNumber: string | number): number {
  const n = extractNumber(modelNumber);
  if (!n) return 0;
  return Math.floor(n / 100);
}
