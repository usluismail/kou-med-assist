import { useRef, useState } from "react";
import { Check, ChevronsRight } from "lucide-react";

export function SwipeToApprove({
  onApprove,
  approved,
  label = "Onaylamak için kaydır",
}: {
  onApprove: () => void;
  approved: boolean;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [dragging, setDragging] = useState(false);

  const move = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const value = Math.min(1, Math.max(0, (clientX - r.left - 26) / (r.width - 56)));
    setPct(value);
    return value;
  };

  const fill = approved ? 1 : pct;

  return (
    <div
      ref={trackRef}
      className={`relative h-14 w-full select-none overflow-hidden rounded-2xl ${
        approved ? "bg-success" : "bg-clinical/5"
      } touch-none`}
      onPointerDown={(e) => {
        if (approved) return;
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging || approved) return;
        move(e.clientX);
      }}
      onPointerUp={(e) => {
        if (approved) return;
        setDragging(false);
        const v = move(e.clientX) ?? 0;
        if (v > 0.92) {
          setPct(1);
          onApprove();
        } else {
          setPct(0);
        }
      }}
    >
      <div
        className="absolute inset-y-0 left-0 bg-kou/15"
        style={{ width: `calc(${fill * 100}% + 3.25rem)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-semibold">
        {approved ? (
          <span className="text-kou-foreground">ONAYLANDI</span>
        ) : (
          <span className="text-clinical/60">{label}</span>
        )}
      </div>
      <div
        className={`absolute top-1.5 flex size-11 items-center justify-center rounded-xl shadow-lg ${
          approved ? "bg-card text-success" : "bg-kou text-kou-foreground"
        } ${dragging ? "" : "transition-[left] duration-300"}`}
        style={{ left: `calc(0.375rem + ${fill} * (100% - 3.5rem))` }}
      >
        {approved ? <Check className="size-5" /> : <ChevronsRight className="size-5" />}
      </div>
    </div>
  );
}
