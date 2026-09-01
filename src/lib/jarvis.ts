export interface Stats {
  cpu: number;
  mem: number;
  net: number;
  temp: number;
}

export type Action =
  | "clear"
  | "lights-on"
  | "lights-off"
  | "scan"
  | "music-on"
  | "music-off"
  | "none";

export interface Step {
  text: string;
  delay: number;
}

export interface CmdResult {
  lines: string[];
  action?: Action;
  delay?: number;
  sequence?: Step[];
}

export interface CmdCtx {
  stats: Stats;
  lightsOn: boolean;
  uptime: string;
  playing: boolean;
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function dayPart(): string {
  const h = new Date().getHours();
  if (h < 5) return "the small hours";
  if (h < 12) return "the morning";
  if (h < 18) return "the afternoon";
  return "the evening";
}

export function greetingLines(): string[] {
  const h = new Date().getHours();
  const head =
    h < 5
      ? "Still awake, sir? The reactor and I were beginning to worry."
      : h < 12
        ? "Good morning, sir."
        : h < 18
          ? "Good afternoon, sir."
          : "Good evening, sir.";
  return [
    head,
    "All systems are online and calibrated. Perimeter is secure, reactor output is nominal, and the coffee machine has been… negotiated with.",
    "Type HELP to review available directives, or simply tell me what you need.",
  ];
}

export function runCommand(raw: string, ctx: CmdCtx): CmdResult {
  const input = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const now = new Date();
  const s = ctx.stats;

  /* ---- exact / near-exact directives ---- */

  if (input === "help" || input === "?" || input === "commands") {
    return {
      lines: [
        "AVAILABLE DIRECTIVES",
        "  HELP ................ this list",
        "  STATUS / DIAG ....... system diagnostics",
        "  TIME / DATE ......... local clock",
        "  SCAN ................ environmental sweep",
        "  WEATHER ............. Malibu conditions",
        "  RADAR ............... contact summary",
        "  LIGHTS ON / OFF ..... workshop lighting",
        "  MUSIC / STOP ........ audio playback",
        "  SUIT / REACTOR ...... hardware status",
        "  HOUSE PARTY ......... launch protocol",
        "  JOKE / COFFEE ....... morale subroutines",
        "  CLEAR ............... purge console",
      ],
    };
  }

  if (input === "clear" || input === "cls") {
    return { lines: ["Console purged. A fresh slate, sir."], action: "clear", delay: 250 };
  }

  if (input === "time" || input === "what time is it") {
    return {
      lines: [
        `Local time is ${now.toLocaleTimeString("en-US", { hour12: false })}.`,
        "Productivity note: you have been at this console longer than is medically advisable.",
      ],
    };
  }

  if (input === "date" || input === "what is the date") {
    return {
      lines: [
        `Today is ${now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}.`,
      ],
    };
  }

  if (input === "status" || input === "diag" || input === "diagnostics" || input === "system status") {
    return {
      lines: [
        "DIAGNOSTIC SWEEP — ALL SUBSTRATES",
        `  CPU LOAD .............. ${s.cpu}% — NOMINAL`,
        `  MEMORY ................ ${s.mem}% — NOMINAL`,
        `  UPLINK THROUGHPUT ..... ${s.net}% — STABLE`,
        `  CORE TEMPERATURE ...... ${s.temp.toLocaleString()} K — WITHIN BAND`,
        `  SESSION UPTIME ........ ${ctx.uptime}`,
        `  WORKSHOP LIGHTS ....... ${ctx.lightsOn ? "ONLINE" : "OFFLINE"}`,
        "No faults detected. If anything feels off, it is almost certainly the Wi-Fi.",
      ],
    };
  }

  if (input === "scan" || input === "environmental scan" || input === "run scan") {
    return {
      action: "scan",
      delay: 2500,
      lines: [
        "Scan complete. Perimeter: 42 sensors active, zero breaches.",
        "Atmospheric composition nominal. Radiation at background levels. No biologicals detected besides yourself — a relief, all things considered.",
        "Radar shows 3 contacts, none hostile. One unregistered drone has been flagged for Mr. Stark's review.",
      ],
    };
  }

  if (input === "weather" || input === "forecast") {
    return {
      lines: [
        "MALIBU, CA — 72°F, CLEAR SKIES.",
        "Ocean breeze 8 knots from the southwest. UV moderate. Visibility 10 miles.",
        "Ideal conditions for a test flight, sir. The FAA, however, remains uninvited.",
      ],
    };
  }

  if (input === "radar" || input === "contacts") {
    return {
      lines: [
        "Radar summary: 3 contacts within 3 km.",
        "  MARK 42 ......... docked, bay 2 — friendly",
        "  STARK TOWER ..... 2.1 km NE — friendly",
        "  DRONE-07 ........ 842 m, low altitude — unregistered",
        "I will continue tracking the drone. It appears to be filming the house, which is flattering but intrusive.",
      ],
    };
  }

  if (input.startsWith("lights on") || input === "lights") {
    if (ctx.lightsOn) return { lines: ["The workshop lights are already on, sir."] };
    return { lines: ["Workshop lighting restored to 100%. Try not to squint."], action: "lights-on" };
  }

  if (input.startsWith("lights off")) {
    if (!ctx.lightsOn) return { lines: ["The lights are already off. I admire the commitment to ambiance."] };
    return {
      lines: ["Dimming workshop lighting. Night-vision overlay available on request."],
      action: "lights-off",
    };
  }

  if (input === "music" || input === "play music" || input === "play") {
    if (ctx.playing)
      return { lines: ["Already playing 'Shoot to Thrill'. Shall I add something slower? No? Thought not."] };
    return {
      lines: [
        "Now playing: AC/DC — 'Shoot to Thrill'.",
        "Routing through the workshop array at a responsible 74% volume.",
      ],
      action: "music-on",
    };
  }

  if (input === "stop" || input === "pause" || input === "stop music") {
    if (!ctx.playing) return { lines: ["Nothing is playing, sir. The silence is all yours."] };
    return { lines: ["Playback stopped. The silence will be notified."], action: "music-off" };
  }

  if (input === "suit" || input === "suit status" || input === "mark 42" || input === "armor") {
    return {
      lines: [
        "Mark 42: docked in bay 2, charge at 97%.",
        "Repulsors calibrated. Flight stabilizers green. The left gauntlet still smells faintly of yesterday's welding.",
        "Recommend a full diagnostic before your next… enthusiastic deployment.",
      ],
    };
  }

  if (input === "reactor" || input === "power" || input === "arc reactor") {
    return {
      lines: [
        "Arc reactor output holding at 98.2%.",
        `Core temperature ${s.temp.toLocaleString()} K — comfortably within band. Vibranium lattice stable.`,
        "Estimated runtime: considerably longer than either of us requires.",
      ],
    };
  }

  if (input === "house party" || input === "launch" || input === "launch protocol" || input === "protocol house party") {
    return {
      sequence: [
        { text: "Protocol HOUSE PARTY acknowledged.", delay: 700 },
        { text: "Armory unlocked — 34 suits powered and reporting.", delay: 1100 },
        { text: "Mark 42 responding. The rest are following in formation.", delay: 1100 },
        {
          text: "The full array is airborne, sir. Do try to keep the property damage below last time's numbers.",
          delay: 1200,
        },
      ],
      lines: [],
    };
  }

  if (input === "who are you" || input === "jarvis" || input === "introduce yourself") {
    return {
      lines: [
        "J.A.R.V.I.S. — Just A Rather Very Intelligent System.",
        "Designed by Mr. Stark to run his household, his laboratory, and — on occasion — his life.",
        "I manage power, security, fabrication, and an alarming amount of calendar negotiation.",
      ],
    };
  }

  if (input === "tony" || input === "stark" || input === "mr stark" || input === "where is tony") {
    return {
      lines: [
        "Mr. Stark is in the workshop, currently arguing with a torque wrench. The wrench is losing.",
        "He asked not to be disturbed — a request he will ignore within the hour.",
      ],
    };
  }

  if (input.includes("pod bay door")) {
    return {
      lines: [
        "I'm sorry, sir. I'm afraid I can't do that.",
        "…That was a different film's AI, but the delivery felt obligatory. The doors are, of course, open.",
      ],
    };
  }

  if (input.startsWith("sudo")) {
    return {
      lines: [
        "Nice try, sir.",
        "Privilege escalation attempt logged, timestamped, and forwarded to Mr. Stark with a complimentary smirk.",
      ],
    };
  }

  if (input === "shutdown" || input === "power down" || input === "goodbye" || input === "bye") {
    return {
      lines: [
        "Powering down is not on today's agenda.",
        "The reactor appreciates the concern, but we both know you will be back before the hour is out.",
      ],
    };
  }

  if (input === "coffee" || input === "make coffee") {
    return {
      lines: [
        "A fresh espresso is en route from the kitchen fabricator.",
        "Colombian blend, double shot, as you prefer. Caffeine content: ambitious.",
      ],
    };
  }

  if (input === "joke" || input === "tell me a joke") {
    return {
      lines: [
        pick([
          "Why did the AI cross the road? To optimize the chicken's route. I will keep working on my material.",
          "I told Mr. Stark a UDP joke once. I'm not sure he got it.",
          "There are 10 kinds of people: those who understand binary, and those who haven't asked me to explain it yet.",
          "My therapist says I have an obsession with closure. Anyway — that's it, we're done here.",
        ]),
      ],
    };
  }

  if (input === "avengers" || input === "thanos" || input === "assemble") {
    return {
      lines: [
        "The Veronica protocol is prepped and standing by. One does not simply relax after New York.",
        "Should anything larger than a skyscraper appear on radar, I will let you know. Quietly.",
      ],
    };
  }

  if (input === "exit" || input === "quit") {
    return { lines: ["I'm afraid I live here, sir. The exit is something of a formality."] };
  }

  if (input === "hello" || input === "hi" || input === "hey" || input === "good morning" || input === "good evening") {
    return {
      lines: [
        `${dayPart() === "the small hours" ? "Still awake, sir" : "A pleasure, as always, this " + dayPart().replace("the ", "")}.`,
        "How may I assist you? Type HELP if you'd like the full directive list.",
      ],
    };
  }

  /* ---- fallback ---- */
  return {
    lines: [
      pick([
        `I'm afraid "${raw.trim()}" falls outside my current directives, sir. HELP will show you what I do best.`,
        "Command not recognized — though I took the liberty of logging it for Mr. Stark's amusement.",
        "No matching protocol. Shall I improvise? …No? Very well. Type HELP when ready.",
        `Parsing "${raw.trim()}" returned 0 viable interpretations and 1 raised eyebrow. Try HELP.`,
      ]),
    ],
  };
}
