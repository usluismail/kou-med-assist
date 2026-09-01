import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, ChevronRight, Repeat2, Wifi } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useProcedures, useStudentDashboard } from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import { ProgressRing } from "./ProgressRing";
import { styles } from "./styles";

export function Dashboard({
  onSwap,
  onLog,
}: {
  onSwap: () => void;
  onLog: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { data, loading, error, reload } = useStudentDashboard();
  const procedures = useProcedures();

  if (loading && !data) return <LoadingBlock label="Dashboard yükleniyor…" />;
  if (error && !data) return <ErrorBlock message={error} onRetry={reload} />;
  if (!data) return <EmptyBlock message="Dashboard verisi yok" />;

  const pct = data.ucepProgress.percent;
  const { done, total } = data.ucepProgress;
  const procs = procedures.data ?? [];
  const shift = data.upcomingShift;

  return (
    <View style={styles.screenPad}>
      <View style={[styles.clinicalHeader, styles.homeHeader, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarSm}>
              <Text style={styles.avatarSmText}>{data.student.initials}</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerName} numberOfLines={1}>
                {data.student.name}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {data.rotation}
              </Text>
            </View>
          </View>
          <Pressable style={styles.bellBtn}>
            <Bell size={20} color={colors.white} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.logSummary.pending}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.dashboardBody}>
        <View style={styles.card}>
          <View style={styles.progressRow}>
            <View style={styles.ringWrap}>
              <ProgressRing
                size={112}
                strokeWidth={10}
                pct={pct}
                trackColor={colors.muted}
                progressColor={colors.kou}
              >
                <View style={styles.ringCenter}>
                  <Text style={styles.ringPct}>%{pct}</Text>
                  <Text style={styles.ringSub}>
                    {done}/{total}
                  </Text>
                </View>
              </ProgressRing>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.kicker}>U-ÇEP İlerlemesi</Text>
              <Text style={styles.progressTitle}>
                {done}/{total} girişim tamamlandı
              </Text>
              <View style={styles.procList}>
                {procs.slice(0, 3).map((p) => (
                  <View key={p.id} style={styles.procItem}>
                    <Text style={styles.procName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${(p.done / p.total) * 100}%`,
                            backgroundColor:
                              p.done === p.total ? colors.success : colors.kou,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {shift ? (
          <View style={[styles.card, styles.warningCard]}>
            <Text style={styles.warningKicker}>Yaklaşan Nöbet</Text>
            <Text style={styles.cardTitle}>{shift.time}</Text>
            <Text style={styles.cardSub}>
              {shift.label} · {shift.area}
            </Text>
            <Pressable onPress={onSwap} style={styles.swapBtn}>
              <Repeat2 size={16} color={colors.clinical} />
              <Text style={styles.swapBtnText}>Takas İstet</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable onPress={onLog} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Son Karne Kayıtları</Text>
              <Text style={styles.cardSub}>
                {data.logSummary.pending} kayıt onay bekliyor
              </Text>
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
