import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircleCheckIcon, CircleIcon } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';

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
    <div className="w-full rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
      <div className="w-full space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-medium">Setup progress</h2>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{completedSteps} of {steps.length}</span>
        </div>
        <Progress value={progressValue} aria-label="Setup progress" />
        <ol className="flex flex-col gap-1">
          {steps.map((step, index) => {
            const isCompleted = completed[index];
            const Icon = isCompleted ? CircleCheckIcon : CircleIcon;
            return (
              <li key={step.label}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-2 ${isCompleted ? 'text-sidebar-accent-foreground' : 'text-muted-foreground'}`}
                  aria-pressed={isCompleted}
                  onClick={() => setCompleted((current) => current.map((value, stepIndex) => stepIndex === index ? !value : value))}
                >
                  <Icon aria-hidden="true" className={`size-4 ${isCompleted ? 'text-success-foreground' : ''}`} />
                  <span>{step.label}</span>
                </Button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
