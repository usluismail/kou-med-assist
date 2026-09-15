import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Timer } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useOsceSessions } from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function OsceStudent() {
  const insets = useSafeAreaInsets();
  const sessions = useOsceSessions();
  const list = sessions.data ?? [];
  const primary = list[0] ?? null;

  const daysLeft = (date: string) => {
    const diff = new Date(date + "T00:00:00").getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <View>
      <View style={[styles.clinicalHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.screenTitle}>OSCE Sınav Programı</Text>
        <Text style={styles.headerSub}>
          {primary
            ? `${primary.department ?? "Acil Tıp"} · ${primary.stationCount} istasyon`
            : "Objektif Yapılandırılmış Klinik Sınav"}
        </Text>
      </View>
      <View style={styles.listPad}>
        {sessions.loading && !sessions.data ? (
          <LoadingBlock label="OSCE yükleniyor…" />
        ) : null}
        {sessions.error && !sessions.data ? (
          <ErrorBlock message={sessions.error} onRetry={sessions.reload} />
        ) : null}
        {!sessions.loading && list.length === 0 ? (
          <EmptyBlock message="Planlanmış OSCE oturumu yok" />
        ) : null}

        {list.map((session) => {
          const doneCount = session.stations.filter((s) => s.status === "done").length;
          return (
            <View key={session.id} style={{ gap: 10 }}>
              <View style={styles.card}>
                <Text style={styles.infoKicker}>Sınav Oturumu</Text>
                <View style={[styles.rowBetween, { marginTop: 6 }]}>
                  <View style={styles.flex1}>
                    <Text style={styles.cardTitle}>{session.title}</Text>
                    <Text style={styles.meta}>
                      {session.date} · {session.time}
                    </Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Timer size={14} color={colors.info} />
                    <Text style={styles.infoPillText}>
                      {daysLeft(session.date)} Gün
                    </Text>
                  </View>
                </View>
                <View style={styles.osceProgressMeta}>
                  <Text style={styles.meta}>
                    İlerleme: {doneCount}/{session.stationCount} istasyon
                  </Text>
                  <View style={[styles.barTrack, { height: 6, marginTop: 6 }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: 6,
                          width: `${session.stationCount ? (doneCount / session.stationCount) * 100 : 0}%`,
                          backgroundColor: colors.kou,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
              {session.stations.map((st, idx) => (
                <View key={st.id} style={styles.card}>
                  <View style={styles.rowBetween}>
                    <View style={styles.osceStationIndex}>
                      <Text style={styles.osceStationIndexText}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.cardTitle, styles.flex1]} numberOfLines={2}>
                      {st.title}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        st.status === "done"
                          ? styles.statusApproved
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              st.status === "done" ? colors.success : colors.warning,
                          },
                        ]}
                      >
                        {st.status === "done" && st.score != null
                          ? `%${st.score}`
                          : "Bekliyor"}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.meta, { marginLeft: 40 }]}>{st.subtitle}</Text>
                </View>
              ))}
            </View>
          );
        })}

        {primary ? (
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Deneme Sınavını Başlat</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
