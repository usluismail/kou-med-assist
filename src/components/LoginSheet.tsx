import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  UserRound,
  X,
} from "lucide-react";

type Role = "student" | "faculty";

const roles = [
  {
    id: "student" as const,
    icon: GraduationCap,
    tone: "bg-primary",
    kicker: "İntörn Hekim / Öğrenci Girişi",
    title: "Öğrenci Portalı",
    subtitle: "U-ÇEP Karnesi, Nöbet Takas, OSCE ve Girişim Logları",
  },
  {
    id: "faculty" as const,
    icon: Award,
    tone: "bg-clinical",
    kicker: "Öğretim Üyesi / Akademisyen Girişi",
    title: "Akademisyen Portalı",
    subtitle: "Karne Onayları, QR Değerlendirme, Sesli Not ve Rubrikler",
  },
];

export function LoginSheet({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-clinical/60 backdrop-blur-[2px] animate-fade-in"
      />
      <div className="animate-sheet-up relative w-full max-w-md rounded-t-[24px] bg-card px-5 pb-8 pt-3 shadow-2xl">
        <div className="mx-auto h-1.5 w-11 rounded-full bg-accent" />

        {role === null ? (
          <>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight">Giriş Türünü Seçin</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Devam etmek için yetkinize uygun paneli seçiniz.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="shrink-0 rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-accent"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className="flex w-full items-center gap-4 rounded-[20px] border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${r.tone} text-primary-foreground`}
                  >
                    <r.icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {r.kicker}
                    </span>
                    <span className="block text-base font-bold">{r.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </span>
                  <ChevronRight size={20} className="shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <LoginForm role={role} onBack={() => setRole(null)} />
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
        </p>
      </div>
    </div>
  );
}

function LoginForm({ role, onBack }: { role: Role; onBack: () => void }) {
  const student = role === "student";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const valid = identifier.trim().length > 2 && password.length >= 4;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setTimeout(() => {
      navigate({ to: student ? "/ogrenci" : "/akademisyen" });
    }, 900);
  };

  return (
    <form className="mt-5" onSubmit={submit}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Geri"
          className="rounded-full border border-border bg-secondary p-2 text-muted-foreground transition-all hover:bg-accent active:scale-[0.95]"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold tracking-tight">
            {student ? "Öğrenci Portalı" : "Akademisyen Portalı"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {student ? "Öğrenci numaranız ile giriş yapın" : "Kurumsal e-posta ile giriş yapın"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Field
          icon={student ? UserRound : Mail}
          label={student ? "Öğrenci No" : "Kurumsal E-Posta"}
          placeholder={student ? "2026123456" : "ad.soyad@kocaeli.edu.tr"}
          type={student ? "text" : "email"}
          value={identifier}
          onChange={setIdentifier}
        />
        <Field
          icon={Lock}
          label="Şifre"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-secondary-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-[var(--primary)]"
          />
          Beni Hatırla
        </label>
        <button type="button" className="text-xs font-semibold text-primary hover:underline">
          Şifremi Unuttum?
        </button>
      </div>

      <button
        type="submit"
        disabled={!valid || loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark active:scale-[0.99] disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type,
  value,
  onChange,
  trailing,
}: {
  icon: typeof Lock;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-secondary-foreground">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 focus-within:border-primary">
        <Icon size={16} className="shrink-0 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        {trailing}
      </span>
    </label>
  );
}