import { TabScreen } from "@/components/med/TabScreen";
import { Profile } from "@/components/med/intern/Profile";
import { styles } from "@/components/med/intern/styles";

export default function IntornProfil() {
  return (
    <TabScreen style={styles.root}>
      <Profile />
    </TabScreen>
  );
}
