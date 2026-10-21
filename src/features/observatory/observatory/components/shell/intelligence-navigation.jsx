import { intelligenceItems } from '../../data/intelligence-navigation';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { accountHref } from '../../utils/observatory-model';
import { useReportReadState } from '../../hooks/use-report-read-state';
import { ReportStatusDot } from '../report-status-dot';
import { getSiteFixCount } from '../../data/site-fixes';
import { SiteFixStatus } from '../site-health/site-fix-status';
import { Badge } from '@/components/ui/badge';
import { SidebarTooltipContent } from './sidebar-tooltip-content';

export function IntelligenceNavigation({ model, onNavigate }) {
  const { hasUnread, unreadCount } = useReportReadState(model.account.id);
  const siteFixCount = getSiteFixCount(model.account.domain);
  return (
    <SidebarGroup data-tour="intelligence-navigation">
      <SidebarMenu className="gap-1">
        {intelligenceItems.map(({ label, lens, icon: Icon }) => {
          const active = (model.route.lensId ?? '') === lens;
          return (
            <SidebarMenuItem key={lens}>
              <SidebarMenuButton data-collapsed-status={lens === 'report:history' && hasUnread ? 'info' : lens === 'source:site' && siteFixCount > 0 ? 'warning' : undefined} className={`h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5${lens === 'source:site' ? ' group/site-health' : ''}${lens === 'report:history' ? ' group/report-status' : ''}`} isActive={active}
                render={<a href={accountHref(model.account.id, lens, model.route.period)} aria-label={label} aria-current={active ? 'page' : undefined} />}
                onClick={onNavigate} tooltip={{ children: <SidebarTooltipContent title={label}>
                  {lens === 'report:history' && hasUnread && <Badge variant="info" size="lg">{unreadCount} unread {unreadCount === 1 ? 'report' : 'reports'}</Badge>}
                  {lens === 'source:site' && siteFixCount > 0 && <Badge variant="warning" size="lg">{siteFixCount} {siteFixCount === 1 ? 'issue' : 'issues'}</Badge>}
                </SidebarTooltipContent> }}>
                <Icon aria-hidden="true" className="size-4.5" weight="fill" /><span>{label}</span>
                <span className="ml-auto flex shrink-0 items-center gap-2">
                  {lens === 'report:history' && hasUnread && <ReportStatusDot unread count={unreadCount} />}
                  {lens === 'source:site' && <SiteFixStatus count={siteFixCount} />}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}



