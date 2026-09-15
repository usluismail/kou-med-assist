import { TabScreen } from "@/components/med/TabScreen";
import { GradesTab } from "@/components/med/preklinik/GradesTab";
import { s } from "@/components/med/preklinik/styles";

export default function PreKlinikNotlar() {
  return (
    <TabScreen style={s.root}>
      <GradesTab />
    </TabScreen>
  );
}
