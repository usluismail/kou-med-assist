import type { ReactNode } from "react";
import { X } from "lucide-react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-clinical/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <div className="animate-sheet-up relative max-h-[88%] overflow-y-auto rounded-t-3xl bg-card px-5 pb-6 pt-3 no-scrollbar">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-muted p-1.5 text-muted-foreground"
            aria-label="Kapat"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
