import type { ReactNode } from "react";

interface HudPanelProps {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function HudPanel({ title, right, children, className = "", delay = 0 }: HudPanelProps) {
  return (
    <section
      className={`hud-panel anim-rise flex flex-col ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {/* corner brackets */}
      <span aria-hidden className="pointer-events-none absolute -top-px -left-px h-3.5 w-3.5 border-t border-l border-cyanhud/80" />
      <span aria-hidden className="pointer-events-none absolute -top-px -right-px h-3.5 w-3.5 border-t border-r border-cyanhud/80" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -left-px h-3.5 w-3.5 border-b border-l border-cyanhud/80" />
      <span aria-hidden className="pointer-events-none absolute -right-px -bottom-px h-3.5 w-3.5 border-r border-b border-cyanhud/80" />

      {title && (
        <header className="flex items-center gap-2 border-b border-edge/80 px-3 py-2">
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden className="text-cyanhud">
            <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" />
          </svg>
          <h2 className="font-display text-[10px] font-bold tracking-[0.32em] text-fog uppercase">{title}</h2>
          {right && <div className="ml-auto">{right}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
