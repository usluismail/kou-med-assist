/**
 * Logbook orkestrasyon bileşeni.
 *
 * SRP  — Bu dosya yalnızca alt bileşenleri ve hook'ları birleştirir.
 * DIP  — API erişimi hook'lar üzerinden (useCreateLog, useLogs, vb.)
 *
 * İç bileşenler:
 *   logbook/LogbookHeader.tsx  — header + segment
 *   logbook/LogList.tsx        — kayıt listesi + progress
 *   logbook/LogForm.tsx        — 3 adımlı form
 *   logbook/useLogbookForm.ts  — form state + submit mantığı
 *   logbook/LogbookUiKit.tsx   — paylaşılan UI ilkeleri
 */
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet } from "./BottomSheet";
import { QrCode } from "./QrCode";
import { useAuth } from "@/lib/api/AuthContext";
import { useLogs, useProcedures, useSupervisors } from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import { LogbookHeader } from "./logbook/LogbookHeader";
import { LogList } from "./logbook/LogList";
import { LogForm } from "./logbook/LogForm";
import { useLogbookForm } from "./logbook/useLogbookForm";
import { ProgressRing } from "./logbook/LogbookUiKit";

// ─── Public tipler ────────────────────────────────────────────────────────

export type QrInfo = {
  payload: string;
  procedureName: string;
  encounterId: string;
};

// ─── Props ────────────────────────────────────────────────────────────────

type LogbookProps = {
  onQrCreated: (info: QrInfo) => void;
  initialTab?: "list" | "new";
  title?: string;
  subtitle?: string;
  headerBackground?: string;
  segmentActiveColor?: string;
};

// ─── Ana Bileşen ──────────────────────────────────────────────────────────

export function Logbook({
  onQrCreated,
  initialTab = "list",
  title = "Dijital Klinik Karne",
  subtitle,
  headerBackground = colors.clinical,
  segmentActiveColor = colors.clinical,
}: LogbookProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const logs = useLogs();
  const procedures = useProcedures();
  const supervisors = useSupervisors();

  const [tab, setTab] = useState<"list" | "new">(initialTab);

  const form = useLogbookForm(
    onQrCreated,
    supervisors.data ?? [],
    logs.reload,
    procedures.reload,
  );

  useEffect(() => {
    setTab(initialTab);
    if (initialTab === "new") form.setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab]);

  const handleTabChange = (newTab: "list" | "new") => {
    setTab(newTab);
    if (newTab === "new") form.setStep(1);
  };

  const headerSub =
    subtitle ?? user?.faculty ?? "Kocaeli Üniversitesi Tıp Fakültesi";

  return (
    <View>
      <LogbookHeader
        title={title}
        subtitle={headerSub}
        paddingTop={insets.top + 16}
        headerBackground={headerBackground}
        segmentActiveColor={segmentActiveColor}
        activeTab={tab}
        onTabChange={handleTabChange}
      />

      {tab === "list" ? (
        <LogList logs={logs} procedures={procedures} />
      ) : (
        <LogForm
          form={form}
          procedures={procedures.data ?? []}
          supervisors={supervisors.data ?? []}
          onTabSwitch={() => setTab("list")}
        />
      )}
    </View>
  );
}

// ─── QR Sheet ─────────────────────────────────────────────────────────────

export function QrSheet({
  open,
  onClose,
  info,
}: {
  open: boolean;
  onClose: () => void;
  info: QrInfo | null;
}) {
  const { user } = useAuth();
  const [left, setLeft] = useState(30);

  useEffect(() => {
    if (!open) return;
    setLeft(30);
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 30 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [open, info?.payload]);

  // Discriminated union ile tip-güvenli erişim
  const studentNo = user?.role === "student" ? user.studentNo : "—";
  const rotation = user?.role === "student" ? user.rotation : "";

  return (
    <BottomSheet open={open} onClose={onClose} title="Yüz Yüze Onay QR Kodu">
      <View style={styles.qrSheet}>
        <View style={styles.qrRingWrap}>
          <ProgressRing
            size={220}
            strokeWidth={6}
            pct={(left / 30) * 100}
            trackColor={colors.muted}
            progressColor={colors.kou}
          />
          <View style={styles.qrBox}>
            <QrCode size={150} value={info?.payload} />
          </View>
        </View>
        <Text style={styles.qrTimer}>{left} saniye geçerli</Text>
        <View style={styles.qrMeta}>
          <Text style={styles.qrName}>{user?.name ?? "—"}</Text>
          <Text style={styles.meta}>
            No: {studentNo} · {rotation}
          </Text>
          <Text style={styles.meta}>
            {info?.procedureName ?? "—"} · {info?.encounterId ?? "—"}
          </Text>
          <Text style={[styles.meta, { marginTop: 6 }]} selectable>
            Payload: {info?.payload ?? "—"}
          </Text>
        </View>
        <View style={styles.waitRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.waitText}>Akademisyen Taraması Bekleniyor...</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  qrSheet: { alignItems: "center", paddingBottom: 8 },
  qrRingWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  qrBox: {
    position: "absolute",
    borderRadius: 16,
    backgroundColor: colors.card,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  qrTimer: { marginTop: 8, fontSize: 12, fontWeight: "600", color: colors.kou },
  qrMeta: {
    marginTop: 12,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(241,245,249,0.6)",
    padding: 12,
    alignItems: "center",
  },
  qrName: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  meta: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  waitRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.info,
  },
  waitText: { fontSize: 12, fontWeight: "500", color: colors.mutedForeground },
});
