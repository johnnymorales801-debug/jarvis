import type { Stats } from "../lib/jarvis";

function Gauge({
  label,
  value,
  display,
  amber = false,
}: {
  label: string;
  value: number;
  display: string;
  amber?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-term text-[10px] tracking-[0.22em] text-fog">{label}</span>
        <span className={`font-term text-xs ${amber ? "text-amberhud" : "text-cyanhud"}`}>{display}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden bg-edge/40">
        <div
          className={`h-full transition-all duration-700 ease-out ${amber ? "seg-fill-amber" : "seg-fill"}`}
          style={{ width: `${Math.min(100, Math.max(2, value))}%` }}
        />
      </div>
    </div>
  );
}

export default function ReactorCore({ stats }: { stats: Stats }) {
  return (
    <div className="flex flex-col gap-5 p-4">
      {/* arc reactor */}
      <div className="relative mx-auto">
        <svg width="188" height="188" viewBox="0 0 200 200" aria-hidden>
          <defs>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eafcff" />
              <stop offset="35%" stopColor="#9df0ff" />
              <stop offset="70%" stopColor="#17b8e6" />
              <stop offset="100%" stopColor="#0e3a52" />
            </radialGradient>
          </defs>

          {/* outer dashed ring */}
          <circle cx="100" cy="100" r="94" fill="none" stroke="#123246" strokeWidth="1.5" strokeDasharray="3 7" className="anim-dash" />
          {/* rotating tick ring */}
          <g className="anim-spin-slow">
            <circle cx="100" cy="100" r="84" fill="none" stroke="#56e6ff" strokeOpacity="0.5" strokeWidth="4" strokeDasharray="2 12" />
          </g>
          {/* counter-rotating arc segments */}
          <g className="anim-spin-rev">
            <circle cx="100" cy="100" r="68" fill="none" stroke="#17b8e6" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="70 37" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="#ffb454" strokeOpacity="0.8" strokeWidth="3" strokeDasharray="14 385" />
          </g>
          {/* inner housing */}
          <circle cx="100" cy="100" r="52" fill="none" stroke="#123246" strokeWidth="2" />
          <circle cx="100" cy="100" r="46" fill="none" stroke="#56e6ff" strokeOpacity="0.25" strokeWidth="1" />
          {/* core */}
          <circle cx="100" cy="100" r="38" fill="url(#coreGrad)" className="anim-core" />
          <circle cx="100" cy="100" r="38" fill="none" stroke="#eafcff" strokeOpacity="0.8" strokeWidth="1.5" />
          {/* coil slots */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const x1 = 100 + Math.cos(a) * 42;
            const y1 = 100 + Math.sin(a) * 42;
            const x2 = 100 + Math.cos(a) * 50;
            const y2 = 100 + Math.sin(a) * 50;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#56e6ff" strokeOpacity="0.5" strokeWidth="3" />;
          })}
          {/* triangle */}
          <path d="M100 86 L113 108 L87 108 Z" fill="#eafcff" opacity="0.9" />
        </svg>
        {/* glow */}
        <div
          aria-hidden
          className="anim-core pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(86,230,255,0.28) 0%, transparent 62%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[92px]">
          <p className="font-display text-sm font-bold tracking-[0.18em] text-ice glow-cyan">98.2%</p>
        </div>
      </div>

      <div className="text-center">
        <p className="font-display text-[10px] font-bold tracking-[0.34em] text-fog">ARC REACTOR OUTPUT</p>
        <p className="mt-0.5 font-term text-[10px] text-cyanhud/80">VIBRANIUM LATTICE — STABLE</p>
      </div>

      {/* gauges */}
      <div className="flex flex-col gap-3 border-t border-edge/70 pt-4">
        <Gauge label="CPU LOAD" value={stats.cpu} display={`${stats.cpu}%`} />
        <Gauge label="MEMORY" value={stats.mem} display={`${stats.mem}%`} />
        <Gauge label="UPLINK NET" value={stats.net} display={`${stats.net}%`} />
        <Gauge label="CORE TEMP" value={(stats.temp - 2800) / 9} display={`${stats.temp.toLocaleString()} K`} amber={stats.temp > 3300} />
      </div>
    </div>
  );
}
