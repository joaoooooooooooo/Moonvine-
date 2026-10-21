import { useTour } from '../guided-tour/use-tour';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarControlTooltip } from './sidebar-control-tooltip';
import { SidebarTooltipContent } from './sidebar-tooltip-content';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import { WorkspaceSwitcher } from './workspace-switcher';
import { SearchCommand } from './search-command';
import { FooterUserMenu } from './footer-user-menu';
import { shellGroups, activeShellItem } from './navigation';
import { accountHref } from '../../utils/observatory-model';
import { ChatNavigation } from './chat-navigation';
import { IntelligenceNavigation } from './intelligence-navigation';
import { SettingsNavigation } from './settings-navigation';
import { DataSourcesNavigation } from './data-sources-navigation';
import { useReportReadState } from '../../hooks/use-report-read-state';
import { ReportStatusDot } from '../report-status-dot';
import { dataSourceSections } from '../../data/data-source-navigation';
import { getSiteFixCount } from '../../data/site-fixes';
import { SiteFixStatus } from '../site-health/site-fix-status';
import { initialBookmarkWorkspaces } from '../../data/bookmarks';
import { FolderIcon } from '@/components/ui/icons';

const connectableSources = dataSourceSections.filter((section) => typeof section.connected === 'boolean');
const connectedSourceCount = connectableSources.filter((section) => section.connected).length;
const connectedSourceProgress = (connectedSourceCount / connectableSources.length) * 100;

export function AppSidebar({ model }) {
  const [bookmarkWorkspaces, setBookmarkWorkspaces] = useState(initialBookmarkWorkspaces);
  const { hasUnread, unreadCount } = useReportReadState(model.selectedAccountId);
  const sidebarAccount = model.account ?? model.accounts.find((item) => item.id === model.selectedAccountId) ?? model.accounts[0];
  const siteFixCount = sidebarAccount ? getSiteFixCount(sidebarAccount.domain) : 0;
  const { setOpenMobile, isMobile } = useSidebar();
  const tour = useTour();
  const tourMobile = isMobile && Boolean(tour?.step);
  useEffect(() => { const sync = () => { try { setBookmarkWorkspaces(JSON.parse(window.localStorage.getItem('observatory-bookmark-workspaces')) || initialBookmarkWorkspaces); } catch { setBookmarkWorkspaces(initialBookmarkWorkspaces); } }; sync(); window.addEventListener('observatory-bookmarks-change', sync); return () => window.removeEventListener('observatory-bookmarks-change', sync); }, []);
  useEffect(() => { setOpenMobile(false); }, [model.route, setOpenMobile]);
  const active = activeShellItem(model.route);
  const group = model.route.path === '/console/data-sources/access' || model.route.path === '/console/accounts' || model.route.path.startsWith('/console/people') ? 'settings' : model.route.path.startsWith('/console/data-sources') ? 'data-sources' : model.route.lensId === 'intelligence:chat' && model.route.path !== '/console' ? 'chat' : model.account && model.route.path.startsWith('/intelligence/') ? 'intelligence' : 'main';
  return (
    <TooltipProvider delay={150} timeout={500}><Sidebar id="observatory-sidebar" className={tourMobile ? `v2-sidebar !fixed inset-y-0 left-0 z-50 !w-72 ${tour.step.id === 'chat' ? 'hidden' : ''}` : "v2-sidebar static min-h-full group-data-[collapsible=offcanvas]:hidden"} collapsible={tourMobile ? "none" : "icon"} variant="sidebar">
      <SidebarHeader className="gap-1 p-2 pt-3">
        <WorkspaceSwitcher model={model} />
        <SearchCommand model={model} />
      </SidebarHeader>
      {group !== 'main' && (
        <div data-slot="sidebar-back-link" className="group/back-link relative shrink-0 p-2">
          <SidebarControlTooltip label="Go Back"><Button variant="ghost" className="w-full justify-start text-muted-foreground" render={<a href="#/console" aria-label="Go Back" />} onClick={() => setOpenMobile(false)}>
            <ChevronLeft aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
            <span data-slot="sidebar-back-label">Go Back</span>
          </Button></SidebarControlTooltip>
        </div>
      )}
      <SidebarSeparator />
      <ScrollArea data-slot="sidebar-content" data-sidebar="content" className="v2-sidebar-content h-auto min-h-0 flex-1" overscrollContain scrollFade>
        <nav aria-label="Main navigation" className="overflow-x-clip [&_[data-slot=sidebar-group]]:p-2">
          <>
          {group === 'data-sources' ? <DataSourcesNavigation route={model.route} onNavigate={() => setOpenMobile(false)} /> : group === 'settings' ? <SettingsNavigation route={model.route} onNavigate={() => setOpenMobile(false)} /> : group === 'chat' ? <ChatNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : group === 'intelligence' ? <IntelligenceNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : <>
          <SidebarGroup>
            <SidebarMenu className="gap-1">{shellGroups.flatMap((group) => group.items).map((item) => <SidebarMenuItem key={item.href}>
              <SidebarMenuButton data-tour={item.label === 'Reports' ? 'reports' : item.label === 'Intelligence' ? 'intelligence' : undefined} data-collapsed-status={item.label === 'Data Sources' ? (connectedSourceCount ? 'info' : 'muted') : item.label === 'Reports' && hasUnread ? 'info' : item.label === 'Intelligence' && siteFixCount > 0 ? 'warning' : undefined} className={`h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5${item.label === 'Reports' ? ' group/report-status' : ''}${item.label === 'Intelligence' ? ' group/site-health' : ''}`} isActive={active.href === item.href} render={<a href={item.label === 'Reports' ? `#/console/reports?account=${encodeURIComponent(model.selectedAccountId)}` : item.label === 'Intelligence' ? accountHref(model.selectedAccountId) : item.href} aria-label={item.label} aria-current={active.href === item.href ? 'page' : undefined} />} tooltip={{ children: <SidebarTooltipContent title={item.label}>
                {item.label === 'Data Sources' && <Badge variant="info" size="lg">{connectedSourceCount}/{connectableSources.length} connected</Badge>}
                {item.label === 'Reports' && hasUnread && <Badge variant="info" size="lg">{unreadCount} unread {unreadCount === 1 ? 'report' : 'reports'}</Badge>}
                {item.label === 'Intelligence' && siteFixCount > 0 && <Badge variant="warning" size="lg">{siteFixCount} {siteFixCount === 1 ? 'issue' : 'issues'}</Badge>}
              </SidebarTooltipContent> }} onClick={() => setOpenMobile(false)}>
                <item.icon aria-hidden="true" className="size-4.5" weight="fill" />
                <span>{item.label}</span>
                <span className="ml-auto flex shrink-0 items-center gap-2">
                  {item.label === 'Data Sources' && <Badge variant="info" size="lg" className="gap-1.5">
                    <svg viewBox="0 0 16 16" className="size-3.5 text-info-foreground opacity-100" role="progressbar" aria-label="Sources connected" aria-valuemin={0} aria-valuemax={connectableSources.length} aria-valuenow={connectedSourceCount} aria-valuetext={`${connectedSourceCount} of ${connectableSources.length} sources connected`}>
                      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-20" />
                      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" pathLength="100" strokeDasharray={`${connectedSourceProgress} 100`} transform="rotate(-90 8 8)" />
                    </svg>
                    <span aria-hidden="true">{connectedSourceCount}/{connectableSources.length}</span>
                  </Badge>}
                  {item.label === 'Reports' && hasUnread && <ReportStatusDot unread count={unreadCount} />}
                  {item.label === 'Intelligence' && <SiteFixStatus count={siteFixCount} />}
                  {(item.label === 'Chat' || item.label === 'Intelligence' || item.label === 'Settings' || item.label === 'Data Sources') && <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>)}</SidebarMenu>
          </SidebarGroup>
          {active.href === '#/console/bookmarks' && <SidebarGroup className="pt-0"><div className="mb-1 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground"><span>Workspaces</span><span className="tabular-nums">{bookmarkWorkspaces.length}</span></div><SidebarMenu className="gap-1">{bookmarkWorkspaces.map((workspace) => <SidebarMenuItem key={workspace.id}><SidebarMenuButton className="h-8 px-3 text-muted-foreground" isActive={model.route.path === `/console/bookmarks/${workspace.id}`} render={<a href={`#/console/bookmarks/${workspace.id}`} aria-label={`Open ${workspace.name}`} aria-current={model.route.path === `/console/bookmarks/${workspace.id}` ? 'page' : undefined} />} onClick={() => setOpenMobile(false)}><FolderIcon aria-hidden="true" className="size-4" /><span className="min-w-0 truncate">{workspace.name}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroup>}
          <SidebarSeparator />
          <ChatNavigation model={model} onNavigate={() => setOpenMobile(false)} />
          </>}
          </>
        </nav>
      </ScrollArea>
      <SidebarFooter className="p-2 pb-3">
        <FooterUserMenu />
      </SidebarFooter>
    </Sidebar></TooltipProvider>
  );
}



