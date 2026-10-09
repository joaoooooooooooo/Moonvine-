"use client";
// User-supplied StreamingText component, adapted to Moonvine tokens and showcase playback.

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * STREAMING TEXT
 * Words resolve out of blur, inline citations appear in
 * context, then actions and follow-up prompts become usable.
 * ───────────────────────────────────────────────────────── */

const WORD_MS = 55;
const HOLD_MS = 3400;

/* one streamed word, or a `cite` placeholder that renders an inline source chip */
export type StreamingToken = { text: string; cite?: boolean; sourceIndex?: number; sentiment?: 'success' | 'error' };

const TOKENS: StreamingToken[] = [
  ..."Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."
    .split(" ")
    .map((text) => ({ text })),
  { text: "", cite: true },
  ..."Stone-fruit flavors are trending in the same range."
    .split(" ")
    .map((text) => ({ text })),
];

const FOLLOW_UPS = [
  "Which flavors sell best in winter",
  "Compare gelato and soft serve margins",
];

const SOURCE_IMAGES = {
  scoop:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f7a5f'/%3E%3Cpath d='M20 36c0 7 5.4 12 12 12s12-5 12-12H20Z' fill='%23fff'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23bff3dd'/%3E%3Cpath d='M24 24c4-7 13-7 17 0' fill='none' stroke='%231f7a5f' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
  trends:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%232f6fec'/%3E%3Cpath d='M15 43 27 31l8 7 14-18' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='49' cy='20' r='5' fill='%23bfe0ff'/%3E%3C/svg%3E",
  market:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23e56d24'/%3E%3Cpath d='M17 45V25h8v20h-8Zm11 0V16h8v29h-8Zm11 0V30h8v15h-8Z' fill='%23fff'/%3E%3Cpath d='M16 49h32' stroke='%23ffd6b8' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
};

/* one cited source rendered as an inline chip and in the sources list */
export type StreamingSource = { name: string; domain: string; href: string; image: string; icon?: React.ElementType };

const SOURCES: StreamingSource[] = [
  { name: "Scoop Data", domain: "scoopdata.io", href: "https://scoopdata.io/", image: SOURCE_IMAGES.scoop },
  { name: "Trends Index", domain: "trends.google.com", href: "https://trends.google.com/trends/", image: SOURCE_IMAGES.trends },
  { name: "Market Basket", domain: "marketbasket.io", href: "https://marketbasket.io/", image: SOURCE_IMAGES.market },
];

function sourceImage(source: StreamingSource) {
  return source.image;
}

function SourceChip({ source }: { source?: StreamingSource }) {
  if (!source) return null;
  const Icon = source.icon;
  return (
    <a
      href={source.href}
      className="ml-0 mr-1 inline-flex min-h-6 translate-y-[-1px] items-center gap-1 rounded-[5px] border border-border bg-muted px-[3px] align-middle font-sans text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      style={{ animation: "movi-pop-in 250ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      <span className="inline-flex shrink-0 self-center">{Icon ? <Icon aria-hidden="true" className="size-4" /> : <img src={sourceImage(source)} alt="" className="size-4" />}</span>
      <span>{source.name}</span>
    </a>
  );
}

const ACTION_ICONS: React.ReactNode[] = [
  <g key="copy"><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></g>,
  <path key="retry" d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />,
];

export type StreamingLabels = {
  /** label on the collapsed sources toggle */
  sources: string;
  /** heading above the follow-up prompts */
  followUps: string;
};

const DEFAULT_LABELS: StreamingLabels = {
  sources: "10 sources",
  followUps: "Follow-ups",
};

export default function StreamingText({
  content = TOKENS,
  sources = SOURCES,
  followUps = FOLLOW_UPS,
  labels,
  loop = true,
  fill = false,
  onDone,
  onFollowUp,
  visibleCount,
  playing = true,
  speed = 1,
  showExtras = true,
  hoverActions = false,
  afterContent,
  onAction,
}: {
  variant?: string;
  visibleCount?: number;
  playing?: boolean;
  speed?: number;
  showExtras?: boolean;
  hoverActions?: boolean;
  afterContent?: React.ReactNode;
  onAction?: (index: number) => void;
  /** the streamed tokens; `cite` tokens render an inline source chip */
  content?: StreamingToken[];
  /** cited sources shown in the chip, avatar stack, and expanded list */
  sources?: StreamingSource[];
  /** follow-up prompt suggestions shown once the stream completes */
  followUps?: string[];
  /** prominent copy strings */
  labels?: Partial<StreamingLabels>;
  /** restart the stream after a hold; turn off when embedding in a real thread */
  loop?: boolean;
  /** fill the parent width instead of the gallery's fixed measure */
  fill?: boolean;
  onDone?: () => void;
  /** fired when a follow-up prompt is chosen */
  onFollowUp?: (text: string, index: number) => void;
} = {}) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [internalCount, setCount] = useState(0);
  const count = visibleCount ?? internalCount;
  const done = count >= content.length;

  useEffect(() => {
    if (visibleCount !== undefined || !playing) return;
    if (done && !loop) {
      onDone?.();
      return;
    }
    const t = setTimeout(
      () => setCount((c) => (c >= content.length ? 0 : c + 1)),
      (done ? HOLD_MS : WORD_MS) / speed,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, done, loop, visibleCount, playing, speed]);

  return (
    <div className={(fill ? "w-full" : "min-h-[15.5rem] w-full max-w-95") + (hoverActions ? " movi-history-response" : "")}>
      <p className="text-base leading-relaxed text-foreground">
        {content.slice(0, count).map((token, i) =>
          token.cite ? (
            <SourceChip key={i} source={sources[token.sourceIndex ?? 0]} />
          ) : (
            <span key={i} className={token.sentiment === 'success' ? 'inline font-medium text-success-foreground' : token.sentiment === 'error' ? 'inline font-medium text-destructive-foreground' : 'inline'}>
              {token.text}{" "}
            </span>
          ),
        )}
        {!done && (
          <span
            className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 rounded-full bg-foreground"
            style={{ animation: "movi-fade-in 150ms ease-out both" }}
          />
        )}
      </p>

      {done && afterContent}
      {showExtras && <>
      {/* action icons row */}
      <div
        className="movi-response-actions mt-2 flex items-center gap-0.5 transition-opacity duration-150"
        style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}
      >
        {ACTION_ICONS.map((icon, i) => (
          <button
            key={i}
            type="button"
            aria-label={["Copy response", "Replay response"][i]}
            onClick={() => onAction?.(i)}
            disabled={!onAction}
            className="flex size-6 items-center justify-center rounded-[6px] text-muted-foreground
              transition-colors duration-100 hover:bg-accent hover:text-muted-foreground"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
          </button>
        ))}
      </div>

      {/* follow-ups */}
      {followUps.length > 0 && <div
        className="mt-2.5 transition-opacity duration-400"
        style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}
      >
        <p className="text-base font-medium text-muted-foreground">{l.followUps}</p>
        <div className="mt-0.5 flex flex-col">
          {followUps.map((text, i) => (
            <button
              key={text}
              onClick={() => onFollowUp?.(text, i)}
              className="-mx-1.5 flex items-center gap-2 rounded-[7px] border-b border-border
                px-1.5 py-1.5 text-left text-base text-foreground transition-colors
                duration-100 hover:bg-accent"
              style={
                done
                  ? { animation: `movi-fade-up 350ms cubic-bezier(0.23,1,0.32,1) ${i * 90}ms both` }
                  : { opacity: 0 }
              }
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M9 10l-5 5 5 5" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
              {text}
            </button>
          ))}
        </div>
      </div>}
      </>}
    </div>
  );
}
