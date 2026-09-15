import { useState } from "react";
import { Logbook, QrSheet, type QrInfo } from "@/components/med/LogbookScreen";
import { TabScreen } from "@/components/med/TabScreen";
import { styles } from "@/components/med/intern/styles";

export default function IntornKarne() {
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);
  return (
    <TabScreen style={styles.root}>
      <Logbook onQrCreated={(info) => setQrInfo(info)} initialTab="list" />
      <QrSheet open={!!qrInfo} info={qrInfo} onClose={() => setQrInfo(null)} />
    </TabScreen>
  );
}
