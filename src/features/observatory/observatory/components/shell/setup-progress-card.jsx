import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import './setup-progress-card.css';

const steps = [
  { label: 'Account', completed: true },
  { label: 'Profile', completed: true },
  { label: 'Preferences', completed: false },
  { label: 'Review', completed: false },
];

export function SetupProgressCard() {
  const [completed, setCompleted] = useState(() => steps.map((step) => step.completed));
  const completedSteps = completed.filter(Boolean).length;
  const progressValue = (completedSteps / steps.length) * 100;

  return (
    <section className="setup-progress w-full rounded-lg bg-card text-card-foreground" aria-label="Getting started" data-complete={completedSteps === steps.length || undefined}>
        <div className="setup-progress__header flex items-baseline justify-between gap-3 px-2.5">
          <h2 className="text-sm font-medium">Getting started</h2>
          <span aria-hidden="true" className="shrink-0 text-xs tabular-nums text-muted-foreground"><span key={completedSteps} className="setup-progress__count text-foreground">{completedSteps}</span>/{steps.length}</span>
        </div>
        <Progress value={progressValue} aria-label="Getting started" aria-valuetext={`${completedSteps} of ${steps.length} steps complete`} className="setup-progress__progress">
          <ProgressTrack className="h-1 bg-muted">
            <ProgressIndicator className="setup-progress__fill relative h-full bg-info-foreground"><span key={completedSteps} className="setup-progress__shine" /></ProgressIndicator>
          </ProgressTrack>
        </Progress>
        <span className="sr-only" role="status">{completedSteps} of {steps.length} steps complete</span>
        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const isCompleted = completed[index];
            return (
              <li key={step.label} className="setup-progress__row" style={{ '--step-index': index }}>
                <Button
                  variant="ghost"
                  className="setup-progress__step w-full justify-start gap-2.5 rounded-md px-2.5 text-sm font-normal"
                  role="checkbox"
                  aria-checked={isCompleted}
                  onClick={() => setCompleted((current) => current.map((value, stepIndex) => stepIndex === index ? !value : value))}
                >
                  <span className="setup-progress__check" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-3"><path d="M6.5 12.5l3.5 3.5 7.5-8" pathLength="1" /></svg></span>
                  <span className="setup-progress__label min-w-0 text-start whitespace-normal"><span>{step.label}</span></span>
                </Button>
              </li>
            );
          })}
        </ol>
    </section>
  );
}
