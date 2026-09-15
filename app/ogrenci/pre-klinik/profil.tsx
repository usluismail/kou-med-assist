import { useState } from "react";
import { MessageSheet } from "@/components/med/MessageSheet";
import { TabScreen } from "@/components/med/TabScreen";
import { ProfileTab } from "@/components/med/preklinik/ProfileTab";
import { s } from "@/components/med/preklinik/styles";

export default function PreKlinikProfil() {
  const [messageOpen, setMessageOpen] = useState(false);
  return (
    <TabScreen style={s.root}>
      <ProfileTab onOpenMessage={() => setMessageOpen(true)} />
      <MessageSheet open={messageOpen} onClose={() => setMessageOpen(false)} />
    </TabScreen>
  );
}
