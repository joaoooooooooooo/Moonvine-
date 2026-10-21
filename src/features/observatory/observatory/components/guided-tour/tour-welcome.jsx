import { useRef } from 'react';
import { Dialog, DialogPopup, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import lightLogo from '@/assets/Logo Icon - Light.svg';
import darkLogo from '@/assets/Logo Icon - Dark.svg';

export function TourWelcome({ onStart, onSkip }) {
  const startButton = useRef(null);
  return <Dialog open onOpenChange={(open, event) => { if (!open && event.reason === 'escape-key') onSkip(); }}>
    <DialogPopup data-tour-welcome showCloseButton={false} bottomStickOnMobile={false} initialFocus={startButton}
      finalFocus={() => document.querySelector('[data-tour-card] [data-tour-next]') ?? document.querySelector('[data-tour="account"]')}
      className="max-w-md overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] motion-reduce:transition-none">
      <div className="flex flex-col items-start gap-6 p-6">
        <img src={lightLogo} alt="" aria-hidden="true" className="h-10 w-auto dark:hidden" />
        <img src={darkLogo} alt="" aria-hidden="true" className="hidden h-10 w-auto dark:block" />
        <div className="space-y-2">
          <DialogTitle className="text-2xl font-normal leading-8">Welcome to Moonvine!<br />Let’s put you in orbit.</DialogTitle>
          <DialogDescription className="max-w-[32ch] text-base leading-6">Take a quick tour of your workspace, insights, and reports.</DialogDescription>
        </div>
      </div>
      <DialogFooter className="flex-row gap-2 p-2 sm:rounded-none">
        <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={onSkip}>Skip Tour</Button>
        <Button ref={startButton} className="flex-1" onClick={onStart}>Start Tour</Button>
      </DialogFooter>
    </DialogPopup>
  </Dialog>;
}
