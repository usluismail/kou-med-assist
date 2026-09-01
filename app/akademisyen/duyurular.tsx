import { TabScreen } from "@/components/med/TabScreen";
import { AnnouncementConsole } from "@/components/med/faculty/AnnouncementConsole";
import { styles } from "@/components/med/faculty/styles";

export default function AkademisyenDuyurular() {
  return (
    <TabScreen style={styles.root}>
      <AnnouncementConsole />
    </TabScreen>
  );
}
