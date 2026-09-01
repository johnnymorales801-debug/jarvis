interface Contact {
  x: number;
  y: number;
  label: string;
  kind: "friendly" | "neutral" | "unknown";
  dist: string;
}

const CONTACTS: Contact[] = [
  { x: 70, y: 96, label: "MARK 42", kind: "friendly", dist: "DOCKED — BAY 2" },
  { x: 187, y: 48, label: "STARK TOWER", kind: "neutral", dist: "2.1 KM NE" },
  { x: 106, y: 171, label: "DRONE-07", kind: "unknown", dist: "842 M — LOW ALT" },
];

const KIND_COLOR: Record<Contact["kind"], string> = {
  friendly: "#6ff2b2",
  neutral: "#56e6ff",
  unknown: "#ffb454",
};

export default function RadarPanel({ scanning }: { scanning: boolean }) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="relative mx-auto">
        <svg width="248" height="248" viewBox="0 0 260 260" aria-hidden>
          <defs>
            <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#56e6ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#56e6ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* rings */}
          <circle cx="130" cy="130" r="125" fill="rgba(86,230,255,0.03)" stroke="#123246" strokeWidth="1.5" />
          <circle cx="130" cy="130" r="88" fill="none" stroke="#123246" strokeWidth="1" strokeDasharray="4 5" />
          <circle cx="130" cy="130" r="50" fill="none" stroke="#123246" strokeWidth="1" />
          {/* crosshair */}
          <line x1="130" y1="5" x2="130" y2="255" stroke="#123246" strokeWidth="1" />
          <line x1="5" y1="130" x2="255" y2="130" stroke="#123246" strokeWidth="1" />
          {/* degree ticks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const x1 = 130 + Math.cos(a) * 119;
            const y1 = 130 + Math.sin(a) * 119;
            const x2 = 130 + Math.cos(a) * 125;
            const y2 = 130 + Math.sin(a) * 125;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a5a75" strokeWidth="1.5" />;
          })}

          {/* sweep */}
          <g className="anim-sweep">
            <path d="M130 130 L130 5 A125 125 0 0 1 247.5 87.3 Z" fill="url(#sweepGrad)" />
            <line x1="130" y1="130" x2="130" y2="5" stroke="#56e6ff" strokeWidth="1.5" strokeOpacity="0.8" />
          </g>

          {/* center */}
          <circle cx="130" cy="130" r="4" fill="#56e6ff" />
          <circle cx="130" cy="130" r="9" fill="none" stroke="#56e6ff" strokeOpacity="0.4" strokeWidth="1" />

          {/* contacts */}
          {CONTACTS.map((c) => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="5" fill={KIND_COLOR[c.kind]} className="anim-blip" />
              <circle cx={c.x} cy={c.y} r="4" fill={KIND_COLOR[c.kind]} />
              <circle cx={c.x} cy={c.y} r="8" fill="none" stroke={KIND_COLOR[c.kind]} strokeOpacity="0.5" strokeWidth="1" />
            </g>
          ))}

          {/* compass */}
          <text x="130" y="22" textAnchor="middle" fill="#6b8fa6" fontSize="10" fontFamily="Share Tech Mono">N</text>
          <text x="240" y="134" textAnchor="middle" fill="#6b8fa6" fontSize="10" fontFamily="Share Tech Mono">E</text>
          <text x="130" y="248" textAnchor="middle" fill="#6b8fa6" fontSize="10" fontFamily="Share Tech Mono">S</text>
          <text x="20" y="134" textAnchor="middle" fill="#6b8fa6" fontSize="10" fontFamily="Share Tech Mono">W</text>
        </svg>

        {scanning && (
          <div className="anim-flick pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="border border-amberhud/60 bg-void/80 px-3 py-1 font-term text-[10px] tracking-[0.3em] text-amberhud">
              HIGH-GAIN SWEEP
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col border-t border-edge/70 pt-2.5">
        {CONTACTS.map((c) => (
          <div
            key={c.label}
            className="group flex items-center gap-2.5 border-b border-edge/40 px-1 py-2 transition-colors last:border-b-0 hover:bg-cyandark/20"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rotate-45"
              style={{ background: KIND_COLOR[c.kind], boxShadow: `0 0 8px ${KIND_COLOR[c.kind]}` }}
            />
            <span className="font-term text-xs tracking-[0.15em] text-ice/90 group-hover:text-cyanhud">{c.label}</span>
            <span className="ml-auto font-term text-[10px] tracking-[0.12em]" style={{ color: KIND_COLOR[c.kind] }}>
              {c.dist}
            </span>
          </div>
        ))}
        <p className="mt-2 font-term text-[9px] tracking-[0.22em] text-fog">
          RANGE 3 KM — MODE: {scanning ? "ACTIVE SWEEP" : "PASSIVE TRACK"}
        </p>
      </div>
    </div>
  );
}
