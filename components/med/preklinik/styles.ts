import { StyleSheet } from "react-native";
import { colors } from "@/lib/theme";

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // ── Header ──
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

  // ── Page header (non-home tabs) ──
  pageHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: colors.white },
  pageSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },

  // ── Body ──
  body: { padding: 16, gap: 12 },

  // ── Card ──
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
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground, flex: 1 },
  softIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.kou10,
    alignItems: "center", justifyContent: "center",
  },

  // ── Pills ──
  pillGreen: {
    backgroundColor: colors.kou10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
  },
  pillGreenText: { fontSize: 11, fontWeight: "600", color: colors.primary },
  pillMuted: {
    backgroundColor: colors.muted, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillMutedText: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },
  pillAmber: {
    backgroundColor: colors.warning10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillAmberText: { fontSize: 11, fontWeight: "600", color: colors.warning },

  // ── Progress ──
  progressTrack: {
    height: 8, borderRadius: 4, backgroundColor: colors.muted, overflow: "hidden", marginBottom: 6,
  },
  progressFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  committeeLabel: { fontSize: 12, color: colors.mutedForeground },

  // ── Lesson Rows (Home) ──
  lessonRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, gap: 10 },
  lessonRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  lessonTypeDot: { width: 4, height: "100%", borderRadius: 2, minHeight: 40 },
  lessonTime: { width: 44 },
  lessonTimeText: { fontSize: 12, fontWeight: "700", color: colors.foreground },
  lessonEndText: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  lessonMain: { flex: 1 },
  lessonName: { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  lessonRoom: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  lessonTypePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: "flex-start" },
  lessonTypePillText: { fontSize: 10, fontWeight: "700" },

  emptyText: { fontSize: 13, color: colors.mutedForeground, textAlign: "center", paddingVertical: 12 },

  // ── Grade Rows (Home) ──
  kurulName: { fontSize: 12, fontWeight: "600", color: colors.primary, marginBottom: 8 },
  gradeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.border },
  gradeCourseName: { flex: 1, fontSize: 13, color: colors.foreground },
  gradeRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  gradeScore: { fontSize: 13, fontWeight: "700", color: colors.foreground },
  gradePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  gradePillText: { fontSize: 11, fontWeight: "700" },
  seeMore: { fontSize: 12, color: colors.primary, marginTop: 6, textAlign: "right" },

  // ── Announcements (Home) ──
  annRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, gap: 10 },
  annBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  annTypeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  annTitle: { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  annMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },

  // ── Advisor ──
  advisorRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 4 },
  avatarMd: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.kou20, alignItems: "center", justifyContent: "center",
  },
  avatarMdText: { fontSize: 16, fontWeight: "700", color: colors.primary },
  advisorName: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  advisorDept: { fontSize: 12, color: colors.mutedForeground, marginTop: 1 },
  advisorMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  advisorBtns: { flexDirection: "row", gap: 8, marginTop: 12 },
  advisorBtnOutline: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  advisorBtnOutlineText: { fontSize: 13, fontWeight: "600", color: colors.primary },
  advisorBtnFill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  advisorBtnFillText: { fontSize: 13, fontWeight: "600", color: colors.white },

  // ── Day Selector ──
  daySelector: { flexDirection: "row", gap: 6, marginBottom: 8 },
  dayPill: {
    flex: 1, paddingVertical: 8, borderRadius: 12,
    backgroundColor: colors.muted, alignItems: "center",
  },
  dayPillActive: { backgroundColor: colors.primary },
  dayPillText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  dayPillTextActive: { color: colors.white },

  // ── Legend ──
  legendRow: { flexDirection: "row", gap: 14, marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.mutedForeground },

  // ── Schedule Cards ──
  scheduleCard: {
    backgroundColor: colors.card, borderRadius: 16,
    borderLeftWidth: 4, flexDirection: "row", alignItems: "flex-start",
    padding: 14, marginBottom: 8, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  scheduleTimeCol: { width: 52, alignItems: "flex-start" },
  scheduleTime: { fontSize: 13, fontWeight: "700", color: colors.foreground },
  scheduleTimeEnd: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  scheduleMain: { flex: 1 },
  scheduleName: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  scheduleInstructor: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  scheduleRoomRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  scheduleRoom: { fontSize: 11, color: colors.mutedForeground },
  scheduleTypePill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  scheduleTypePillText: { fontSize: 10, fontWeight: "700" },

  // ── GPA Card ──
  gpaCard: { flexDirection: "row", alignItems: "center" },
  gpaLeft: { alignItems: "center", paddingRight: 20 },
  gpaValue: { fontSize: 40, fontWeight: "800", color: colors.primary, lineHeight: 44 },
  gpaLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  gpaDivider: { width: 1, height: 50, backgroundColor: colors.border },
  gpaRight: { flex: 1, paddingLeft: 20, gap: 8 },
  gpaStatRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  gpaStat: { fontSize: 22, fontWeight: "800", color: colors.primary },
  gpaStatLabel: { fontSize: 13, color: colors.mutedForeground },

  // ── Committee Cards ──
  committeeOngoingCard: { borderWidth: 1.5, borderColor: colors.warning + "60" },
  committeeHeader: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  committeeStatusRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 },
  committeeDot: { width: 7, height: 7, borderRadius: 3.5 },
  committeeStatus: { fontSize: 11, fontWeight: "600" },
  committeeTitle: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  committeeAvg: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  courseList: { marginTop: 2 },
  courseDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  courseRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  courseRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  courseRowName: { flex: 1, fontSize: 13, color: colors.foreground },
  courseRowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  courseScore: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  courseNoScore: { fontSize: 13, color: colors.mutedForeground },
  gradeChip: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  gradeChipText: { fontSize: 11, fontWeight: "700" },

  // ── Profile ──
  profileAvatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarLg: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.kou20, alignItems: "center", justifyContent: "center",
  },
  avatarLgText: { fontSize: 22, fontWeight: "800", color: colors.primary },
  profileName: { fontSize: 17, fontWeight: "800", color: colors.foreground },
  profileMeta: { fontSize: 13, color: colors.mutedForeground, marginTop: 1 },
  profileInfoList: { gap: 2, marginTop: 8 },
  infoRow: { flexDirection: "row", paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 },
  infoLabel: { width: 100, fontSize: 12, color: colors.mutedForeground },
  infoValue: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: "500" },

  // ── Logout ──
  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FEF2F2", borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 15,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: colors.danger },

  // ── Tab Bar ──
  tabBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", backgroundColor: colors.card,
    borderTopWidth: 1, borderTopColor: colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    minHeight: 52,
  },
  tabItemActive: { backgroundColor: colors.primary },
  tabLabel: { fontSize: 10, fontWeight: "600", color: colors.mutedForeground, textAlign: "center" },
  tabLabelActive: { fontWeight: "700", color: colors.kouForeground },
});
