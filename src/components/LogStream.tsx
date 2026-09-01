import { useEffect, useRef } from "react";

export type LogLevel = "ok" | "info" | "warn";

export interface LogEntry {
  id: number;
  t: string;
  level: LogLevel;
  text: string;
}

const LEVEL_STYLE: Record<LogLevel, { tag: string; cls: string }> = {
  ok: { tag: "OK", cls: "text-mint" },
  info: { tag: "SYS", cls: "text-cyanhud" },
  warn: { tag: "WRN", cls: "text-amberhud" },
};

export default function LogStream({ logs }: { logs: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div ref={ref} className="hud-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2 font-term text-[11px] leading-relaxed">
      {logs.map((l) => (
        <p key={l.id} className="flex gap-2 whitespace-pre-wrap break-words py-[1px]">
          <span className="shrink-0 text-fog/70">{l.t}</span>
          <span className={`shrink-0 ${LEVEL_STYLE[l.level].cls}`}>[{LEVEL_STYLE[l.level].tag}]</span>
          <span className="text-ice/80">{l.text}</span>
        </p>
      ))}
      <p className="py-[1px] text-fog/60">
        <span className="anim-blink inline-block h-[11px] w-[7px] translate-y-[1px] bg-cyanhud/70" />
      </p>
    </div>
  );
}
