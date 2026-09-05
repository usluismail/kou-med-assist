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
 * Landing (unauthenticated) ekranına özel "Clinical Dark Emerald" palette.
 * Uygulamaya giriş sonrasında `colors` (light) kullanılmaya devam eder.
 */
export const landingColors = {
  // ── Arka plan katmanları ─────────────────────────────────────────────────
  bg: "#0D1B2A",            // koyu lacivert — ana zemin
  bgDeep: "#080F18",        // en koyu katman
  bgCard: "#132032",        // kart/surface dark
  bgCardAlt: "#1A2B3C",    // hafif daha açık kart

  // ── Primary — safir zümrüt ───────────────────────────────────────────────
  primary: "#00A67E",
  primaryDark: "#007A5C",
  primaryLight: "#3EC9A1",
  primaryGlow: "rgba(0,166,126,0.18)",
  primaryGlow30: "rgba(0,166,126,0.30)",

  // ── Accent — tıbbî kırmızı ───────────────────────────────────────────────
  accent: "#E63946",
  accentGlow: "rgba(230,57,70,0.18)",

  // ── Metin ───────────────────────────────────────────────────────────────
  text: "#F1F5F9",
  textSub: "rgba(241,245,249,0.65)",
  textMuted: "rgba(241,245,249,0.40)",

  // ── Glassmorphism ────────────────────────────────────────────────────────
  glassBase: "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassBorderStrong: "rgba(255,255,255,0.20)",

  // ── Tile aksanları (Keşfet grid) ─────────────────────────────────────────
  tileAmber: "#FEF3C7",
  tileAmberFg: "#92400E",
  tileEmerald: "#D1FAE5",
  tileEmeraldFg: "#065F46",
  tileSky: "#E0F2FE",
  tileSkyFg: "#0369A1",
  tileViolet: "#EDE9FE",
  tileVioletFg: "#5B21B6",

  // ── Swipe-to-login ───────────────────────────────────────────────────────
  swipePill: "rgba(255,255,255,0.13)",
  swipeKnob: "#FFFFFF",
  swipeText: "rgba(255,255,255,0.75)",

  // ── Hero gradient ────────────────────────────────────────────────────────
  heroOverlayTop: "rgba(13,27,42,0.18)",
  heroOverlayBot: "rgba(8,15,24,0.92)",

  // ── Duyuru badge tonları ─────────────────────────────────────────────────
  badgeClinical: "rgba(230,57,70,0.18)",
  badgeClinicalText: "#FCA5A5",
  badgeAcademic: "rgba(59,130,246,0.18)",
  badgeAcademicText: "#93C5FD",
  badgeFaculty: "rgba(0,166,126,0.18)",
  badgeFacultyText: "#6EE7C7",

  // ── Misc ─────────────────────────────────────────────────────────────────
  divider: "rgba(255,255,255,0.08)",
  ping: "#3EC9A1",
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
