import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, type LucideIcon } from "lucide-react";

export function DashboardShell({
  kicker,
  name,
  meta,
  icon: Icon,
  children,
}: {
  kicker: string;
  name: string;
  meta: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-10">
      <header className="rounded-b-[24px] bg-clinical px-5 pb-7 pt-6 text-clinical-foreground">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-clinical-foreground/60">
                {kicker}
              </p>
              <p className="truncate text-base font-extrabold leading-tight">{name}</p>
              <p className="truncate text-[11px] text-clinical-foreground/60">{meta}</p>
            </div>
          </div>
          <Link
            to="/"
            aria-label="Çıkış Yap"
            className="shrink-0 rounded-full bg-clinical-foreground/10 p-2.5 text-clinical-foreground transition-colors hover:bg-clinical-foreground/20"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </header>

      <main className="space-y-4 px-4 pt-4">
        {children}
        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
        </p>
      </main>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="card-bento p-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
        <Icon size={18} />
      </span>
      <p className="mt-3 text-sm font-bold leading-tight">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-primary">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}

export function ListCard({
  title,
  subtitle,
  icon: Icon,
  items,
}: {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  items: { title: string; meta: string }[];
}) {
  return (
    <section className="card-bento p-5">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li
            key={it.title}
            className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-3 py-2.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{it.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{it.meta}</span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </section>
  );
}