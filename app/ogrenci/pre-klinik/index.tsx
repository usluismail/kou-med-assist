import { useState } from "react";
import { MessageSheet } from "@/components/med/MessageSheet";
import { TabScreen } from "@/components/med/TabScreen";
import { HomeTab } from "@/components/med/preklinik/HomeTab";
import { s } from "@/components/med/preklinik/styles";

export default function PreKlinikHome() {
  const [messageOpen, setMessageOpen] = useState(false);
  return (
    <TabScreen style={s.root}>
      <HomeTab onOpenMessage={() => setMessageOpen(true)} />
      <MessageSheet open={messageOpen} onClose={() => setMessageOpen(false)} />
    </TabScreen>
  );
}
