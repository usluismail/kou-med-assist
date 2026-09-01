import { ClipboardCheck, Megaphone, ScanLine } from "lucide-react-native";
import { RouterTabBar } from "@/components/med/RouterTabBar";
import { usePendingApprovals } from "@/lib/api/hooks";

export function FacultyTabBar(props: {
  state: { index: number; routes: Array<{ name: string }> };
  navigation?: unknown;
}) {
  const pending = usePendingApprovals();
  const count = pending.data?.length ?? 0;

  return (
    <RouterTabBar
      {...props}
      items={{
        index: {
          label: `Karneler (${count})`,
          icon: ClipboardCheck,
          href: "/akademisyen",
        },
        qr: { label: "QR", icon: ScanLine, href: "/akademisyen/qr" },
        duyurular: {
          label: "Duyuru",
          icon: Megaphone,
          href: "/akademisyen/duyurular",
        },
      }}
    />
  );
}
