import { Button } from '@/components/ui/button';
import { BorderGlow } from '../../../../../website/website v2/components/BorderGlow/border-glow';
import './upgrade-dialog.css';

export function UpgradePlanButton({ className = '' }) {
  return <BorderGlow animated colorFrom="#f5c56b" colorTo="#b78837" className={'upgrade-plan-glow relative min-w-0 rounded-md ' + className}>
    <Button type="button" variant="default" className="w-full">Upgrade Plan</Button>
  </BorderGlow>;
}
