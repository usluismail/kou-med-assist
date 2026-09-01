import { useState } from "react";
import { MessageSheet } from "@/components/med/MessageSheet";
import { TabScreen } from "@/components/med/TabScreen";
import { ProfileTab } from "@/components/med/klinik/ProfileTab";
import { s } from "@/components/med/klinik/styles";

export default function KlinikProfil() {
  const [messageOpen, setMessageOpen] = useState(false);
  return (
    <TabScreen style={s.root}>
      <ProfileTab onOpenMessage={() => setMessageOpen(true)} />
      <MessageSheet
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        defaultRecipient="internship_supervisor"
      />
    </TabScreen>
  );
}
