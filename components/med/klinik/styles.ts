import { StyleSheet } from "react-native";
import { colors } from "@/lib/theme";
import { AFTERNOON_BG, AFTERNOON_COLOR, MORNING_BG } from "./constants";

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greeting: { fontSize: 22, fontWeight: "800", color: colors.white, letterSpacing: -0.4 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },
  bellBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  badgeDot: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: colors.warning, borderRadius: 999,
    minWidth: 16, paddingHorizontal: 3, alignItems: "center",
  },
  badgeDotText: { fontSize: 9, fontWeight: "700", color: colors.white },

  pageHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle:    { fontSize: 22, fontWeight: "800", color: colors.white },
  pageSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },

  body: { padding: 16, gap: 12 },

  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle:  { fontSize: 15, fontWeight: "700", color: colors.foreground, flex: 1 },
  softIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.kou10,
    alignItems: "center", justifyContent: "center",
  },
  dayBadge: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },

  // ── Pills ──
  pillBlue: {
    backgroundColor: "#3B82F618", borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
  },
  pillBlueText: { fontSize: 11, fontWeight: "600", color: AFTERNOON_COLOR },
  pillAmber: {
    backgroundColor: colors.warning10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillAmberText: { fontSize: 11, fontWeight: "600", color: colors.warning },

  // ── Progress ──
  rotationText:   { fontSize: 13, color: colors.mutedForeground, marginBottom: 10 },
  progressTrack:  { height: 8, borderRadius: 4, backgroundColor: colors.muted, overflow: "hidden", marginBottom: 4 },
  progressFillBlue: { height: "100%", backgroundColor: AFTERNOON_COLOR, borderRadius: 4 },
  progressMeta:   { flexDirection: "row", justifyContent: "space-between" },
  progressMetaText: { fontSize: 11, color: colors.mutedForeground },

  // ── Split View (Bugün) ──
  splitRow: { flexDirection: "row", gap: 10 },
  splitCard: {
    flex: 1, borderRadius: 14, padding: 12, gap: 6,
  },
  splitMorning:   { backgroundColor: MORNING_BG },
  splitAfternoon: { backgroundColor: AFTERNOON_BG },
  splitHeader: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  splitDot:    { width: 6, height: 6, borderRadius: 3 },
  splitType:   { fontSize: 11, fontWeight: "700", flex: 1 },
  splitTime:   { fontSize: 10, fontWeight: "600" },
  splitSubject:  { fontSize: 13, fontWeight: "700", color: colors.foreground, lineHeight: 18 },
  splitLocationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  splitLocation: { fontSize: 10, color: colors.mutedForeground, flex: 1 },
  splitEnd:    { fontSize: 10, color: colors.mutedForeground },
  attendancePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: "flex-start", marginTop: 4 },
  attendancePillText: { fontSize: 10, fontWeight: "700" },

  // ── Announcements ──
  annRow:    { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, gap: 10 },
  annBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  annTypeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  annTitle:  { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  annMeta:   { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  emptyText: { fontSize: 13, color: colors.mutedForeground, textAlign: "center", paddingVertical: 12 },

  // ── Day Selector (Takvim) ──
  legendRow:  { flexDirection: "row", gap: 16, marginBottom: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.mutedForeground },

  daySelectorH: { flexDirection: "row", gap: 8, paddingHorizontal: 2, paddingVertical: 4 },
  dayCard: {
    width: 52, alignItems: "center", paddingVertical: 10,
    borderRadius: 14, backgroundColor: colors.muted, position: "relative",
  },
  dayCardActive:   { backgroundColor: colors.primary },
  dayCardWeekday: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },
  dayCardDate:    { fontSize: 18, fontWeight: "800", color: colors.foreground, marginTop: 2 },
  dayCardTextActive: { color: colors.white },
  todayDot: {
    position: "absolute", bottom: 6,
    width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.warning,
  },

  // ── Session Card (Takvim Detay) ──
  sessionCard: {
    borderRadius: 16, overflow: "hidden",
    borderLeftWidth: 4,
    backgroundColor: colors.card,
    marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  sessionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  sessionLabel:   { flex: 1, fontSize: 13, fontWeight: "700" },
  sessionTimeChip: { borderRadius: 6, backgroundColor: "rgba(0,0,0,0.06)", paddingHorizontal: 8, paddingVertical: 3 },
  sessionTimeText: { fontSize: 11, fontWeight: "700" },
  sessionBody:   { padding: 14, paddingTop: 4, gap: 8 },
  sessionSubject: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  sessionMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionMeta:    { fontSize: 12, color: colors.mutedForeground, flex: 1 },
  attendanceBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start" },
  attendanceBadgeText: { fontSize: 12, fontWeight: "600" },

  // ── Profile ──
  profileAvatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarLg: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#3B82F618", alignItems: "center", justifyContent: "center",
  },
  avatarLgText:  { fontSize: 22, fontWeight: "800", color: AFTERNOON_COLOR },
  profileName:   { fontSize: 17, fontWeight: "800", color: colors.foreground },
  profileMeta:   { fontSize: 13, color: colors.mutedForeground, marginTop: 1 },
  profileInfoList: { gap: 2, marginTop: 8 },
  infoRow:  { flexDirection: "row", paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 },
  infoLabel: { width: 100, fontSize: 12, color: colors.mutedForeground },
  infoValue: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: "500" },

  advisorBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  advisorBtnFill: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10,
  },
  advisorBtnFillText: { fontSize: 12, fontWeight: "600", color: colors.white },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FEF2F2", borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 15,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: colors.danger },

  logPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logStatusText: { fontSize: 10, fontWeight: "800" },

  fab: {
    position: "absolute",
    right: 20,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.kou,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.kou,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  fabText: { fontSize: 14, fontWeight: "600", color: colors.kouForeground },

  // ── Tab Bar ──
  tabBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", backgroundColor: colors.card,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: 6, gap: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  tabItem: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 3, paddingVertical: 8, paddingHorizontal: 4,
    borderRadius: 12, minHeight: 52,
  },
  tabItemActive: { backgroundColor: colors.primary },
  tabLabel:      { fontSize: 10, fontWeight: "600", color: colors.mutedForeground, textAlign: "center" },
  tabLabelActive: { fontWeight: "700", color: colors.kouForeground },
});
