import { Tooltip, TooltipPopup, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarTooltipContent } from './sidebar-tooltip-content';

export function SidebarControlTooltip({ label, children }) {
  const { state, isMobile } = useSidebar();
  return <Tooltip disabled={state !== 'collapsed' || isMobile}>
    <TooltipTrigger render={children} />
    <TooltipPopup side="right" align="start" sideOffset={12} className="chat-title-tooltip max-w-80 text-sm data-starting-style:-translate-x-1 data-ending-style:-translate-x-1 duration-150">
      <SidebarTooltipContent title={label} />
    </TooltipPopup>
  </Tooltip>;
}
