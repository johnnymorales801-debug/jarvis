import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const seed = () => {
  let v = 98.1;
  return Array.from({ length: 28 }, () => {
    v = Math.min(99.6, Math.max(96.2, v + (Math.random() - 0.5) * 0.9));
    return v;
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="hud-panel clip-hud-sm px-2 py-1 font-term text-[10px] tracking-[0.12em] text-cyanhud">
      OUTPUT {Number(payload[0].value).toFixed(2)}%
    </div>
  );
}

export default function PowerGrid() {
  const [series, setSeries] = useState<number[]>(seed);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeries((s) => {
        const last = s[s.length - 1];
        const next = Math.min(99.6, Math.max(96.2, last + (Math.random() - 0.48) * 1.1));
        return [...s.slice(1), next];
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  const cur = series[series.length - 1];
  const prev = series[series.length - 2];
  const delta = cur - prev;
  const up = delta >= 0;
  const data = series.map((v, i) => ({ i, v }));

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-xl font-black tracking-[0.1em] text-ice glow-cyan">{cur.toFixed(2)}%</p>
          <p className="font-term text-[9px] tracking-[0.22em] text-fog">REACTOR OUTPUT — 60s WINDOW</p>
        </div>
        <div className={`flex items-center gap-1 pb-1 font-term text-[10px] ${up ? "text-mint" : "text-emberhud"}`}>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
            <path d={up ? "M4 0 L8 8 L0 8 Z" : "M4 8 L0 0 L8 0 Z"} fill="currentColor" />
          </svg>
          {Math.abs(delta).toFixed(2)}
        </div>
      </div>

      <div className="h-[104px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(86,230,255,0.32)" />
                <stop offset="100%" stopColor="rgba(86,230,255,0.02)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis domain={[95.5, 100]} hide />
            <Tooltip content={<Tip />} cursor={{ stroke: "rgba(86,230,255,0.25)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#56e6ff"
              strokeWidth={1.5}
              fill="url(#pgGrad)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between border-t border-edge/60 pt-2 font-term text-[9px] tracking-[0.2em] text-fog">
        <span>
          BUS <span className="text-cyanhud">A-F</span> NOMINAL
        </span>
        <span>
          LOAD <span className="text-amberhud">31%</span>
        </span>
        <span>
          RESERVE <span className="text-mint">FULL</span>
        </span>
      </div>
    </div>
  );
}
