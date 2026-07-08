import { ReactNode, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface MobileDiagramPillProps {
  activeIdx: number;
  caption?: string;
  children: ReactNode;
}

export function PulsingDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-1.5 w-1.5 shrink-0", className)}>
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-reduce:animate-none motion-safe:animate-ping"
        style={{ background: "var(--ch-accent)" }}
        aria-hidden
      />
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--ch-accent)" }}
      />
    </span>
  );
}

export function DiagramPanelHeader({
  activeIdx,
  className,
}: {
  activeIdx: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between px-1", className)}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        <PulsingDot />
        Live diagram
      </div>
      <span className="font-mono text-[9px] text-white/35">
        Synced · Passage {activeIdx + 1}
      </span>
    </div>
  );
}

export function MobileDiagramPill({ activeIdx, caption, children }: MobileDiagramPillProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full border border-white/12 bg-black/75 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:border-white/20 hover:text-white/85 md:hidden"
        aria-label={`Open live diagram for passage ${activeIdx + 1}`}
      >
        <PulsingDot />
        Live diagram · Pass {activeIdx + 1}
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0c] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            aria-describedby={caption ? "mobile-diagram-caption" : undefined}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <DiagramPanelHeader activeIdx={activeIdx} className="mb-0 flex-1" />
              <DialogPrimitive.Close
                className="ml-3 rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Close diagram"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
              <div aria-live="polite" aria-atomic="true" className="h-full w-full max-h-full">
                {children}
              </div>
            </div>

            {caption && (
              <p
                id="mobile-diagram-caption"
                className="shrink-0 border-t border-white/8 px-4 py-3 text-center font-mono text-[11px] text-white/45"
              >
                {caption}
              </p>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
