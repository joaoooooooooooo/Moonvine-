"use client";

import { useLayoutEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = {
  items: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  className?: string;
};

/** COSS underline tabs, falling back to p-select-22 when their labels cannot fit. */
export function ResponsiveChartTabs({ items, value, onValueChange, label, className }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      if (container.current && probe.current) setCompact(probe.current.scrollWidth > container.current.clientWidth);
    };
    const observer = new ResizeObserver(measure);
    if (container.current) observer.observe(container.current);
    if (probe.current) observer.observe(probe.current);
    measure();
    return () => observer.disconnect();
  }, [items]);
  return <div ref={container} className={cn('relative min-w-0 max-w-full flex-1 basis-48', className)}>
    <div ref={probe} aria-hidden="true" className="pointer-events-none invisible absolute flex w-max gap-0.5 whitespace-nowrap text-sm font-medium">
      {items.map(item => <span key={item.value} className="px-2.5">{item.label}</span>)}
    </div>
    {compact ? <Select items={items} value={value} onValueChange={next => { if (next !== null) onValueChange(next); }}>
      <SelectTrigger aria-label={label} className="border-transparent bg-muted shadow-none before:hidden"><SelectValue /></SelectTrigger>
      <SelectPopup>{items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup>
    </Select> : <Tabs value={value} onValueChange={next => onValueChange(String(next))}>
      <TabsList variant="underline" aria-label={label} className="ml-auto max-w-full data-[orientation=horizontal]:pt-0">
        {items.map(item => <TabsTab key={item.value} value={item.value} className="h-auto py-5 text-sm sm:h-auto">{item.label}</TabsTab>)}
      </TabsList>
    </Tabs>}
  </div>;
}
