import { useCallback, useEffect, useRef, useState } from "react";
import BootSequence from "./components/BootSequence";
import TopBar from "./components/TopBar";
import HudPanel from "./components/HudPanel";
import ReactorCore from "./components/ReactorCore";
import RadarPanel from "./components/RadarPanel";
import LogStream, { type LogEntry, type LogLevel } from "./components/LogStream";
import Console, { type Msg } from "./components/Console";
import { runCommand, greetingLines, type CmdCtx, type Stats } from "./lib/jarvis";

const rnd = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const timeStr = () => new Date().toLocaleTimeString("en-US", { hour12: false });

const fmtUptime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

function makeLog(): { level: LogLevel; text: string } {
  const pool: [LogLevel, string][] = [
    ["ok", "perimeter sweep complete — 0 anomalies"],
    ["info", `uplink latency ${rnd(6, 24)} ms — stable`],
    ["ok", `coolant loop ${rnd(61, 74)}°C — nominal`],
    ["info", `fabricator queue: ${rnd(2, 9)} parts pending`],
    ["warn", "drone-07 signal degraded — re-acquiring lock"],
    ["ok", `backup sync verified — block ${rnd(1000, 9999)}`],
    ["info", "reactor harmonics within band"],
    ["warn", `flux deviation bus ${rnd(2, 6)} — self-corrected`],
    ["ok", "biometric check: 1 authorized user on site"],
    ["info", `sensor mesh heartbeat — ${rnd(40, 42)}/42 nodes`],
    ["ok", "workshop air quality: optimal"],
    ["info", `satellite handshake complete — orbit ${rnd(120, 900)}`],
  ];
  const [level, text] = pool[rnd(0, pool.length - 1)];
  return { level, text };
}

const SUBSYSTEMS = [
  { id: "rep", label: "REPULSOR ARRAY" },
  { id: "stab", label: "FLIGHT STABILIZERS" },
  { id: "comms", label: "COMMS UPLINK" },
  { id: "fab", label: "FABRICATION BAY" },
];

function ScanOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      <div className="absolute inset-0 bg-cyanhud/[0.035]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(86,230,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(86,230,255,0.09) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="anim-scanpass absolute inset-x-0 h-20"
        style={{ background: "linear-gradient(180deg, transparent, rgba(86,230,255,0.4), transparent)" }}
      />
      <p className="anim-flick absolute top-4 left-4 border border-amberhud/60 bg-void/85 px-3 py-1.5 font-term text-[10px] tracking-[0.3em] text-amberhud">
        ENVIRONMENTAL SCAN IN PROGRESS
      </p>
      <p className="absolute right-4 bottom-4 font-term text-[10px] tracking-[0.3em] text-cyanhud/80">
        SENSOR ARRAY 42/42 — HIGH GAIN
      </p>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<"boot" | "online">("boot");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typers, setTypers] = useState<Set<number>>(new Set());
  const [lightsOn, setLightsOn] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [uptime, setUptime] = useState("00:00:00");
  const [stats, setStats] = useState<Stats>({ cpu: 23, mem: 61, net: 48, temp: 3187 });
  const [subs, setSubs] = useState<Record<string, boolean>>({ rep: true, stab: true, comms: true, fab: false });
  const [logs, setLogs] = useState<LogEntry[]>(() => [
    { id: -3, t: timeStr(), level: "info", text: "hud kernel v42.7 — cold start" },
    { id: -2, t: timeStr(), level: "ok", text: "arc reactor handshake — 98.2% stable" },
    { id: -1, t: timeStr(), level: "ok", text: "secure link established — node MALIBU-01" },
  ]);

  const msgIdRef = useRef(1);
  const logIdRef = useRef(1);
  const bootAtRef = useRef(0);
  const statsRef = useRef(stats);
  const lightsRef = useRef(lightsOn);
  const playingRef = useRef(playing);
  const uptimeRef = useRef(uptime);

  useEffect(() => void (statsRef.current = stats), [stats]);
  useEffect(() => void (lightsRef.current = lightsOn), [lightsOn]);
  useEffect(() => void (playingRef.current = playing), [playing]);
  useEffect(() => void (uptimeRef.current = uptime), [uptime]);

  const pushLog = useCallback((level: LogLevel, text: string) => {
    setLogs((prev) => [...prev.slice(-35), { id: logIdRef.current++, t: timeStr(), level, text }]);
  }, []);

  const pushJarvis = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: msgIdRef.current++, role: "jarvis", text, time: timeStr() }]);
  }, []);

  const onTyper = useCallback((id: number, active: boolean) => {
    setTypers((prev) => {
      const has = prev.has(id);
      if (active === has) return prev;
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleBootDone = useCallback(() => {
    bootAtRef.current = Date.now();
    setPhase("online");
    pushLog("ok", "all subsystems online — hud ready");
    pushLog("info", "awaiting operator directives");
    window.setTimeout(() => {
      setMessages([{ id: msgIdRef.current++, role: "jarvis", text: greetingLines().join("\n"), time: timeStr() }]);
    }, 650);
  }, [pushLog]);

  const handleCommand = useCallback(
    (raw: string) => {
      const uid = msgIdRef.current++;
      setMessages((m) => [...m, { id: uid, role: "user", text: raw, time: timeStr() }]);
      pushLog("info", `cmd // ${raw.slice(0, 44)}`);

      const ctx: CmdCtx = {
        stats: statsRef.current,
        lightsOn: lightsRef.current,
        uptime: uptimeRef.current,
        playing: playingRef.current,
      };
      const res = runCommand(raw, ctx);

      if (res.action === "clear") {
        window.setTimeout(() => {
          setMessages([]);
          window.setTimeout(() => pushJarvis(res.lines.join("\n")), 280);
        }, 320);
        return;
      }

      if (res.action === "lights-on") setLightsOn(true);
      if (res.action === "lights-off") setLightsOn(false);
      if (res.action === "music-on") setPlaying(true);
      if (res.action === "music-off") setPlaying(false);
      if (res.action === "scan") {
        setScanning(true);
        window.setTimeout(() => setScanning(false), 2500);
      }

      if (res.sequence) {
        let acc = res.delay ?? 550;
        for (const step of res.sequence) {
          window.setTimeout(() => pushJarvis(step.text), acc);
          acc += step.delay;
        }
        return;
      }

      window.setTimeout(() => pushJarvis(res.lines.join("\n")), res.delay ?? 420);
    },
    [pushLog, pushJarvis]
  );

  /* ---- living telemetry loops ---- */

  useEffect(() => {
    const statsId = window.setInterval(() => {
      setStats((s) => ({
        cpu: clamp(s.cpu + rnd(-7, 7), 9, 64),
        mem: clamp(s.mem + rnd(-3, 3), 52, 86),
        net: clamp(s.net + rnd(-12, 12), 14, 97),
        temp: clamp(s.temp + rnd(-38, 38), 3040, 3430),
      }));
    }, 2000);

    const logId = window.setInterval(() => {
      const { level, text } = makeLog();
      pushLog(level, text);
    }, 1900);

    const upId = window.setInterval(() => {
      if (bootAtRef.current > 0) setUptime(fmtUptime(Date.now() - bootAtRef.current));
    }, 1000);

    return () => {
      window.clearInterval(statsId);
      window.clearInterval(logId);
      window.clearInterval(upId);
    };
  }, [pushLog]);

  const speaking = typers.size > 0;
  const subsActive = SUBSYSTEMS.filter((s) => subs[s.id]).length;

  const toggleSub = (id: string, label: string) => {
    setSubs((prev) => {
      const next = !prev[id];
      pushLog("info", `${label.toLowerCase()} ${next ? "engaged" : "disengaged"}`);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="relative min-h-full font-body">
      {/* layered backdrop */}
      <div className="hud-backdrop fixed inset-0 z-0" aria-hidden />
      <div className="hud-noise fixed inset-0 z-[1]" aria-hidden />
      <div className="hud-vignette pointer-events-none fixed inset-0 z-[2]" aria-hidden />
      <div
        aria-hidden
        className="anim-scan pointer-events-none fixed inset-x-0 z-[3] hidden h-28 motion-safe:block"
        style={{ background: "linear-gradient(180deg, transparent, rgba(86,230,255,0.05), transparent)" }}
      />

      {phase === "boot" ? (
        <BootSequence onDone={handleBootDone} />
      ) : (
        <div className="relative z-10 flex min-h-screen flex-col xl:h-screen xl:min-h-0">
          <TopBar
            uptime={uptime}
            lightsOn={lightsOn}
            onToggleLights={() => handleCommand(lightsOn ? "lights off" : "lights on")}
          />

          <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-3 p-3 xl:min-h-0 xl:grid-cols-[320px_minmax(0,1fr)_340px] xl:overflow-hidden">
            {/* left column — reactor + subsystems */}
            <div className="hud-scroll flex flex-col gap-3 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
              <HudPanel
                title="ARC REACTOR // TELEMETRY"
                delay={60}
                right={<span className="font-term text-[9px] tracking-[0.2em] text-mint">STABLE</span>}
              >
                <ReactorCore stats={stats} />
              </HudPanel>

              <HudPanel
                title="SUBSYSTEMS"
                delay={150}
                right={
                  <span className="font-term text-[9px] tracking-[0.2em] text-fog">
                    {subsActive}/{SUBSYSTEMS.length} ACTIVE
                  </span>
                }
              >
                <div className="flex flex-col p-2">
                  {SUBSYSTEMS.map((s) => {
                    const on = subs[s.id];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSub(s.id, s.label)}
                        className="group flex items-center justify-between border-b border-edge/40 px-2 py-2.5 text-left transition-colors last:border-b-0 hover:bg-cyandark/20"
                        aria-pressed={on}
                      >
                        <span
                          className={`font-term text-[10px] tracking-[0.22em] transition-colors ${
                            on ? "text-ice/90 group-hover:text-cyanhud" : "text-fog"
                          }`}
                        >
                          {s.label}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className={`font-term text-[9px] tracking-[0.2em] ${on ? "text-mint" : "text-fog/60"}`}>
                            {on ? "ON" : "OFF"}
                          </span>
                          <span
                            className={`relative h-3.5 w-8 border transition-colors ${
                              on ? "border-mint/70 bg-mint/10" : "border-edge bg-panel"
                            }`}
                          >
                            <span
                              className={`absolute top-1/2 h-2 w-3 -translate-y-1/2 transition-all duration-200 ${
                                on ? "left-[calc(100%-14px)] bg-mint shadow-[0_0_8px_rgba(111,242,178,0.8)]" : "left-[2px] bg-fog/50"
                              }`}
                            />
                          </span>
                        </span>
                      </button>
                    );
                  })}
                  <p className="mt-2 px-2 font-term text-[9px] tracking-[0.2em] text-fog/70">
                    TOGGLES ARE LOGGED TO SYSTEM FEED
                  </p>
                </div>
              </HudPanel>
            </div>

            {/* center column — command console */}
            <div className="flex min-h-[600px] flex-col xl:min-h-0">
              <HudPanel
                className="min-h-0 flex-1"
                title="COMMAND INTERFACE"
                delay={110}
                right={
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${speaking ? "bg-cyanhud shadow-[0_0_8px_rgba(86,230,255,0.9)]" : "bg-edge"}`} />
                    <span className="font-term text-[9px] tracking-[0.2em] text-fog">
                      {speaking ? "JARVIS SPEAKING" : "LINK READY"}
                    </span>
                  </span>
                }
              >
                <Console
                  messages={messages}
                  onCommand={handleCommand}
                  onTyper={onTyper}
                  speaking={speaking}
                  playing={playing}
                  lightsOn={lightsOn}
                />
              </HudPanel>
            </div>

            {/* right column — radar + log */}
            <div className="hud-scroll flex flex-col gap-3 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
              <HudPanel
                title="RADAR // CONTACTS"
                delay={160}
                right={
                  <span className={`font-term text-[9px] tracking-[0.2em] ${scanning ? "text-amberhud" : "text-cyanhud"}`}>
                    {scanning ? "SWEEP" : "TRACKING"}
                  </span>
                }
              >
                <RadarPanel scanning={scanning} />
              </HudPanel>

              <HudPanel
                title="SYSTEM LOG"
                delay={230}
                className="min-h-[240px] xl:min-h-0 xl:flex-1"
                right={
                  <span className="flex items-center gap-1.5">
                    <span className="anim-blink h-1.5 w-1.5 bg-alarm" />
                    <span className="font-term text-[9px] tracking-[0.2em] text-fog">LIVE</span>
                  </span>
                }
              >
                <LogStream logs={logs} />
              </HudPanel>
            </div>
          </main>

          {/* status strip */}
          <footer className="anim-rise hidden border-t border-edge/70 bg-abyss/70 md:block" style={{ animationDelay: "300ms" }}>
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-1.5 font-term text-[9px] tracking-[0.25em] text-fog">
              <span>STARK INDUSTRIES — R&amp;D DIVISION // NODE MALIBU-01</span>
              <span className="text-fog/70">LINK ENCRYPTED AES-4096 — BUILD 42.7</span>
              <span>
                <span className="text-cyanhud/80">↑/↓</span> HISTORY — <span className="text-cyanhud/80">ENTER</span> EXECUTE
              </span>
            </div>
          </footer>
        </div>
      )}

      {scanning && <ScanOverlay />}

      {/* lights-off dimming */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-40 bg-[#010409]/70 transition-opacity duration-700 ${
          lightsOn ? "opacity-0" : "opacity-100"
        }`}
      />
      {!lightsOn && (
        <p className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 font-term text-[10px] tracking-[0.35em] whitespace-nowrap text-fog">
          AMBIENT LIGHTS OFFLINE — TYPE “LIGHTS ON”
        </p>
      )}
    </div>
  );
}
