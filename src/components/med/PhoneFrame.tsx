import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] sm:max-w-[393px]">
      <div className="relative overflow-hidden rounded-[0px] bg-black sm:rounded-[3.2rem] sm:border-[10px] sm:border-black sm:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.55)]">
        <div className="relative flex h-[100svh] flex-col bg-surface sm:h-[844px]">
          {/* status bar + dynamic island */}
          <div className="relative z-30 flex h-12 shrink-0 items-end justify-between bg-clinical px-6 pb-1 text-[11px] font-semibold text-white">
            <span>09:41</span>
            <div className="absolute left-1/2 top-1.5 h-7 w-[104px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <span className="tracking-tighter">▮▮▮</span>
              <span>KOÜ-WiFi</span>
              <span className="rounded-[3px] border border-white/70 px-1">86</span>
            </span>
          </div>
          {children}
          {/* home indicator */}
          <div className="flex h-5 shrink-0 items-center justify-center bg-card">
            <div className="h-1.5 w-32 rounded-full bg-clinical/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QrCode({ size = 168 }: { size?: number }) {
  const n = 21;
  const cells: boolean[][] = [];
  let seed = 190101044;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let y = 0; y < n; y++) {
    cells.push(Array.from({ length: n }, () => rand() > 0.5));
  }
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on && !isFinder(x, y) ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0F172A" />
          ) : null,
        ),
      )}
      {(
        [
          [0, 0],
          [n - 7, 0],
          [0, n - 7],
        ] as Array<[number, number]>
      ).map(([x, y]) => (
        <g key={`f${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="#008542" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#008542" />
        </g>
      ))}
    </svg>
  );
}
