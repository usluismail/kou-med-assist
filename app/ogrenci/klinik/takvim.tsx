import { TabScreen } from "@/components/med/TabScreen";
import { ScheduleTab } from "@/components/med/klinik/ScheduleTab";
import { s } from "@/components/med/klinik/styles";

export default function KlinikTakvim() {
  return (
    <TabScreen style={s.root}>
      <ScheduleTab />
    </TabScreen>
  );
}
