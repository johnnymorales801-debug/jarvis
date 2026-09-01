import { useEffect, useState } from "react";

interface TopBarProps {
  uptime: string;
  lightsOn: boolean;
  onToggleLights: () => void;
}

export default function TopBar({ uptime, lightsOn, onToggleLights }: TopBarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const dateStr = now
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();

  return (
    <header className="anim-rise relative z-20 border-b border-edge/80 bg-abyss/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-2.5">
        {/* mark + wordmark */}
        <div className="flex min-w-0 items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 44 44" aria-hidden className="shrink-0 text-cyanhud">
            <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
            <circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="9 7" className="anim-spin-slow" />
            <circle cx="22" cy="22" r="5" fill="currentColor" className="anim-core" />
          </svg>
          <div className="min-w-0">
            <p className="font-display text-base font-black leading-tight tracking-[0.3em] text-ice glow-cyan sm:text-lg">
              J.A.R.V.I.S.
            </p>
            <p className="hidden font-term text-[9px] tracking-[0.28em] text-fog md:block">
              JUST A RATHER VERY INTELLIGENT SYSTEM
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          {/* uptime */}
          <div className="hidden text-right lg:block">
            <p className="font-term text-[9px] tracking-[0.25em] text-fog">SESSION UPTIME</p>
            <p className="font-term text-sm text-ice/90">{uptime}</p>
          </div>

          {/* lights toggle */}
          <button
            type="button"
            onClick={onToggleLights}
            className="clip-hud-sm group border border-edge bg-panel/80 px-3 py-1.5 text-left transition-colors hover:border-amberhud/70 hover:bg-amberhud/10 focus:outline-none focus-visible:border-amberhud"
            title="Toggle workshop lighting"
          >
            <span className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden className={lightsOn ? "text-amberhud" : "text-fog"}>
                <circle cx="8" cy="6.5" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6.2 11h3.6M6.8 13.2h2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                {lightsOn && <path d="M8 0.6v1.6M2.2 3l1.1 1.1M13.8 3l-1.1 1.1M0.8 6.5h1.6M13.6 6.5h1.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />}
              </svg>
              <span className={`font-term text-[10px] tracking-[0.2em] ${lightsOn ? "text-amberhud" : "text-fog"} group-hover:text-amberhud`}>
                LIGHTS {lightsOn ? "ON" : "OFF"}
              </span>
            </span>
          </button>

          {/* status led */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="anim-core absolute inline-flex h-full w-full bg-mint shadow-[0_0_10px_rgba(111,242,178,0.9)]" />
            </span>
            <span className="font-term text-[10px] tracking-[0.25em] text-mint">ONLINE</span>
          </div>

          {/* clock */}
          <div className="text-right">
            <p className="font-term text-2xl leading-none text-ice glow-cyan sm:text-[26px]">
              {hh}
              <span className="text-cyanhud">:</span>
              {mm}
              <span className="anim-blink text-cyanhud">:</span>
              <span className="text-amberhud">{ss}</span>
            </p>
            <p className="mt-0.5 font-term text-[9px] tracking-[0.3em] text-fog">{dateStr}</p>
          </div>
        </div>
      </div>
      {/* accent hairline */}
      <div className="absolute inset-x-0 bottom-[-1px] h-px bg-gradient-to-r from-transparent via-cyanhud/60 to-transparent" aria-hidden />
    </header>
  );
}
