import { useEffect, useState } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";

const LINES = [
  "STARK INDUSTRIES // UNIFIED HUD KERNEL v42.7",
  "ESTABLISHING SECURE LINK ................. OK",
  "ARC REACTOR OUTPUT ....................... 98.2% STABLE",
  "LOADING NEURAL LATTICE ................... OK",
  "SENSOR ARRAY CALIBRATION ................. OK",
  "THREAT MATRIX ............................ NOMINAL",
  "ALL SYSTEMS ONLINE",
];

interface BootSequenceProps {
  onDone: () => void;
}

export default function BootSequence({ onDone }: BootSequenceProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? LINES.length : 0);

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(onDone, 600);
      return () => window.clearTimeout(t);
    }
    if (count >= LINES.length) {
      const t = window.setTimeout(onDone, 950);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 420 : 300);
    return () => window.clearTimeout(t);
  }, [count, reduced, onDone]);

  const progress = Math.round((count / LINES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void">
      <div className="hud-backdrop absolute inset-0" aria-hidden />
      <div className="hud-vignette absolute inset-0" aria-hidden />

      <div className="relative w-[min(660px,92vw)] px-6">
        <div className="mb-8 flex items-center gap-4">
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-cyanhud">
            <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" strokeWidth="2" className="anim-spin-rev" strokeDasharray="8 6" />
            <circle cx="22" cy="22" r="5" fill="currentColor" className="anim-core" />
          </svg>
          <div>
            <p className="font-display text-2xl font-black tracking-[0.42em] text-ice glow-cyan">J.A.R.V.I.S.</p>
            <p className="font-term text-[10px] tracking-[0.3em] text-fog">JUST A RATHER VERY INTELLIGENT SYSTEM</p>
          </div>
        </div>

        <div className="hud-panel p-4">
          <div className="min-h-[168px] font-term text-[13px] leading-relaxed sm:text-sm">
            {LINES.slice(0, count).map((line, i) => (
              <p key={i} className={i === LINES.length - 1 && count >= LINES.length ? "text-cyanhud glow-cyan" : "text-ice/85"}>
                <span className="mr-2 text-cyanhud/70">&gt;</span>
                {line}
              </p>
            ))}
            {count < LINES.length && (
              <p className="text-ice/85">
                <span className="mr-2 text-cyanhud/70">&gt;</span>
                <span className="anim-blink inline-block h-[15px] w-[9px] translate-y-[2px] bg-cyanhud" />
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between font-term text-[10px] tracking-[0.25em] text-fog">
              <span>INITIALIZATION</span>
              <span className="text-cyanhud">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-edge/50">
              <div
                className="h-full bg-cyandeep shadow-[0_0_12px_rgba(86,230,255,0.6)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-term text-[10px] tracking-[0.35em] text-fog/70">
          STARK INDUSTRIES — CLASSIFIED LEVEL 9 — DO NOT DISTRIBUTE
        </p>
      </div>
    </div>
  );
}
