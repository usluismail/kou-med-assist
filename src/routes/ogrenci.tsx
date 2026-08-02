import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, ClipboardCheck, GraduationCap, Syringe } from "lucide-react";
import { DashboardShell, StatCard, ListCard } from "@/components/DashboardShell";

export const Route = createFileRoute("/ogrenci")({
  head: () => ({
    meta: [
      { title: "İntörn Hekim Paneli — KOÜ Tıp Fakültesi" },
      {
        name: "description",
        content:
          "U-ÇEP karnesi, nöbet takas talepleri, OSCE sonuçları ve girişim loglarını tek ekranda takip edin.",
      },
      { property: "og:title", content: "İntörn Hekim Paneli — KOÜ Tıp" },
      {
        property: "og:description",
        content: "U-ÇEP karnesi, nöbet takası, OSCE ve girişim logları.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <DashboardShell
      kicker="İntörn Hekim"
      name="Dr. Elif Yıldırım"
      meta="Dönem 6 · Genel Cerrahi Rotasyonu"
      icon={GraduationCap}
    >
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={ClipboardCheck} label="U-ÇEP Karnesi" value="%74" hint="Tamamlanan yetkinlik" />
        <StatCard icon={CalendarClock} label="Aktif Nöbet" value="3" hint="Bu ay planlanan" />
      </div>
      <ListCard
        title="Nöbet Takas Talepleri"
        subtitle="Bekleyen istekler"
        items={[
          { title: "12 Ağustos · Acil Servis", meta: "Dr. M. Kaya ile takas — Onay bekliyor" },
          { title: "19 Ağustos · Dahiliye", meta: "Dr. S. Demir ile takas — Onaylandı" },
        ]}
      />
      <ListCard
        title="Girişim Logları"
        subtitle="Son kayıtlar"
        icon={Syringe}
        items={[
          { title: "IV Kanülasyon", meta: "4 kayıt · Süpervizör onaylı" },
          { title: "Sütür Atma", meta: "2 kayıt · Onay bekliyor" },
          { title: "OSCE İstasyon 3", meta: "Puan: 86/100" },
        ]}
      />
    </DashboardShell>
  );
}