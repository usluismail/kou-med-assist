import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
  Plus,
  QrCode as QrIcon,
  Repeat2,
  ScanBarcode,
  Search,
  ShieldCheck,
  Stethoscope,
  Timer,
  User,
  Wifi,
} from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { QrCode } from "./PhoneFrame";
import {
  COLLEAGUES,
  LOG_ENTRIES,
  PROCEDURES,
  SHIFTS,
  STUDENT,
  SUPERVISORS,
} from "@/lib/med-data";

type Tab = "home" | "logbook" | "shifts" | "osce" | "profile";

const doneTotal = 42;

export function StudentApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [qrOpen, setQrOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {tab === "home" && (
          <Dashboard onSwap={() => setSwapOpen(true)} onLog={() => setTab("logbook")} />
        )}
        {tab === "logbook" && <Logbook onQr={() => setQrOpen(true)} />}
        {tab === "shifts" && <ShiftsScreen onSwap={() => setSwapOpen(true)} />}
        {tab === "osce" && <OsceStudent />}
        {tab === "profile" && <Profile />}
      </div>

      {tab === "home" && (
        <button
          onClick={() => setTab("logbook")}
          className="absolute bottom-24 right-5 z-20 flex items-center gap-2 rounded-2xl bg-kou px-5 py-4 text-sm font-semibold text-kou-foreground shadow-[0_16px_32px_-12px_rgba(0,133,66,0.8)] transition-transform active:scale-95"
        >
          <Plus className="size-5" /> Log Ekle
        </button>
      )}

      <nav className="z-20 grid shrink-0 grid-cols-5 border-t border-border bg-card pt-2">
        {(
          [
            ["home", "Ana Sayfa", Home],
            ["logbook", "Karne", ClipboardList],
            ["shifts", "Nöbet", Calendar],
            ["osce", "OSCE", Stethoscope],
            ["profile", "Profil", User],
          ] as Array<[Tab, string, typeof Home]>
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-col items-center gap-1 pb-2 text-[10px] font-medium transition-colors ${
              tab === key ? "text-kou" : "text-muted-foreground"
            }`}
          >
            <Icon className={`size-5 ${tab === key ? "stroke-[2.5]" : ""}`} />
            {label}
          </button>
        ))}
      </nav>

      <QrSheet open={qrOpen} onClose={() => setQrOpen(false)} />
      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} />
    </div>
  );
}

function Dashboard({ onSwap, onLog }: { onSwap: () => void; onLog: () => void }) {
  const pct = 70;
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="pb-28">
      <header className="bg-clinical px-5 pb-8 pt-4 text-white">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-kou text-sm font-bold">
              {STUDENT.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{STUDENT.name}</p>
              <p className="truncate text-[11px] text-white/60">
                Dönem 6 - Acil Tıp Stajı
              </p>
            </div>
          </div>
          <button className="relative rounded-full bg-white/10 p-2.5">
            <Bell className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold">
              3
            </span>
          </button>
        </div>
      </header>

      <div className="-mt-5 space-y-3 px-4">
        <section className="rounded-3xl bg-card p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative grid shrink-0 place-items-center">
              <svg width="112" height="112" className="-rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={r}
                  className="fill-none stroke-muted"
                  strokeWidth="10"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={r}
                  className="fill-none stroke-kou transition-[stroke-dashoffset] duration-1000"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - pct / 100)}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-xl font-bold leading-none">%{pct}</p>
                <p className="text-[10px] text-muted-foreground">{doneTotal}/60</p>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                U-ÇEP İlerlemesi
              </p>
              <p className="text-sm font-semibold">42/60 girişim tamamlandı</p>
              <div className="mt-2 space-y-1.5">
                {PROCEDURES.slice(0, 3).map((p) => (
                  <div key={p.name}>
                    <p className="truncate text-[10px] text-muted-foreground">{p.name}</p>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className={`h-1.5 rounded-full ${p.done === p.total ? "bg-success" : "bg-kou"}`}
                        style={{ width: `${(p.done / p.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border-l-4 border-warning bg-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-warning">
            Yaklaşan Nöbet
          </p>
          <p className="mt-1 text-sm font-semibold">Bu Akşam 16:00 - 08:00</p>
          <p className="text-xs text-muted-foreground">Acil Servis · Kırmızı Alan</p>
          <button
            onClick={onSwap}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-clinical/5 py-2.5 text-xs font-semibold text-clinical"
          >
            <Repeat2 className="size-4" /> Takas İstet
          </button>
        </section>

        <section className="flex items-center justify-between rounded-3xl bg-card p-4 shadow-sm">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-info">
              Komite Sınavı
            </p>
            <p className="truncate text-sm font-semibold">Acil Tıp OSCE Sınavı</p>
            <p className="text-xs text-muted-foreground">28 Ağustos 2026 · 09:00</p>
          </div>
          <span className="shrink-0 rounded-full bg-info/10 px-3 py-1.5 text-xs font-bold text-info">
            23 Gün Kaldı
          </span>
        </section>

        <button
          onClick={onLog}
          className="flex w-full items-center justify-between rounded-3xl bg-card p-4 text-left shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold">Son Karne Kayıtları</p>
            <p className="text-xs text-muted-foreground">1 kayıt onay bekliyor</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function Logbook({ onQr }: { onQr: () => void }) {
  const [tab, setTab] = useState<"list" | "new">("list");
  const [proc, setProc] = useState("");
  const [age, setAge] = useState("Yetişkin");
  const [sex, setSex] = useState("Kadın");
  const [role, setRole] = useState("Bizzat Yaptım");
  const suggestions = PROCEDURES.filter(
    (p) => proc.length > 1 && p.name.toLowerCase().includes(proc.toLowerCase()),
  );

  return (
    <div className="pb-6">
      <header className="bg-clinical px-5 pb-4 pt-4 text-white">
        <h1 className="text-lg font-semibold">Dijital Klinik Karne</h1>
        <p className="text-[11px] text-white/60">{STUDENT.faculty}</p>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/10 p-1">
          {(
            [
              ["list", "Kayıtlarım"],
              ["new", "Yeni Kayıt"],
            ] as Array<["list" | "new", string]>
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                tab === k ? "bg-card text-clinical" : "text-white/70"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      {tab === "list" ? (
        <div className="space-y-2.5 p-4">
          {LOG_ENTRIES.map((e) => (
            <div key={e.id} className="rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-snug">{e.proc}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    e.status === "onaylandi"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {e.status === "onaylandi" ? "ONAYLANDI" : "BEKLİYOR"}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {e.date} · {e.role}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Protokol: {e.id} · {e.supervisor}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 p-4">
          <Field label="Girişim / Prosedür">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                value={proc}
                onChange={(e) => setProc(e.target.value)}
                placeholder="Damar Yolu Açma / İntravenöz Kanül"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-kou"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-1 overflow-hidden rounded-xl border border-border bg-card">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setProc(s.name)}
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <Field label="Encounter ID (HBYS Protokol No)">
            <div className="flex gap-2">
              <input
                defaultValue="ENC-2026-"
                className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-kou"
              />
              <button className="flex shrink-0 items-center gap-1.5 rounded-xl bg-clinical px-3 text-xs font-semibold text-white">
                <ScanBarcode className="size-4" /> Barkod
              </button>
            </div>
          </Field>

          <Field label="Hasta Demografisi">
            <Segmented
              options={["Pediatrik", "Yetişkin", "Geriatrik"]}
              value={age}
              onChange={setAge}
            />
            <div className="mt-2">
              <Segmented options={["Kadın", "Erkek"]} value={sex} onChange={setSex} />
            </div>
          </Field>

          <Field label="Öğrenci Rolü">
            <div className="flex flex-wrap gap-2">
              {["Gözlemledim", "Yardım Ettim", "Bizzat Yaptım"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    role === r
                      ? "border-kou bg-kou text-kou-foreground"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Onaylayacak Öğretim Üyesi">
            <select className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-kou">
              {SUPERVISORS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <div className="space-y-2 pt-1">
            <button className="w-full rounded-xl bg-clinical/5 py-3 text-sm font-semibold text-clinical">
              Push ile Gönder
            </button>
            <button
              onClick={onQr}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground shadow-[0_12px_24px_-12px_rgba(0,133,66,0.9)] active:scale-[0.99]"
            >
              <QrIcon className="size-4" /> Yüz Yüze QR Kod Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QrSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (!open) return;
    setLeft(30);
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 30 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [open]);
  const r = 96;
  const c = 2 * Math.PI * r;

  return (
    <BottomSheet open={open} onClose={onClose} title="Yüz Yüze Onay QR Kodu">
      <div className="flex flex-col items-center pb-2">
        <div className="relative grid place-items-center">
          <svg width="220" height="220" className="-rotate-90">
            <circle
              cx="110"
              cy="110"
              r={r}
              className="fill-none stroke-muted"
              strokeWidth="6"
            />
            <circle
              cx="110"
              cy="110"
              r={r}
              className="fill-none stroke-kou transition-[stroke-dashoffset] duration-1000 ease-linear"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - left / 30)}
            />
          </svg>
          <div className="absolute rounded-2xl bg-card p-2 shadow-sm">
            <QrCode size={150} />
          </div>
        </div>
        <p className="mt-2 text-xs font-semibold text-kou">{left} saniye geçerli</p>
        <div className="mt-3 w-full rounded-2xl bg-muted/60 p-3 text-center">
          <p className="text-sm font-semibold">{STUDENT.name}</p>
          <p className="text-[11px] text-muted-foreground">
            No: {STUDENT.no} · {STUDENT.rotation}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Damar Yolu Açma · Protokol ENC-2026-881
          </p>
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-ping rounded-full bg-info" />
            <span className="relative inline-flex size-2 rounded-full bg-info" />
          </span>
          Akademisyen Taraması Bekleniyor...
        </p>
      </div>
    </BottomSheet>
  );
}

function ShiftsScreen({ onSwap }: { onSwap: () => void }) {
  const [detail, setDetail] = useState<(typeof SHIFTS)[number] | null>(null);
  const color = (s: string) =>
    s === "completed"
      ? "bg-success/15 text-success"
      : s === "night"
        ? "bg-info/15 text-info"
        : "bg-warning/15 text-warning";

  return (
    <div className="pb-6">
      <header className="bg-clinical px-5 pb-4 pt-4 text-white">
        <h1 className="text-lg font-semibold">Nöbet Takvimi</h1>
        <p className="text-[11px] text-white/60">Ağustos 2026 · Acil Tıp AD</p>
      </header>

      <div className="p-4">
        <div className="rounded-3xl bg-card p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 4;
              const shift = SHIFTS.find((s) => s.day === day);
              return (
                <button
                  key={i}
                  disabled={!shift}
                  onClick={() => shift && setDetail(shift)}
                  className={`grid aspect-square place-items-center rounded-lg text-[11px] font-semibold ${
                    day < 1 || day > 31
                      ? "text-transparent"
                      : shift
                        ? color(shift.state)
                        : "text-muted-foreground"
                  }`}
                >
                  {day > 0 && day <= 31 ? day : "·"}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <Legend cls="bg-success" text="Tamamlandı" />
            <Legend cls="bg-warning" text="Yaklaşan" />
            <Legend cls="bg-info" text="Gece Nöbeti" />
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {SHIFTS.map((s) => (
            <button
              key={s.label}
              onClick={() => setDetail(s)}
              className="flex w-full items-center justify-between rounded-2xl bg-card p-4 text-left shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {s.time} · {s.area}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${color(s.state)}`}
              >
                {s.state === "completed"
                  ? "Tamamlandı"
                  : s.state === "night"
                    ? "Gece"
                    : "Yaklaşan"}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onSwap}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground shadow-[0_12px_24px_-12px_rgba(0,133,66,0.9)]"
        >
          <Repeat2 className="size-4" /> Nöbet Takas Talebi
        </button>
      </div>

      <BottomSheet
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.label ?? ""}
      >
        {detail && (
          <div className="space-y-3 pb-2">
            <div className="rounded-2xl bg-muted/60 p-3">
              <p className="text-sm font-semibold">{detail.area}</p>
              <p className="text-[11px] text-muted-foreground">{detail.time}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Nöbet Arkadaşları
              </p>
              {detail.partners.map((p) => (
                <p key={p} className="text-sm">
                  {p}
                </p>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Sorumlu Öğretim Üyesi
              </p>
              <p className="text-sm">Doç. Dr. Ayşe Kaya</p>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function SwapSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <BottomSheet
      open={open}
      onClose={() => {
        setSent(false);
        onClose();
      }}
      title="Nöbet Takas Talebi"
    >
      <div className="space-y-3 pb-2">
        <Field label="Takas edilecek nöbetim">
          <select className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
            {SHIFTS.filter((s) => s.state !== "completed").map((s) => (
              <option key={s.label}>
                {s.label} · {s.area}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Takas yapılacak arkadaş">
          <select className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
            {COLLEAGUES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Arkadaşın nöbeti">
          <select className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
            <option>09 Ağustos 2026 · 00:00 - 08:00 · Travma</option>
            <option>14 Ağustos 2026 · 16:00 - 08:00 · Sarı Alan</option>
          </select>
        </Field>
        <div className="flex items-start gap-2 rounded-xl bg-success/10 p-3 text-success">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p className="text-[11px] font-semibold">
            80 Saat Yasal Çalışma Limiti Kontrol Edildi: UYGUN
          </p>
        </div>
        {sent ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-success py-3.5 text-sm font-semibold text-kou-foreground">
            <CheckCircle2 className="size-4" /> Teklif Gönderildi
          </div>
        ) : (
          <button
            onClick={() => setSent(true)}
            className="w-full rounded-xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground"
          >
            Takas Teklifi Gönder
          </button>
        )}
      </div>
    </BottomSheet>
  );
}

function OsceStudent() {
  return (
    <div className="pb-6">
      <header className="bg-clinical px-5 pb-4 pt-4 text-white">
        <h1 className="text-lg font-semibold">Mobil Pratik Sınav (OSCE)</h1>
        <p className="text-[11px] text-white/60">Acil Tıp · 6 istasyon</p>
      </header>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between rounded-3xl bg-card p-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Acil Tıp OSCE Sınavı</p>
            <p className="text-[11px] text-muted-foreground">28 Ağustos 2026 · 09:00</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-info/10 px-3 py-1.5 text-xs font-bold text-info">
            <Timer className="size-3.5" /> 23 Gün
          </span>
        </div>
        {[
          ["İstasyon 1: Temel Yaşam Desteği", "Pratik tamamlandı", "success"],
          ["İstasyon 2: EKG Yorumlama", "Pratik tamamlandı", "success"],
          ["İstasyon 3: Solunum Sistemi Muayenesi", "Deneme bekliyor", "warning"],
          ["İstasyon 4: Sutür ve Yara Bakımı", "Deneme bekliyor", "warning"],
        ].map(([title, sub, tone]) => (
          <div key={title} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-semibold">{title}</p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tone === "success"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {tone === "success" ? "%92" : "—"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{sub}</p>
          </div>
        ))}
        <button className="w-full rounded-2xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground">
          Deneme Sınavını Başlat
        </button>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="pb-6">
      <header className="bg-clinical px-5 pb-6 pt-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-kou text-base font-bold">
            {STUDENT.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{STUDENT.name}</p>
            <p className="text-[11px] text-white/60">Öğrenci No: {STUDENT.no}</p>
            <p className="text-[11px] text-white/60">{STUDENT.rotation}</p>
          </div>
        </div>
      </header>
      <div className="space-y-3 p-4">
        <section className="rounded-3xl bg-card p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold">U-ÇEP Girişim Karnesi</p>
          <div className="space-y-3">
            {PROCEDURES.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-xs">{p.name}</p>
                  <span
                    className={`shrink-0 text-[11px] font-bold ${p.done === p.total ? "text-success" : "text-kou"}`}
                  >
                    {p.done}/{p.total}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className={`h-2 rounded-full ${p.done === p.total ? "bg-success" : "bg-kou"}`}
                    style={{ width: `${(p.done / p.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl bg-card p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold">Entegrasyonlar</p>
          {[
            ["HBYS Hasta Protokol Servisi", "Bağlı", true],
            ["KOÜ Öğrenci Bilgi Sistemi (OBS)", "Bağlı", true],
            ["Offline SQLCipher Yerel Kasa", "Aktif · 2 kayıt", true],
            ["e-Nabız Girişim Doğrulama", "Bağlı değil", false],
          ].map(([label, state, ok]) => (
            <div
              key={label as string}
              className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Wifi
                  className={`size-4 shrink-0 ${ok ? "text-success" : "text-muted-foreground"}`}
                />
                <p className="truncate text-xs">{label as string}</p>
              </div>
              <span
                className={`shrink-0 text-[10px] font-bold ${ok ? "text-success" : "text-muted-foreground"}`}
              >
                {state as string}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="grid gap-1 rounded-xl bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
            value === o ? "bg-card text-clinical shadow-sm" : "text-muted-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Legend({ cls, text }: { cls: string; text: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`size-2 rounded-full ${cls}`} /> {text}
    </span>
  );
}
