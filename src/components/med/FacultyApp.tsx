import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  CloudOff,
  Cloud,
  Mic,
  ScanLine,
  Stethoscope,
} from "lucide-react";
import { SwipeToApprove } from "./SwipeToApprove";
import { PENDING_APPROVALS } from "@/lib/med-data";

type Tab = "pending" | "scanner" | "osce";

export function FacultyApp() {
  const [tab, setTab] = useState<Tab>("pending");
  const [approved, setApproved] = useState<string[]>([]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="bg-clinical px-5 pb-4 pt-4 text-white">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Doç. Dr. Ayşe Kaya</p>
            <p className="truncate text-[11px] text-white/60">
              Acil Tıp AD · Eğitim Sorumlusu
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-kou/20 px-3 py-1.5 text-[10px] font-bold text-white">
            Hızlı Onay Paneli
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-white/10 p-1">
          {(
            [
              ["pending", `Karneler (${PENDING_APPROVALS.length - approved.length})`],
              ["scanner", "QR Tarayıcı"],
              ["osce", "OSCE Rubrik"],
            ] as Array<[Tab, string]>
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg py-2 text-[11px] font-semibold transition-colors ${
                tab === k ? "bg-card text-clinical" : "text-white/70"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {tab === "pending" && (
          <ApprovalList
            approved={approved}
            onApprove={(id) => setApproved((a) => [...a, id])}
          />
        )}
        {tab === "scanner" && <Scanner />}
        {tab === "osce" && <OsceRubric />}
      </div>
    </div>
  );
}

function ApprovalList({
  approved,
  onApprove,
}: {
  approved: string[];
  onApprove: (id: string) => void;
}) {
  return (
    <div className="space-y-3 p-4 pb-6">
      {PENDING_APPROVALS.map((item) => (
        <ApprovalCard
          key={item.id}
          item={item}
          approved={approved.includes(item.id)}
          onApprove={() => onApprove(item.id)}
        />
      ))}
    </div>
  );
}

function ApprovalCard({
  item,
  approved,
  onApprove,
}: {
  item: (typeof PENDING_APPROVALS)[number];
  approved: boolean;
  onApprove: () => void;
}) {
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);

  const dictate = () => {
    setRecording(true);
    setTimeout(() => {
      setNote("Teknik usulüne uygun, hasta iletişimi başarılı.");
      setRecording(false);
    }, 900);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-card p-4 shadow-sm transition-opacity ${
        approved ? "opacity-90" : ""
      }`}
    >
      {approved && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
          <CheckCircle2 className="size-3" /> APPROVED
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-kou/10 text-kou">
          <ClipboardCheck className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.student}</p>
          <p className="truncate text-xs text-muted-foreground">{item.proc}</p>
          <p className="text-[11px] text-muted-foreground">
            Protokol: {item.id} · {item.time}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-muted/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sesli Geri Bildirim
          </p>
          <button
            onClick={dictate}
            className={`grid size-8 place-items-center rounded-full ${
              recording ? "animate-pulse bg-danger text-white" : "bg-kou text-white"
            }`}
            aria-label="Sesli not al"
          >
            <Mic className="size-4" />
          </button>
        </div>
        <p className="mt-2 min-h-8 text-xs italic text-clinical/80">
          {note || (recording ? "Dinleniyor…" : "Mikrofona dokunun (Talk-to-Text)")}
        </p>
      </div>

      <div className="mt-3">
        <SwipeToApprove approved={approved} onApprove={onApprove} />
      </div>

      {approved && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="absolute size-1.5 animate-ping rounded-full"
              style={{
                left: `${8 + i * 6.4}%`,
                top: `${20 + ((i * 37) % 60)}%`,
                backgroundColor: ["#10B981", "#008542", "#F59E0B", "#3B82F6"][i % 4],
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Scanner() {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="p-4 pb-6">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-clinical">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
          {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map(
            (pos) => (
              <span
                key={pos}
                className={`absolute ${pos} size-10 rounded-lg border-4 border-kou`}
                style={{ borderRadius: 12 }}
              />
            ),
          )}
          <div className="absolute inset-x-2 top-2 h-0.5 animate-[bounce_2s_ease-in-out_infinite] bg-kou/80" />
        </div>
        <p className="absolute inset-x-0 bottom-24 text-center text-xs text-white/70">
          Öğrencinin QR kodunu çerçeveye hizalayın
        </p>
        <button
          onClick={() => setScanned(true)}
          className="absolute inset-x-6 bottom-8 rounded-2xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground"
        >
          <span className="flex items-center justify-center gap-2">
            <ScanLine className="size-4" /> Taramayı Simüle Et
          </span>
        </button>
      </div>
      {scanned && (
        <div className="mt-3 rounded-3xl bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-success">
            QR Doğrulandı
          </p>
          <p className="mt-1 text-sm font-semibold">İnt. Dr. Ahmet Yılmaz · 190101044</p>
          <p className="text-xs text-muted-foreground">
            Damar Yolu Açma · Protokol ENC-2026-881
          </p>
          <div className="mt-3">
            <SwipeToApprove approved={false} onApprove={() => setScanned(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function OsceRubric() {
  const [seconds, setSeconds] = useState(255);
  const [item1, setItem1] = useState<string | null>(null);
  const [likert, setLikert] = useState<number | null>(null);
  const [global, setGlobal] = useState(65);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="space-y-3 p-4 pb-6">
      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-kou">
              İstasyon 3
            </p>
            <p className="text-sm font-semibold leading-snug">
              Solunum Sistemi Muayenesi
            </p>
          </div>
          <button
            onClick={() => setOnline((v) => !v)}
            className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${
              online ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}
          >
            {online ? <Cloud className="size-3" /> : <CloudOff className="size-3" />}
            {online ? "Online (Synced)" : "Offline (SQLCipher)"}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-kou/15 text-xs font-bold text-kou">
            ZK
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Aday #104 - Zeynep Kaya</p>
            <p className="text-[11px] text-muted-foreground">Dönem 6 · Grup B</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-clinical px-2.5 py-1.5 text-white">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-danger" />
              <span className="relative inline-flex size-2 rounded-full bg-danger" />
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <p className="text-xs font-semibold leading-snug">
          1. Hastanın sırtını doğru pozisyonda oskülte etti.
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {([
            ["Evet", "5p"],
            ["Kısmen", "2.5p"],
            ["Hayır", "0p"],
          ] as Array<[string, string]>).map(([l, p]) => (
            <button
              key={l}
              onClick={() => setItem1(l)}
              className={`rounded-xl border py-2 text-[11px] font-semibold transition-colors ${
                item1 === l
                  ? "border-kou bg-kou text-kou-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {l} <span className="opacity-70">({p})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <p className="text-xs font-semibold leading-snug">
          2. İletişim ve aydınlatılmış onam.
        </p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setLikert(n)}
              className={`aspect-square rounded-xl border text-sm font-bold transition-colors ${
                likert === n
                  ? "border-kou bg-kou text-kou-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Global Rating Scale</p>
          <span className="text-sm font-bold text-kou">%{global}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={global}
          onChange={(e) => setGlobal(Number(e.target.value))}
          className="mt-3 h-2 w-full appearance-none rounded-full bg-muted accent-kou"
          style={{
            background: `linear-gradient(to right, var(--color-kou) ${global}%, var(--color-muted) ${global}%)`,
          }}
        />
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-kou py-3.5 text-sm font-semibold text-kou-foreground shadow-[0_12px_24px_-12px_rgba(0,133,66,0.9)]">
        <Stethoscope className="size-4" /> İstasyonu Tamamla ve Kaydet
      </button>
    </div>
  );
}
