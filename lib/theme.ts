/** Design tokens for KOÜ Tıp mobil UI */
export const colors = {
  background: "#F8F9FB",
  foreground: "#1A2332",
  card: "#FFFFFF",
  primary: "#008542",
  primaryDark: "#006633",
  primaryForeground: "#FFFFFF",
  kou: "#008542",
  kouForeground: "#FFFFFF",
  clinical: "#1A2332",
  clinicalForeground: "#F8F9FB",
  clinicalSoft: "#2A3444",
  surface: "#F8F9FB",
  success: "#34C759",
  successForeground: "#FFFFFF",
  warning: "#F5A623",
  warningForeground: "#1A2332",
  info: "#3B82F6",
  infoForeground: "#FFFFFF",
  danger: "#EF4444",
  secondary: "#F8F9FB",
  secondaryForeground: "#4B5568",
  muted: "#F1F5F9",
  mutedForeground: "#6B7280",
  accent: "#E5E7EB",
  border: "#E5E7EB",
  white: "#FFFFFF",
  white60: "rgba(255,255,255,0.6)",
  white70: "rgba(255,255,255,0.7)",
  white10: "rgba(255,255,255,0.1)",
  clinical05: "rgba(26,35,50,0.05)",
  kou10: "rgba(0,133,66,0.1)",
  kou15: "rgba(0,133,66,0.15)",
  kou20: "rgba(0,133,66,0.2)",
  success10: "rgba(52,199,89,0.1)",
  warning10: "rgba(245,166,35,0.1)",
  info10: "rgba(59,130,246,0.1)",
} as const;

/**
 * Landing (giriş öncesi) — KOÜ Mobil referanslı açık kurumsal palet.
 * Kırık beyaz zemin + beyaz kartlar; koyu zümrüt yalnızca hero kartında.
 */
export const landingColors = {
  // ── Arka plan ────────────────────────────────────────────────────────────
  bg: "#F6F7F1",
  bgDeep: "#EEF0E8",
  bgCard: "#FFFFFF",
  bgCardAlt: "#F3F4EE",

  // ── Primary — kurumsal yeşil ─────────────────────────────────────────────
  primary: "#0C5C3D",
  primaryDark: "#0C2E22",
  primaryLight: "#1A7A52",
  primaryGlow: "rgba(12,92,61,0.10)",
  primaryGlow30: "rgba(12,92,61,0.22)",

  // ── Accent — klinik bordo + CTA lim ──────────────────────────────────────
  accent: "#7A1F2B",
  accentGlow: "rgba(122,31,43,0.12)",
  ctaLime: "#B8D44A",
  academicGold: "#B4913A",

  // ── Metin (açık zemin) ───────────────────────────────────────────────────
  text: "#14201A",
  textSub: "rgba(20,32,26,0.62)",
  textMuted: "rgba(20,32,26,0.40)",

  // ── Kart kenar / yüzey ───────────────────────────────────────────────────
  glassBase: "#F3F4EE",
  glassBorder: "rgba(12,46,34,0.08)",
  glassBorderStrong: "rgba(12,46,34,0.14)",

  // ── Tile aksanları (Keşfet pastel kutuları) ───────────────────────────────
  tileAmber: "#FDE8D0",
  tileAmberFg: "#9A4A12",
  tileEmerald: "#D8F0E4",
  tileEmeraldFg: "#0C5C3D",
  tileSky: "#DCEAF8",
  tileSkyFg: "#1B4F7A",
  tileViolet: "#E7E1F6",
  tileVioletFg: "#5B3A9E",
  tilePeach: "#F8DDD4",
  tilePeachFg: "#8B3A2A",
  tileMint: "#D4EFE6",
  tileMintFg: "#0C5C3D",

  // ── Swipe-to-login (hero üzerinde, koyu yüzey) ───────────────────────────
  swipePill: "rgba(0,0,0,0.28)",
  swipeKnob: "#B8D44A",
  swipeText: "rgba(255,255,255,0.90)",

  // ── Hero overlay ─────────────────────────────────────────────────────────
  heroOverlayTop: "rgba(12,46,34,0.35)",
  heroOverlayBot: "rgba(8,30,22,0.88)",
  heroEmerald: "#0C2E22",

  // ── Duyuru badge tonları (açık zemin) ────────────────────────────────────
  badgeClinical: "rgba(122,31,43,0.10)",
  badgeClinicalText: "#7A1F2B",
  badgeAcademic: "rgba(27,79,122,0.10)",
  badgeAcademicText: "#1B4F7A",
  badgeFaculty: "rgba(12,92,61,0.10)",
  badgeFacultyText: "#0C5C3D",

  // ── Misc ─────────────────────────────────────────────────────────────────
  divider: "rgba(12,46,34,0.08)",
  ping: "#B8D44A",
  white: "#FFFFFF",
  transparent: "transparent",
} as const;

/** Dark mode token'ları (Sprint C — toggle sonra) */
export const darkColors = {
  background: "#0F1419",
  foreground: "#F1F5F9",
  card: "#1A2332",
  surface: "#121820",
  muted: "#243041",
  mutedForeground: "#94A3B8",
  border: "#2A3648",
  secondary: "#1A2332",
  secondaryForeground: "#CBD5E1",
} as const;
