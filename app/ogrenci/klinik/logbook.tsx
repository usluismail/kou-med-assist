import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Logbook, QrSheet, type QrInfo } from "@/components/med/LogbookScreen";
import { TabScreen } from "@/components/med/TabScreen";
import { s } from "@/components/med/klinik/styles";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";

export default function KlinikLogbook() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);

  return (
    <TabScreen style={s.root}>
      <Logbook
        initialTab={mode === "new" ? "new" : "list"}
        title="Staj Logbook"
        subtitle={user?.role === "student" ? user.rotation : undefined}
        headerBackground={colors.primaryDark}
        segmentActiveColor={colors.primary}
        onQrCreated={(info) => setQrInfo(info)}
      />
      <QrSheet open={!!qrInfo} info={qrInfo} onClose={() => setQrInfo(null)} />
    </TabScreen>
  );
}
