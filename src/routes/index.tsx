import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BatteryFull,
  Bell,
  BookMarked,
  Link2,
  LogIn,
  MapPinned,
  Signal,
  Stethoscope,
  Syringe,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { LoginSheet } from "@/components/LoginSheet";
import heroCampus from "@/assets/hero-campus.jpg";
import campus1 from "@/assets/campus-1.jpg";
import campus2 from "@/assets/campus-2.jpg";
import campus3 from "@/assets/campus-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KOÜ Tıp Fakültesi Portalı — Duyuru, Menü ve Giriş" },
      {
        name: "description",
        content:
          "Kocaeli Üniversitesi Tıp Fakültesi mobil portalı: fakülte duyuruları, günün yemek menüsü, Umuttepe yerleşke rehberi ve öğrenci/akademisyen girişi.",
      },
      { property: "og:title", content: "KOÜ Tıp Fakültesi Portalı" },
      {
        property: "og:description",
        content:
          "Duyurular, yemekhane menüsü, yerleşke rehberi ve öğrenci/akademisyen portal girişi tek ekranda.",
      },
    ],
  }),
  component: Index,
});

const gallery = [
  { src: campus1, alt: "Tıp Fakültesi hastanesi ana giriş binası" },
  { src: campus2, alt: "Umuttepe yerleşkesi blokları kuş bakışı" },
  { src: campus3, alt: "Tıp Fakültesi amfisi iç görünüm" },
];

const integrations = [
  { label: "HBYS Servisi", icon: Stethoscope },
  { label: "OBS Bağlantısı", icon: Link2 },
  { label: "Kütüphane Veritabanı", icon: BookMarked },
  { label: "Aşılama Takip", icon: Syringe },
];

function Index() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-10">
      <header className="rounded-b-[24px] bg-clinical px-5 pb-6 pt-2 text-clinical-foreground">
        <div className="flex items-center justify-between text-[11px] font-semibold text-clinical-foreground/70">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span>KOÜ-WiFi</span>
            <Wifi size={13} />
            <Signal size={13} />
            <BatteryFull size={15} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Stethoscope size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold leading-tight">
                KOÜ <span className="text-success">Tıp</span> Fakültesi
              </p>
              <p className="truncate text-[11px] text-clinical-foreground/60">
                Umuttepe Yerleşkesi · Kocaeli
              </p>
            </div>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            <LogIn size={15} />
            Giriş Yap
          </button>
        </div>
      </header>

      <main className="space-y-4 px-4 pt-4">
        <section className="relative overflow-hidden rounded-[24px]">
          <img
            src={heroCampus}
            alt="Yeni açılan Tıp Fakültesi araştırma laboratuvarı binası"
            width={1200}
            height={800}
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-clinical via-clinical/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-block rounded-full bg-success px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-success-foreground">
              Kampüs &amp; Haberler
            </span>
            <h1 className="mt-2.5 text-lg font-extrabold leading-snug text-clinical-foreground">
              Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı
            </h1>
            <div className="mt-3 flex justify-end gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === 0 ? "w-5 bg-clinical-foreground" : "w-1.5 bg-clinical-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <BentoCard
            icon={UtensilsCrossed}
            title="Tıp Yemekhane"
            badge="Öğle Yemeği"
            badgeTone="bg-success text-success-foreground"
          >
            <ul className="mt-1.5 space-y-0.5 text-xs leading-snug text-muted-foreground">
              {["Mercimek Çorbası", "Izgara Köfte", "Pilav"].map((m) => (
                <li key={m} className="flex gap-1.5">
                  <span aria-hidden>•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </BentoCard>
          <BentoCard
            icon={Bell}
            title="Fakülte Duyuruları"
            badge="3 Yeni"
            badgeTone="bg-warning text-warning-foreground"
          >
            <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
              2026-2027 Dönem 6 İntörn Nöbet Listeleri Yayınlandı
            </p>
          </BentoCard>
        </section>

        <section className="card-bento p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <MapPinned size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold">Umuttepe Yerleşkesi</h2>
              <p className="text-xs text-muted-foreground">Fakülte Haritası ve Blok Rehberi</p>
            </div>
          </div>
          <div className="no-scrollbar -mx-1 mt-4 flex gap-3 overflow-x-auto px-1">
            {gallery.map((g) => (
              <img
                key={g.alt}
                src={g.src}
                alt={g.alt}
                loading="lazy"
                width={640}
                height={640}
                className="h-24 w-32 shrink-0 rounded-2xl object-cover"
              />
            ))}
          </div>
        </section>

        <section className="card-bento p-5">
          <h2 className="text-base font-bold">Hızlı Eklentiler</h2>
          <p className="text-xs text-muted-foreground">Kurumsal servis entegrasyonları</p>
          <div className="no-scrollbar -mx-1 mt-3 flex flex-nowrap gap-2 overflow-x-auto px-1">
            {integrations.map((i) => (
              <button
                key={i.label}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition-all hover:border-primary/40 active:scale-[0.98]"
              >
                <i.icon size={14} className="text-primary" />
                {i.label}
              </button>
            ))}
          </div>
        </section>

        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
        </p>
      </main>

      {sheetOpen && <LoginSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}

function BentoCard({
  icon: Icon,
  title,
  badge,
  badgeTone = "bg-warning text-warning-foreground",
  children,
}: {
  icon: typeof Bell;
  title: string;
  badge?: string;
  badgeTone?: string;
  children: ReactNode;
}) {
  return (
    <article className="card-bento flex min-h-44 flex-col p-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
        <Icon size={18} />
      </span>
      <h2 className="mt-3 text-sm font-bold leading-tight">{title}</h2>
      {badge && (
        <span
          className={`mt-1.5 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeTone}`}
        >
          {badge}
        </span>
      )}
      {children}
      <div className="mt-auto flex justify-end pt-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
          <ArrowUpRight size={17} />
        </span>
      </div>
    </article>
  );
}
