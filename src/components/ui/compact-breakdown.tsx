"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ResponsiveChartTabs } from '@/components/ui/responsive-chart-tabs';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { cn } from '@/lib/utils';
import './compact-breakdown.css';

export type BreakdownItem = { id?: string; label: string; value: number; color?: string };
type Props = {
  title: string;
  items: BreakdownItem[];
  periods?: { id: string; label: string }[];
  period?: string;
  onPeriodChange?: (period: string) => void;
  totalLabel?: string;
  format?: (value: number) => string;
  comparison?: ReactNode;
  description?: string;
  month?: string;
  icon?: ReactNode;
  className?: string;
};
const formatCount = (value: number) => Math.round(value).toLocaleString('en-US');

// Locally authored from the supplied visual reference; not affectUI Pro source.
function CountingNumber({ value, format, reduced }: { value: number; format: (value: number) => string; reduced: boolean }) {
  const element = useRef<HTMLSpanElement>(null);
  const displayed = useRef(value);
  const [initialText] = useState(() => format(value));
  useEffect(() => {
    const update = (latest: number) => {
      displayed.current = latest;
      if (element.current) element.current.textContent = format(latest);
    };
    if (reduced) { update(value); return; }
    const animation = animate(displayed.current, value, { duration: 0.35, ease: 'easeOut', onUpdate: update });
    return () => animation.stop();
  }, [value, format, reduced]);
  return <span className="compact-breakdown__number tabular-nums" aria-label={format(value)}><span ref={element} aria-hidden="true">{initialText}</span></span>;
}

export function CompactBreakdown({ title, items, periods = [], period, onPeriodChange, totalLabel = 'Total', format = formatCount, comparison, description, month, icon, className }: Props) {
  const titleId = useId();
  const reduced = !!useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const rows = items.map((item, index) => ({ ...item, id: item.id ?? item.label, value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0, color: item.color ?? `var(--chart-${index % 5 + 1})` }));
  const largest = rows.reduce<(typeof rows)[number] | undefined>((best, row) => !best || row.value > best.value ? row : best, undefined);
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const active = rows.find((item) => item.id === (hovered ?? focused ?? selected));
  const share = (value: number) => total ? value / total * 100 : 0;
  const clear = () => { setHovered(null); setFocused(null); setSelected(null); };

  return <FrameCard withFill className={cn('compact-breakdown w-full min-w-0', className)} aria-labelledby={titleId} onPointerLeave={() => setHovered(null)} onKeyDown={(event) => { if (event.key === 'Escape') { clear(); (event.target as HTMLElement).blur(); } }}>
    <FrameCardContent className="compact-breakdown__content">
      <div className="compact-breakdown__header">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <h3 id={titleId} className="flex min-w-0 items-center gap-2 text-sm/normal font-medium">{icon && <span aria-hidden="true" className="shrink-0 [&_svg]:size-4">{icon}</span>}{title}</h3>
          {month && <span className="text-sm/normal tabular-nums text-muted-foreground">{month}</span>}
        </div>
        {periods.length > 0 && <ResponsiveChartTabs label={`${title} period`} items={periods.map(option => ({ value: option.id, label: option.label }))} value={period ?? periods[0].id} onValueChange={next => { clear(); onPeriodChange?.(next); }} />}
      </div>
      <div className="compact-breakdown__body">
        <div className="space-y-1">
          <div className="flex min-h-10 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-heading text-3xl font-normal tracking-tight tabular-nums"><CountingNumber value={active?.value ?? total} format={format} reduced={reduced} /></span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="flex min-h-5 items-center gap-2 text-sm/normal text-foreground">
            {active && <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: active.color }} aria-hidden="true" />}
            {active ? `${active.label} · ${share(active.value).toFixed(0)}%` : totalLabel}
          </p>
          {!active && comparison}
          </div>
        </div>
        <div className="compact-breakdown__bar" aria-hidden="true">
          {rows.map((item) => <motion.span key={item.id} data-channel={item.id} initial={false} className="compact-breakdown__segment" style={{ backgroundColor: item.color }} animate={{ flexGrow: item.value, opacity: active && active.id !== item.id ? 0.2 : 1 }} transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(item.id); }} onPointerLeave={() => setHovered(null)} />)}
        </div>
        <ol className="compact-breakdown__rows" aria-label={`${title} breakdown`}>
          {rows.map((item) => <li key={item.id}>
            <button type="button" className="compact-breakdown__row" data-active={active?.id === item.id || undefined} data-dimmed={!!active && active.id !== item.id || undefined} aria-pressed={selected === item.id} aria-label={`${item.label}: ${format(item.value)}, ${share(item.value).toFixed(0)}% of ${totalLabel.toLowerCase()}`} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(item.id); }} onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(item.id)} onBlur={() => setFocused(null)} onClick={(event) => { setSelected((current) => current === item.id ? null : item.id); if (event.detail > 0) { setFocused(null); event.currentTarget.blur(); } }}>
              <span className="flex min-w-0 items-center gap-2"><span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.label}</span></span>
              <span className="text-end font-medium"><CountingNumber value={item.value} format={format} reduced={reduced} /></span>
              <span className="text-end tabular-nums text-muted-foreground">{share(item.value).toFixed(0)}%</span>
            </button>
          </li>)}
        </ol>
        {!total && <p className="text-sm/normal text-muted-foreground">No visits in this period.</p>}
      </div>
      <div className="compact-breakdown__footer text-sm/normal text-muted-foreground">
        <p className="flex items-center gap-2">Largest: <span className="inline-flex items-center gap-2 font-medium text-foreground">{total > 0 && largest && <span aria-hidden="true" className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: largest.color }} />}{total ? largest?.label : '–'}</span></p>
        {description && <p>{description}</p>}
      </div>
    </FrameCardContent>
  </FrameCard>;
}
