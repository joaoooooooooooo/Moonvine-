import { intelligenceItems } from '../../data/intelligence-navigation';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { accountHref } from '../../utils/observatory-model';
import { useReportReadState } from '../../hooks/use-report-read-state';
import { ReportStatusDot } from '../report-status-dot';
import { getSiteFixCount } from '../../data/site-fixes';
import { SiteFixStatus } from '../site-health/site-fix-status';

export function IntelligenceNavigation({ model, onNavigate }) {
  const { hasUnread } = useReportReadState(model.account.id);
  const siteFixCount = getSiteFixCount(model.account.domain);
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {intelligenceItems.map(({ label, lens, icon: Icon }) => {
          const active = (model.route.lensId ?? '') === lens;
          return (
            <SidebarMenuItem key={lens}>
              <SidebarMenuButton className={`h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5${lens === 'source:site' ? ' group/site-health' : ''}`} isActive={active}
                render={<a href={accountHref(model.account.id, lens, model.route.period)} aria-current={active ? 'page' : undefined} />}
                onClick={onNavigate} tooltip={label}>
                <Icon aria-hidden="true" className="size-4.5" /><span>{label}</span>
                {lens === 'report:history' && hasUnread && <ReportStatusDot unread />}
                {lens === 'source:site' && <SiteFixStatus count={siteFixCount} />}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}



