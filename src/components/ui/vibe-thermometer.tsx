"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import './vibe-thermometer.css';

const vibeStates = [
  { label: 'Critical', color: 'var(--vibe-critical)', text: 'var(--vibe-critical-text)' },
  { label: 'At risk', color: 'var(--vibe-at-risk)', text: 'var(--vibe-error-text)' },
  { label: 'Watch', color: 'var(--vibe-watch)', text: 'var(--vibe-warning-text)' },
  { label: 'Healthy', color: 'var(--vibe-healthy)', text: 'var(--vibe-healthy-text)' },
  { label: 'Unicorn', color: 'var(--vibe-unicorn)', text: 'var(--vibe-success-text)' },
] as const;

export type Vibe = typeof vibeStates[number]['label'];

/** A read-only report signal with an explorable, qualitative scale—not a score input. */
export function VibeThermometer({ value }: { value: Vibe }) {
  const current = Math.max(0, vibeStates.findIndex(state => state.label === value));
  const [active, setActive] = useState(current);
  const [tabStop, setTabStop] = useState(current);
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const bounds = useRef({ left: 0, width: 0, labelWidth: 0 });
  const pointerInside = useRef(false);
  const activeIndex = useRef(current);
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 550, damping: 47, mass: 0.6 });
  const reducedMotion = useReducedMotion();
  const measures = useRef<HTMLDivElement>(null);
  const widths = useRef<number[]>([]);
  const [labelWidth, setLabelWidth] = useState(0);
  const tooltipId = useId();
  const descriptionId = useId();
  const state = vibeStates[active];

  const position = useCallback((ratio: number) => {
    const { width } = bounds.current;
    const labelWidth = widths.current[activeIndex.current] || bounds.current.labelWidth;
    setLabelWidth(labelWidth);
    x.set(Math.max(0, Math.min(width - labelWidth, ratio * width - labelWidth / 2)));
  }, [x]);

  function show(index: number, ratio = (index + 0.5) / vibeStates.length) {
    if (activeIndex.current !== index) {
      activeIndex.current = index;
      setActive(index);
    }
    position(ratio);
  }

  function restore() { show(current); }

  useLayoutEffect(() => {
    const measure = () => {
      if (!root.current || !label.current) return;
      const rect = root.current.getBoundingClientRect();
      bounds.current.left = rect.left;
      bounds.current.width = rect.width;
      bounds.current.labelWidth = label.current.offsetWidth;
      widths.current = Array.from(measures.current?.children || [], child => (child as HTMLElement).offsetWidth);
      position((activeIndex.current + 0.5) / vibeStates.length);
    };
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    measure();
    return () => observer.disconnect();
  }, [position]);

  useLayoutEffect(() => {
    activeIndex.current = current;
    setActive(current);
    setTabStop(current);
    position((current + 0.5) / vibeStates.length);
  }, [current, position]);

  return <div className="vibe-thermometer" ref={root} data-current-vibe={value}
    onPointerEnter={() => {
      pointerInside.current = true;
      if (root.current) bounds.current.left = root.current.getBoundingClientRect().left;
    }}
    onPointerMove={event => {
      const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.current.left) / bounds.current.width));
      show(Math.min(4, Math.floor(ratio * vibeStates.length)), ratio);
    }}
    onPointerLeave={() => { pointerInside.current = false; restore(); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) restore(); }}>
    <p id={descriptionId} className="sr-only">Current report vibe: {value}. Explore the five labels with the arrow keys or pointer. Exploring does not change the report.</p>
    <motion.div ref={label} id={tooltipId} role="tooltip" className="vibe-thermometer__label" initial={false}
      animate={{ width: labelWidth || 'auto' }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
      style={{ x: reducedMotion ? x : smoothX, color: state.text, backgroundColor: state.color }}>
      {state.label}
    </motion.div>
    <div ref={measures} className="vibe-thermometer__measures" aria-hidden="true">
      {vibeStates.map(item => <span className="vibe-thermometer__label" key={item.label}>{item.label}</span>)}
    </div>
    <div className="vibe-thermometer__scale" role="group" aria-label="Explore vibe scale" aria-describedby={descriptionId}>
      {vibeStates.map((item, index) => <button key={item.label} ref={element => { buttons.current[index] = element; }}
        type="button" className="vibe-thermometer__zone" tabIndex={tabStop === index ? 0 : -1}
        aria-label={`${item.label}${index === current ? ', current report vibe' : ''}`} aria-describedby={tooltipId}
        onFocus={() => { setTabStop(index); if (!pointerInside.current) show(index); }}
        onClick={() => show(index)}
        onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(4, index + 1);
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, index - 1);
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = 4;
          else if (event.key === 'Escape') { event.preventDefault(); event.currentTarget.blur(); restore(); return; }
          else return;
          event.preventDefault();
          setTabStop(next);
          show(next);
          buttons.current[next]?.focus();
        }}>
        <span aria-hidden="true" className="vibe-thermometer__segments" style={{ color: item.color }}>
          <span /><span /><span />
        </span>
      </button>)}
      <span className="vibe-thermometer__current" aria-hidden="true" style={{ left: `${(current + 0.5) / vibeStates.length * 100}%`, backgroundColor: vibeStates[current].color }} />
    </div>
  </div>;
}
