import { useReducedMotion } from "../lib/useReducedMotion";

const BARS = 44;
const HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.7 + Math.sin(i * 0.53) * 0.3);
  return Math.round(18 + v * 82);
});

export default function Waveform({ active, status }: { active: boolean; status: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex items-center gap-3">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={active ? "text-cyanhud" : "text-fog"}>
        <path
          d="M2 6v4M5 4v8M8 2v12M11 4v8M14 6v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex h-9 flex-1 items-end justify-center gap-[3px] overflow-hidden" aria-hidden>
        {HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] flex-none ${active && !reduced ? "anim-wave bg-cyanhud shadow-[0_0_6px_rgba(86,230,255,0.7)]" : ""}`}
            style={{
              height: `${active ? h : 8}%`,
              background: active && reduced ? "#56e6ff" : undefined,
              opacity: active ? 0.95 : 0.3,
              ...(active && !reduced
                ? { animationDelay: `${(i % 11) * 90}ms`, animationDuration: `${0.7 + (i % 5) * 0.11}s` }
                : {}),
            }}
          />
        ))}
      </div>
      <span
        className={`w-[170px] shrink-0 text-right font-term text-[9px] tracking-[0.22em] ${
          active ? "text-cyanhud" : "text-fog"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
