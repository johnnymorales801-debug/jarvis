import { useEffect, useState } from "react";

const QUEUE = [
  "REPULSOR COIL — GAUNTLET R",
  "TITANIUM PLATE — CHEST",
  "SERVO ACTUATOR — KNEE L",
  "FLIGHT STABILIZER — BOOT R",
  "OPTIC SENSOR — HELMET",
];

/* wireframe nodes: [x, y, label, labelSide] */
const NODES: [number, number, string, "l" | "r"][] = [
  [110, 101, "ARC NODE", "r"],
  [56, 152, "REPULSOR R", "l"],
  [164, 152, "REPULSOR L", "r"],
  [91, 196, "SERVO K-4", "l"],
  [129, 196, "SERVO K-3", "r"],
];

const CY = "rgba(86,230,255,0.75)";
const CYD = "rgba(86,230,255,0.32)";
const AMB = "rgba(255,180,84,0.8)";

export default function FabricationPanel() {
  const [idx, setIdx] = useState(1);
  const [prog, setProg] = useState(34);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProg((p) => {
        const n = p + 4 + Math.random() * 9;
        if (n >= 100) {
          setIdx((i) => (i + 1) % QUEUE.length);
          return 0;
        }
        return n;
      });
    }, 800);
    return () => window.clearInterval(id);
  }, []);

  const assembly = Math.round((idx / QUEUE.length) * 100 + prog / QUEUE.length);

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* schematic */}
      <svg viewBox="0 0 220 262" className="w-full" aria-hidden>
        {/* frame crosses */}
        <path d="M8 8h10M8 8v10M212 8h-10M212 8v10M8 254h10M8 254v-10M212 254h-10M212 254v-10" stroke={CYD} strokeWidth="1" fill="none" />
        <text x="14" y="20" fontSize="7" fill="rgba(107,143,166,0.85)" fontFamily="var(--font-term)" letterSpacing="1.5">FIG. 42-A</text>
        <text x="14" y="30" fontSize="7" fill="rgba(107,143,166,0.6)" fontFamily="var(--font-term)" letterSpacing="1.5">MK 42 // FRONT</text>

        {/* helmet */}
        <path d="M96 22 L124 22 L132 46 L121 60 L99 60 L88 46 Z" fill="rgba(23,184,230,0.05)" stroke={CY} strokeWidth="1.2" />
        <path d="M99 42 L107 42 M113 42 L121 42" stroke={AMB} strokeWidth="1.6" strokeLinecap="round" />

        {/* torso */}
        <path d="M74 72 L146 72 L140 118 L134 150 L86 150 L80 118 Z" fill="rgba(23,184,230,0.05)" stroke={CY} strokeWidth="1.2" />
        {/* chest reactor */}
        <circle cx="110" cy="101" r="12" fill="none" stroke={CYD} strokeWidth="1" strokeDasharray="3 4" className="anim-spin-rev" />
        <circle cx="110" cy="101" r="6.5" fill="rgba(234,252,255,0.14)" stroke="#eafcff" strokeWidth="1.2" className="anim-core" />
        <circle cx="110" cy="101" r="2.2" fill="#eafcff" />

        {/* arms */}
        <path d="M74 72 L62 110 L56 146 L62 158 L72 156 L78 120 L80 118" fill="none" stroke={CY} strokeWidth="1.2" />
        <path d="M146 72 L158 110 L164 146 L158 158 L148 156 L142 120 L140 118" fill="none" stroke={CY} strokeWidth="1.2" />
        {/* gauntlets */}
        <rect x="50" y="150" width="12" height="14" fill="none" stroke={AMB} strokeWidth="1.1" />
        <rect x="158" y="150" width="12" height="14" fill="none" stroke={AMB} strokeWidth="1.1" />
        <circle cx="56" cy="157" r="2" fill={AMB} />
        <circle cx="164" cy="157" r="2" fill={AMB} />

        {/* waist */}
        <path d="M86 150 L134 150 L129 172 L91 172 Z" fill="rgba(23,184,230,0.05)" stroke={CY} strokeWidth="1.2" />

        {/* legs */}
        <path d="M94 172 L90 196 L88 226 L86 240 L98 240 L100 206 L102 172" fill="none" stroke={CY} strokeWidth="1.2" />
        <path d="M126 172 L130 196 L132 226 L134 240 L122 240 L120 206 L118 172" fill="none" stroke={CY} strokeWidth="1.2" />
        {/* boots */}
        <rect x="80" y="238" width="20" height="8" fill="none" stroke={CYD} strokeWidth="1.1" />
        <rect x="120" y="238" width="20" height="8" fill="none" stroke={CYD} strokeWidth="1.1" />

        {/* dimension line */}
        <path d="M204 22 L204 246 M200 22 L208 22 M200 246 L208 246" stroke={CYD} strokeWidth="1" fill="none" />
        <text x="208" y="134" fontSize="7" fill="rgba(107,143,166,0.85)" fontFamily="var(--font-term)" transform="rotate(90 208 134)" textAnchor="middle" letterSpacing="1.5">1.88 M</text>

        {/* labeled nodes */}
        {NODES.map(([x, y, label, side], i) => (
          <g key={label}>
            <circle cx={x} cy={y} r="5.5" fill="none" stroke={CY} strokeWidth="1" className="anim-blip" style={{ animationDelay: `${i * 480}ms` }} />
            <circle cx={x} cy={y} r="2.4" fill="#56e6ff" />
            {side === "l" ? (
              <>
                <line x1={x - 6} y1={y} x2={x - 18} y2={y} stroke={CYD} strokeWidth="0.8" strokeDasharray="2 2" />
                <text x={x - 21} y={y + 2.5} fontSize="6.5" fill="rgba(217,241,251,0.75)" fontFamily="var(--font-term)" textAnchor="end" letterSpacing="1">{label}</text>
              </>
            ) : (
              <>
                <line x1={x + 6} y1={y} x2={x + 18} y2={y} stroke={CYD} strokeWidth="0.8" strokeDasharray="2 2" />
                <text x={x + 21} y={y + 2.5} fontSize="6.5" fill="rgba(217,241,251,0.75)" fontFamily="var(--font-term)" letterSpacing="1">{label}</text>
              </>
            )}
          </g>
        ))}
      </svg>

      {/* assembly progress */}
      <div>
        <div className="mb-1 flex justify-between font-term text-[9px] tracking-[0.22em] text-fog">
          <span>ASSEMBLY PROGRESS</span>
          <span className="text-cyanhud">{assembly}%</span>
        </div>
        <div className="h-1.5 w-full bg-edge/40">
          <div className="seg-fill h-full transition-all duration-700" style={{ width: `${assembly}%` }} />
        </div>
      </div>

      {/* parts queue */}
      <div className="border-t border-edge/60 pt-2.5">
        <p className="mb-1.5 font-term text-[9px] tracking-[0.24em] text-fog">FABRICATION QUEUE</p>
        <div className="flex flex-col">
          {QUEUE.map((part, i) => {
            const state = i < idx ? "done" : i === idx ? "machining" : "queued";
            const rel = (i - idx + QUEUE.length) % QUEUE.length;
            return (
              <div key={part} className="group border-b border-edge/30 py-1.5 last:border-b-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate font-term text-[9px] tracking-[0.14em] transition-colors ${
                      state === "machining" ? "text-ice group-hover:text-cyanhud" : state === "done" ? "text-fog/55" : "text-fog/80"
                    }`}
                  >
                    {part}
                  </span>
                  <span
                    className={`shrink-0 font-term text-[8px] tracking-[0.2em] ${
                      state === "done" ? "text-mint/80" : state === "machining" ? "anim-blink text-amberhud" : "text-fog/50"
                    }`}
                  >
                    {state === "done" ? "DONE" : state === "machining" ? "MACHINING" : `Q-${rel}`}
                  </span>
                </div>
                {state === "machining" && (
                  <div className="mt-1 h-[3px] w-full bg-edge/40">
                    <div className="seg-fill-amber h-full transition-all duration-700" style={{ width: `${prog}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
