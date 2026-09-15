import { TabScreen } from "@/components/med/TabScreen";
import { OsceStudent } from "@/components/med/intern/OsceStudent";
import { styles } from "@/components/med/intern/styles";

export default function IntornOsce() {
  return (
    <TabScreen style={styles.root}>
      <OsceStudent />
    </TabScreen>
  );
}
