const intFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

/** Short suffixes for 10^3 through 10^30 (K … No). Beyond that: aa, ab, … then scientific. */
const TIER_SUFFIXES = [
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
] as const;

const MAX_DOUBLE_LETTER_INDEX = 26 * 26 - 1;

function doubleLetterSuffix(index: number): string {
  const i = Math.floor(Math.max(0, index));
  if (i > MAX_DOUBLE_LETTER_INDEX) return "…";
  const hi = Math.floor(i / 26);
  const lo = i % 26;
  return String.fromCharCode(97 + hi) + String.fromCharCode(97 + lo);
}

function suffixForTier(tier: number): string {
  if (tier <= 0) return "";
  if (tier <= TIER_SUFFIXES.length) return TIER_SUFFIXES[tier - 1] ?? "";
  const aaIndex = tier - TIER_SUFFIXES.length - 1;
  if (aaIndex <= MAX_DOUBLE_LETTER_INDEX) return doubleLetterSuffix(aaIndex);
  return `e${tier * 3}`;
}

function trimMantissa(mantissa: number): string {
  if (mantissa >= 100) return mantissa.toFixed(0);
  if (mantissa >= 10) return mantissa.toFixed(1).replace(/\.0$/, "");
  return mantissa.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

/**
 * Formats large numbers with suffixes (1.23K, 4.56M, …, aa, ab, …).
 */
export function formatBigNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const n = Math.abs(value);
  if (n < 1000) return sign + intFormatter.format(Math.floor(n));

  const tier = Math.floor(Math.log10(n) / 3);
  const mantissa = n / 10 ** (tier * 3);
  const suffix = suffixForTier(tier);
  return `${sign}${trimMantissa(mantissa)}${suffix}`;
}

/**
 * Whole numbers with locale grouping (for small counts if needed).
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return intFormatter.format(Math.floor(value));
}

/**
 * Passive rate: show enough decimals when below 1 / sec.
 */
export function formatRate(perSecond: number): string {
  if (!Number.isFinite(perSecond) || perSecond <= 0) return "0";
  if (perSecond < 0.01) return perSecond.toFixed(3).replace(/\.?0+$/, "");
  if (perSecond < 1) return perSecond.toFixed(2).replace(/\.?0+$/, "");
  if (perSecond < 100) return perSecond.toFixed(1).replace(/\.0$/, "");
  return formatBigNumber(perSecond);
}
