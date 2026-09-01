import { TabScreen } from "@/components/med/TabScreen";
import { Scanner } from "@/components/med/faculty/Scanner";
import { styles } from "@/components/med/faculty/styles";

export default function AkademisyenQr() {
  return (
    <TabScreen style={styles.root}>
      <Scanner />
    </TabScreen>
  );
}
