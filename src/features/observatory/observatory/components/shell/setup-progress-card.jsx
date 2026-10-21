import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible';
import { ChevronDown } from '@/components/ui/icons';
import { Dialog, DialogPopup, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import { useTour } from '../guided-tour/use-tour';
import { directoryRows } from '../../data/directory-rows';
import { TourIllustration } from '../guided-tour/tour-illustration';
import './setup-progress-card.css';

const steps = [
  { id: 'account', action: 'Set up account', label: 'Account', heading: 'Set up your account', description: 'Confirm your organization’s name and website so your workspace has the right details.' },
  { id: 'access', action: 'Add team members', label: 'Access', heading: 'Bring your team into Moonvine', description: 'Add a person to your workspace so you can manage their access and report preferences.' },
  { id: 'profile', action: 'Edit profile', label: 'Profile', optional: true, heading: 'Complete your profile', description: 'Add the details that help your team recognize you. You can skip this step and come back later.' },
  { id: 'sources', action: 'Connect data sources', label: 'Sources and integrations', heading: 'Connect your data sources', description: 'Connect a website to Google Analytics or Search Console to bring your own data into Moonvine.' },
  { id: 'reports', action: 'Manage report recipients', label: 'Access and reports', heading: 'Choose who receives reports', description: 'Choose a person in your workspace and enable their report recipient setting.' },
  { id: 'competitors', action: 'Add competitors', label: 'Competitors', heading: 'Choose your competitors', description: 'Add the organizations you want to follow and compare with your own.' },
  { id: 'prompts', action: 'Edit prompts', label: 'Prompts', heading: 'Choose what to ask', description: 'Edit the questions you want to track to understand how AI tools describe your organization.' },
];
const surface = 'relative isolate overflow-hidden rounded-md border border-border bg-popover bg-clip-padding text-popover-foreground shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]';

function Check({ checked }) {
  return <span className="setup-progress__check" data-checked={checked} aria-hidden="true"><svg viewBox="0 0 24 24" className="size-3"><path d="M6.5 12.5l3.5 3.5 7.5-8" pathLength="1" /></svg></span>;
}
function Checklist({ completed, skipped, onSelect, expanded, onExpandedChange }) {
  const count = steps.filter((step) => completed[step.id]).length;
  return <Collapsible open={expanded} onOpenChange={onExpandedChange} className="setup-progress__summary">
    <CollapsibleTrigger style={{ width: '100%' }} render={<Button variant="ghost" />} className="h-auto w-full justify-start gap-2 px-2.5 py-1 text-sm" aria-label={expanded ? 'Collapse Getting started' : 'Expand Getting started'}>
      <span className="font-medium">Getting started</span><span aria-hidden="true" className="font-normal tabular-nums text-muted-foreground"><span key={count} className="setup-progress__count text-foreground">{count}</span>/{steps.length}</span><ChevronDown aria-hidden="true" style={{ marginLeft: 'auto' }} className={`ml-auto size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
    </CollapsibleTrigger>
    <Progress value={count / steps.length * 100} aria-label="Getting started" aria-valuetext={`${count} of ${steps.length} steps complete`} className="setup-progress__progress"><ProgressTrack className="h-1 bg-muted"><ProgressIndicator className="setup-progress__fill relative h-full bg-info-foreground"><span key={count} className="setup-progress__shine" /></ProgressIndicator></ProgressTrack></Progress>
    <span className="sr-only" role="status">{count} of {steps.length} steps complete</span>
    <CollapsiblePanel><ol className="flex flex-col">{steps.map((step, index) => <li key={step.id}>
      <Button variant="ghost" className="setup-progress__step w-full justify-start gap-2.5 rounded-md px-2.5 text-sm font-normal" data-completed={Boolean(completed[step.id])} aria-label={`${step.label}${completed[step.id] ? ', complete' : skipped.includes(step.id) ? ', skipped' : step.optional ? ', optional' : ''}`} aria-haspopup={completed[step.id] ? undefined : 'dialog'} onClick={() => { if (!completed[step.id]) onSelect(index); }}>
        <Check checked={Boolean(completed[step.id])} /><span className="setup-progress__label min-w-0 text-start whitespace-normal"><span>{step.label}</span></span>
        {!completed[step.id] && (skipped.includes(step.id) || step.optional) && <span className="ml-auto text-xs text-muted-foreground">{skipped.includes(step.id) ? 'Skipped' : 'Optional'}</span>}
      </Button>
    </li>)}</ol></CollapsiblePanel>
  </Collapsible>;
}
export function SetupProgressCard({ model }) {
  const tour = useTour();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState('summary');
  const [active, setActive] = useState(0);
  const [skipped, setSkipped] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const triggerRef = useRef(null);
  const dockRef = useRef(null);
  const completed = model.setupActions[model.selectedAccountId] ?? {};
  const step = steps[active];
  const completedCount = steps.filter((item) => completed[item.id]).length;
  const isModal = mode === 'preview';
  const transition = { duration: reduceMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] };
  function openStep(index) {
    if (completed[steps[index].id]) return;
    triggerRef.current = document.activeElement;
    setActive(index);
    setMode('preview');
  }
  function nextStep(skip = false) {
    if (skip) setSkipped((current) => [...new Set([...current, step.id])]);
    const next = steps.findIndex((item, index) => index > active && !completed[item.id] && !skipped.includes(item.id));
    if (next < 0) setMode('summary');
    else { setActive(next); setMode('preview'); }
  }
  function beginStep() {
    const workspaceId = model.selectedAccountId;
    const person = directoryRows('people', model.accounts).find((item) => item.accountId === workspaceId);
    const destinations = {
      account: `/intelligence/client/${encodeURIComponent(workspaceId)}/current?lens=account:summary`,
      access: '/console/people',
      profile: person ? `/console/people/${encodeURIComponent(person.id)}` : '/console/people',
      sources: '/console/data-sources/first-party-data',
      reports: '/console/people',
      competitors: '/console/data-sources/competitors',
      prompts: '/console/data-sources/prompts',
    };
    window.location.hash = destinations[step.id];
    setMode('summary');
  }
  if (tour?.index !== null) return null;
  const checklist = <Checklist completed={completed} skipped={skipped} onSelect={openStep} expanded={expanded} onExpandedChange={setExpanded} />;
  const detail = <>
    <div className="space-y-5 p-4">
      <TourIllustration step={step.id === 'competitors' ? 'workspace' : step.id === 'prompts' ? 'chat' : step.id} className="setup-flow__illustration" />
      <div className="flex items-center gap-2">
        <Progress value={completedCount / steps.length * 100} aria-label="Setup steps" aria-valuetext={`${completedCount} of ${steps.length} steps complete`} className="min-w-0 flex-1">
          <ProgressTrack className="h-1 bg-muted">
            <ProgressIndicator className="setup-progress__fill relative h-full bg-info-foreground"><span key={completedCount} className="setup-progress__shine" /></ProgressIndicator>
          </ProgressTrack>
        </Progress>
        <span aria-hidden="true" className="shrink-0 text-xs tabular-nums text-muted-foreground"><span key={completedCount} className="setup-progress__count">{String(completedCount).padStart(2, '0')}</span>/{String(steps.length).padStart(2, '0')}</span>
      </div>
      <div className="space-y-1.5">
        <DialogTitle className="text-lg font-normal leading-7">{step.heading}</DialogTitle>
        <DialogDescription className="text-sm leading-5">{step.description}</DialogDescription>
      </div>
    </div>
    <div className="flex gap-2 border-t bg-muted/72 p-2"><Button className="shrink-0" variant="secondary" onClick={() => nextStep(true)}>Skip Step</Button><Button className="flex-1" onClick={beginStep}>{step.action}</Button></div>
  </>;
  return <LayoutGroup id="getting-started">
    {!isModal && createPortal(<div data-slot="setup-overlay" className="fixed right-6 bottom-6 z-[60] w-[calc(100%-3rem)] max-w-72 font-sans">
      <motion.section ref={dockRef} tabIndex={-1} layout="position" layoutId="setup-card" transition={transition} className={`${surface} setup-flow max-h-[calc(100dvh-3rem)] overflow-y-auto outline-none`} aria-label="Getting started" data-setup-state={mode}>
        {checklist}
      </motion.section>
    </div>, document.body)}
    <AnimatePresence>{isModal && <Dialog key="setup-dialog" open onOpenChange={(open) => { if (!open) setMode('summary'); }}>
      <DialogPopup render={<motion.div layout="position" layoutId="setup-card" transition={transition} exit={{ opacity: 0 }} />} portalProps={{ keepMounted: true, 'data-setup-dialog-portal': '' }} data-setup-state={mode} showCloseButton={false} bottomStickOnMobile={false} finalFocus={() => dockRef.current ?? triggerRef.current}
        className="setup-flow setup-flow__dialog will-change-auto max-w-[350px] overflow-y-auto rounded-md before:rounded-[calc(var(--radius-md)-1px)] transition-none data-starting-style:opacity-100 data-ending-style:opacity-100 sm:data-starting-style:scale-100 sm:data-ending-style:scale-100">
        {detail}
      </DialogPopup>
    </Dialog>}</AnimatePresence>
  </LayoutGroup>;
}
