import { TabScreen } from "@/components/med/TabScreen";
import { ScheduleTab } from "@/components/med/preklinik/ScheduleTab";
import { s } from "@/components/med/preklinik/styles";

export default function PreKlinikProgram() {
  return (
    <TabScreen style={s.root}>
      <ScheduleTab />
    </TabScreen>
  );
}
