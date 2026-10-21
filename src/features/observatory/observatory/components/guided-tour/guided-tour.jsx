import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Dialog, DialogPortal, DialogPrimitive, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import { useSidebar } from '@/components/ui/sidebar';
import { useTour } from './use-tour';
import { tourSteps } from './tour-steps';
import { TourIllustration } from './tour-illustration';
import { TourWelcome } from './tour-welcome';
import './guided-tour.css';
import '../shell/setup-progress-card.css';

const padding = 4;
const gap = 16;

export function GuidedTour({ model }) {
  const { step, index, welcome, setIndex, finish } = useTour();
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const previousSidebar = useRef(null);
  const returnFocus = useRef(null);
  const card = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const reduced = useReducedMotion();
  const maskId = useId();
  const active = Boolean(step);
  const route = step?.route(model.selectedAccountId);
  const ready = Boolean(step && geometry?.step === step.id);

  useEffect(() => {
    if (!active) return;
    const dismiss = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      finish();
    };
    document.addEventListener('keydown', dismiss, true);
    return () => document.removeEventListener('keydown', dismiss, true);
  }, [active, finish]);

  useEffect(() => {
    if (!ready) return;
    // Route changes and preview menus can move focus. Keep it on the tour's
    // primary action once the new target is measured and the action is enabled.
    const frame = requestAnimationFrame(() => card.current?.querySelector('[data-tour-next]')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [ready, step]);

  useEffect(() => {
    if (!active) return;
    returnFocus.current = document.activeElement;
    previousSidebar.current = { open, openMobile };
    return () => {
      setOpen(previousSidebar.current.open);
      setOpenMobile(previousSidebar.current.openMobile);
      const target = returnFocus.current?.isConnected && returnFocus.current !== document.body
        ? returnFocus.current : document.querySelector('[data-tour="account"]');
      target?.focus({ preventScroll: true });
    };
    // Capture the original sidebar state once, not the state the tour sets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!step) return;
    if (window.location.hash !== route) window.location.hash = route;
    setOpen(true);
    setOpenMobile(isMobile && step.id !== 'chat');
  }, [step, route, isMobile, model.route.path, setOpen, setOpenMobile]);

  useLayoutEffect(() => {
    if (!step) { setGeometry(null); return; }
    let frame;
    let cancelled = false;
    const observed = new Set();
    const measure = () => {
      if (cancelled) return;
      if (window.location.hash !== route) return;
      const targets = step.targets.map((id) => [...document.querySelectorAll(`[data-tour="${id}"]`)].find((el) => el.getBoundingClientRect().width > 0));
      if (targets.some((el) => !el)) return;
      // Once the route's anchors exist, only size/scroll changes need measuring.
      mutations.disconnect();
      for (const target of targets) {
        if (!observed.has(target)) { observer.observe(target); observed.add(target); }
      }
      const rects = targets.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - padding, y: r.top - padding, width: r.width + padding * 2, height: r.height + padding * 2 };
      });
      const left = Math.min(...rects.map((r) => r.x));
      const top = Math.min(...rects.map((r) => r.y));
      const right = Math.max(...rects.map((r) => r.x + r.width));
      const bottom = Math.max(...rects.map((r) => r.y + r.height));
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const cardWidth = Math.min(350, width - gap * 2);
      const cardHeight = card.current?.offsetHeight ?? 425;
      let x = right + gap;
      let y = step.align === 'end' ? bottom - cardHeight : top;
      if (step.align === 'center') { x = left + (right - left - cardWidth) / 2; y = top - gap - cardHeight; }
      else if (x + cardWidth > width - gap) {
        x = left;
        y = bottom + gap;
        if (y + cardHeight > height - gap && top > height - bottom) y = top - gap - cardHeight;
      }
      const next = { step: step.id, rects, width, height, cardWidth, x: Math.max(gap, Math.min(x, width - gap - cardWidth)), y: Math.max(gap, Math.min(y, height - gap - cardHeight)) };
      setGeometry((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    if (card.current) observer.observe(card.current);
    // Watch only until portalled targets mount, not every subsequent DOM update.
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    window.visualViewport?.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect(); mutations.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      window.visualViewport?.removeEventListener('resize', schedule);
    };
  }, [step, route, model.route.path, isMobile]);

  const transition = reduced ? { duration: 0 } : { type: 'tween', duration: 0.18, ease: [0.2, 0, 0, 1] };
  if (welcome) return <TourWelcome onStart={() => setIndex(0)} onSkip={finish} />;
  return <Dialog open={active} onOpenChange={(next, event) => { if (!next && event.reason === 'escape-key') finish(); }}>
    {active && <DialogPortal>
      <LayoutGroup id="observatory-tour">
        <motion.div layoutRoot className="guided-tour-layer">
          <svg className="guided-tour-shade" aria-hidden="true" width="100%" height="100%">
            <defs><mask id={maskId}><rect width="100%" height="100%" fill="white" />
              {geometry?.rects.map((rect, i) => <rect key={i} {...rect} style={{ rx: 'var(--radius-lg)' }} fill="black" />)}
            </mask></defs>
            <rect width="100%" height="100%" className="guided-tour-dim" mask={`url(#${maskId})`} />
            {geometry?.rects.map((rect, i) => <rect key={i} x={rect.x + padding / 2} y={rect.y + padding / 2} width={rect.width - padding} height={rect.height - padding} style={{ rx: 'var(--radius-md)' }} fill="none" className="guided-tour-highlight" strokeWidth={padding} />)}
          </svg>
          <DialogPrimitive.Popup
            ref={card}
            aria-modal="true"
            onKeyDown={(event) => {
              if (event.key !== 'Tab') return;
              const actions = [...card.current.querySelectorAll('button:not(:disabled)')];
              const current = actions.indexOf(document.activeElement);
              const next = (current + (event.shiftKey ? -1 : 1) + actions.length) % actions.length;
              event.preventDefault();
              event.stopPropagation();
              actions[next]?.focus();
            }}
            data-tour-card={step.id}
            className="guided-tour-card border bg-popover text-popover-foreground shadow-lg/5 outline-none"
            style={{ left: geometry?.x ?? gap, top: geometry?.y ?? gap, width: geometry?.cardWidth ?? 350, borderRadius: 'var(--radius-md)', visibility: geometry ? 'visible' : 'hidden' }}
            render={<motion.div layout="position" layoutId="tour-card" transition={{ layout: transition }} />}
            finalFocus={false}
          >
            <div className="p-4">
              <TourIllustration step={step.id} />
              <div className="flex flex-col gap-1 pt-4 pb-2" aria-live="polite" aria-atomic="true">
                <div className="guided-tour-progress flex items-center gap-2">
                  <Progress value={((index + 1) / tourSteps.length) * 100} aria-label="Tour progress" aria-valuetext={`Step ${index + 1} of ${tourSteps.length}`} className="min-w-0 flex-1">
                    <ProgressTrack className="h-1 bg-muted">
                      <ProgressIndicator className="setup-progress__fill relative h-full bg-info-foreground" style={{ transform: `scaleX(${(index + 1) / tourSteps.length})` }}><span key={index} className="setup-progress__shine" /></ProgressIndicator>
                    </ProgressTrack>
                  </Progress>
                  <span aria-hidden="true" className="shrink-0 text-xs tabular-nums text-muted-foreground"><span key={index} className="setup-progress__count">{String(index + 1).padStart(2, '0')}</span>/{String(tourSteps.length).padStart(2, '0')}</span>
                </div>
                <DialogTitle className="text-lg leading-7 font-normal tracking-tight">{step.title}</DialogTitle>
                <DialogDescription className="text-sm leading-5">{step.description}</DialogDescription>
              </div>
            </div>
            <DialogFooter className="flex-row justify-between gap-2 p-2 sm:justify-between sm:rounded-none">
              <Button variant="ghost" className="text-muted-foreground" onClick={finish}>Skip Tour</Button>
              <div className="flex gap-1.5">
                <Button variant="secondary" disabled={index === 0 || !ready} onClick={() => setIndex(index - 1)}>Back</Button>
                <Button data-tour-next disabled={!ready} onClick={() => index === tourSteps.length - 1 ? finish() : setIndex(index + 1)}>{index === tourSteps.length - 1 ? 'Done' : 'Next'}</Button>
              </div>
            </DialogFooter>
          </DialogPrimitive.Popup>
        </motion.div>
      </LayoutGroup>
    </DialogPortal>}
  </Dialog>;
}
