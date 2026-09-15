/**
 * Logbook kayıt listesi ve prosedür progress kartı.
 * SRP — Sadece mevcut logları ve prosedür ilerlemesini gösterir.
 *       Veri yükleme state'ini prop olarak alır; fetch yapmaz.
 */
import { StyleSheet, Text, View } from "react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { formatLogDateTr, logRoleLabel, logStatusLabel } from "@/lib/api/labels";
import type { AsyncState } from "./types";
import type { LogEntry, ProcedureProgress } from "@/lib/api/types";
import { colors } from "@/lib/theme";

type LogListProps = {
  logs: AsyncState<LogEntry[]>;
  procedures: AsyncState<ProcedureProgress[]>;
};

export function LogList({ logs, procedures }: LogListProps) {
  return (
    <View style={styles.pad}>
      {/* Prosedür ilerleme kartı */}
      {procedures.data && procedures.data.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bu rotasyonda</Text>
          <Text style={styles.meta}>
            {procedures.data.reduce((sum, p) => sum + p.done, 0)} /{" "}
            {procedures.data.reduce((sum, p) => sum + p.total, 0)} işlem tamamlandı
          </Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            {procedures.data.map((p) => {
              const pct = p.total
                ? Math.min(100, Math.round((p.done / p.total) * 100))
                : 0;
              return (
                <View key={p.id} style={{ gap: 3 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.procName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.procCount}>
                      {p.done}/{p.total}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${pct}%`,
                          backgroundColor:
                            pct >= 100 ? colors.success : colors.kou,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Log listesi */}
      {logs.loading && !logs.data ? (
        <LoadingBlock label="Karneler yükleniyor…" />
      ) : null}
      {logs.error && !logs.data ? (
        <ErrorBlock message={logs.error} onRetry={logs.reload} />
      ) : null}
      {logs.data && logs.data.length === 0 ? (
        <EmptyBlock message="Henüz karne kaydı yok" />
      ) : null}
      {(logs.data ?? []).map((e: LogEntry) => (
        <View key={e.id} style={styles.card}>
          <View style={styles.rowBetweenStart}>
            <Text style={[styles.cardTitle, styles.flex1]}>
              {e.procedureName}
            </Text>
            <View
              style={[
                styles.statusPill,
                e.status === "approved"
                  ? styles.statusApproved
                  : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: statusColor(e.status) },
                ]}
              >
                {logStatusLabel[e.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.meta}>
            {formatLogDateTr(e.date)} · {logRoleLabel[e.role]}
          </Text>
          <Text style={styles.meta}>
            Protokol: {e.encounterId} · {e.supervisorName}
          </Text>
        </View>
      ))}
    </View>
  );
}

function statusColor(status: LogEntry["status"]): string {
  if (status === "approved") return colors.success;
  if (status === "revision_requested") return colors.clinical;
  return colors.warning;
}

const styles = StyleSheet.create({
  pad: { padding: 16, gap: 10 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  meta: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  procName: { fontSize: 11, color: colors.mutedForeground, flex: 1, marginRight: 8 },
  procCount: { fontSize: 11, fontWeight: "700", color: colors.foreground },
  barTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: 999 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBetweenStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  flex1: { flex: 1, minWidth: 0 },
  statusPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  statusApproved: { backgroundColor: colors.success10 },
  statusPending: { backgroundColor: colors.warning10 },
  statusText: { fontSize: 10, fontWeight: "700" },
});
