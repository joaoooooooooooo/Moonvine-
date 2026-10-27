import { UpgradeIllustration } from './upgrade-illustration';
import { Button } from '@/components/ui/button';
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { UpgradePlanButton } from './upgrade-plan-button';
import { upgradeCopy } from '../data/upgrade-copy';
import './upgrade-dialog.css';

export function UpgradeDialog({ lensId, onDecline }) {
  const [title, description] = upgradeCopy[lensId ?? ''] ?? upgradeCopy[''];
  return <Dialog open onOpenChange={(open) => { if (!open) onDecline(); }}>
    <DialogPopup portalProps={{ 'data-upgrade-portal': '' }} showCloseButton={false} bottomStickOnMobile={false} className="upgrade-dialog max-w-lg overflow-hidden">
      <DialogHeader className="gap-2 p-6">
        <UpgradeIllustration lensId={lensId} />
        <DialogTitle className="max-w-lg text-2xl font-normal leading-tight">{title}</DialogTitle>
        <DialogDescription className="max-w-[36ch] text-sm leading-5">{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="grid shrink-0 grid-cols-2 gap-2 p-3 sm:rounded-b-[calc(var(--radius-2xl)-1px)]">
        <Button variant="secondary" className="flex-1" onClick={onDecline}>No thanks</Button>
        <UpgradePlanButton className="flex-1" />
      </DialogFooter>
    </DialogPopup>
  </Dialog>;
}
