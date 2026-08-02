import { createFileRoute } from "@tanstack/react-router";
import { Award, FileCheck2, Mic, QrCode } from "lucide-react";
import { DashboardShell, StatCard, ListCard } from "@/components/DashboardShell";

export const Route = createFileRoute("/akademisyen")({
  head: () => ({
    meta: [
      { title: "Akademisyen Paneli — KOÜ Tıp Fakültesi" },
      {
        name: "description",
        content:
          "Karne onayları, QR ile hızlı değerlendirme, sesli not ve rubrik yönetimi öğretim üyeleri için tek panelde.",
      },
      { property: "og:title", content: "Akademisyen Paneli — KOÜ Tıp" },
      {
        property: "og:description",
        content: "Karne onayları, QR değerlendirme, sesli not ve rubrikler.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FacultyDashboard,
});

function FacultyDashboard() {
  return (
    <DashboardShell
      kicker="Öğretim Üyesi"
      name="Prof. Dr. Ahmet Şahin"
      meta="Genel Cerrahi Anabilim Dalı"
      icon={Award}
    >
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={FileCheck2} label="Bekleyen Onay" value="12" hint="U-ÇEP karnesi" />
        <StatCard icon={QrCode} label="QR Değerlendirme" value="5" hint="Bugün tamamlanan" />
      </div>
      <ListCard
        title="Karne Onayları"
        subtitle="Sıradaki öğrenciler"
        items={[
          { title: "Elif Yıldırım · Dönem 6", meta: "8 girişim kaydı onay bekliyor" },
          { title: "Mert Kaya · Dönem 6", meta: "3 girişim kaydı onay bekliyor" },
          { title: "Selin Demir · Dönem 5", meta: "OSCE rubriği tamamlanmadı" },
        ]}
      />
      <ListCard
        title="Sesli Notlar"
        subtitle="Son kayıtlar"
        icon={Mic}
        items={[
          { title: "Vizit değerlendirmesi", meta: "01:24 · Bugün 09:10" },
          { title: "OSCE İstasyon 3 geri bildirim", meta: "02:05 · Dün 16:40" },
        ]}
      />
    </DashboardShell>
  );
}