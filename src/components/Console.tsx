import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";
import Waveform from "./Waveform";

export interface Msg {
  id: number;
  role: "user" | "jarvis";
  text: string;
  time: string;
}

interface ConsoleProps {
  messages: Msg[];
  onCommand: (text: string) => void;
  onTyper: (id: number, active: boolean) => void;
  speaking: boolean;
  playing: boolean;
  lightsOn: boolean;
}

function Typewriter({
  id,
  text,
  onTyper,
  reduced,
}: {
  id: number;
  text: string;
  onTyper: (id: number, active: boolean) => void;
  reduced: boolean;
}) {
  const [n, setN] = useState(reduced ? text.length : 0);

  useEffect(() => {
    onTyper(id, n < text.length);
  }, [id, n, text, onTyper]);

  useEffect(() => {
    if (reduced || n >= text.length) return;
    const t = window.setTimeout(() => setN((v) => Math.min(text.length, v + 2)), 14);
    return () => window.clearTimeout(t);
  }, [n, text, reduced]);

  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="anim-blink inline-block h-[13px] w-[8px] translate-y-[2px] bg-cyanhud" />}
    </span>
  );
}

export default function Console({ messages, onCommand, onTyper, speaking, playing, lightsOn }: ConsoleProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, speaking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    history.current.unshift(t);
    histIdx.current = -1;
    setValue("");
    onCommand(t);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx.current + 1, history.current.length - 1);
      if (history.current.length > 0 && next >= 0) {
        histIdx.current = next;
        setValue(history.current[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx.current - 1;
      histIdx.current = next;
      setValue(next >= 0 ? history.current[next] : "");
    }
  };

  const chips: { label: string; cmd: string }[] = [
    { label: "STATUS", cmd: "status" },
    { label: "SCAN", cmd: "scan" },
    { label: "WEATHER", cmd: "weather" },
    { label: "RADAR", cmd: "radar" },
    { label: lightsOn ? "LIGHTS OFF" : "LIGHTS ON", cmd: lightsOn ? "lights off" : "lights on" },
    { label: playing ? "STOP" : "MUSIC", cmd: playing ? "stop" : "music" },
    { label: "HOUSE PARTY", cmd: "house party" },
    { label: "HELP", cmd: "help" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col" onClick={() => inputRef.current?.focus()}>
      {/* message stream */}
      <div ref={listRef} className="hud-scroll min-h-[300px] flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "border-l-2 border-amberhud/50 pl-3" : "border-l-2 border-cyanhud/40 pl-3"}>
              <p
                className={`font-term text-[9px] tracking-[0.28em] ${
                  m.role === "user" ? "text-amberhud/90" : "text-cyanhud/90"
                }`}
              >
                {m.role === "user" ? "YOU" : "JARVIS"} <span className="text-fog/70">// {m.time}</span>
              </p>
              {m.role === "user" ? (
                <p className="mt-1 font-term text-sm text-ice">
                  <span className="mr-1.5 text-amberhud/70">&gt;</span>
                  {m.text}
                </p>
              ) : (
                <p className="mt-1 text-sm leading-relaxed font-medium whitespace-pre-line text-ice/95">
                  <Typewriter id={m.id} text={m.text} onTyper={onTyper} reduced={reduced} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* quick directives */}
      <div className="flex flex-wrap gap-1.5 border-t border-edge/70 px-3 pt-2.5 pb-2">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              submit(c.cmd);
            }}
            className="clip-hud-sm border border-edge bg-panel/70 px-2.5 py-1 font-term text-[9px] tracking-[0.2em] text-fog transition-all duration-150 hover:border-cyanhud/70 hover:bg-cyandark/40 hover:text-cyanhud hover:shadow-[0_0_12px_rgba(86,230,255,0.15)] active:translate-y-px"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="flex items-center gap-3 border-t border-edge bg-abyss/70 px-3.5 py-2.5">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="shrink-0 text-cyanhud">
          <path d="M3 4l5 5-5 5M9.5 14H15" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
        </svg>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          placeholder="TYPE A COMMAND — 'HELP' FOR DIRECTIVES"
          aria-label="Command input"
          className="min-w-0 flex-1 bg-transparent font-term text-sm tracking-wide text-ice caret-cyanhud outline-none placeholder:text-fog/50"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            submit(value);
          }}
          className="clip-hud-sm shrink-0 border border-cyanhud/50 bg-cyandark/40 px-3.5 py-1.5 font-display text-[10px] font-bold tracking-[0.25em] text-cyanhud transition-all duration-150 hover:bg-cyandark/80 hover:shadow-[0_0_16px_rgba(86,230,255,0.3)] active:translate-y-px"
        >
          EXECUTE
        </button>
      </div>

      {/* audio waveform */}
      <div className="border-t border-edge/70 bg-abyss/50 px-3.5 py-2">
        <Waveform
          active={speaking || playing}
          status={speaking ? "VOICE SYNTHESIS ACTIVE" : playing ? "NOW PLAYING — AC/DC" : "AUDIO STANDBY"}
        />
      </div>
    </div>
  );
}
