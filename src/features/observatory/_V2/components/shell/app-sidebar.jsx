import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import { SidebarGroupTransition } from './sidebar-group-transition';
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

const connectableSources = dataSourceSections.filter((section) => typeof section.connected === 'boolean');
const connectedSourceCount = connectableSources.filter((section) => section.connected).length;
const connectedSourceProgress = (connectedSourceCount / connectableSources.length) * 100;

export function AppSidebar({ model }) {
  const { hasUnread } = useReportReadState();
  const { setOpenMobile } = useSidebar();
  useEffect(() => { setOpenMobile(false); }, [model.route, setOpenMobile]);
  const active = activeShellItem(model.route);
  const group = model.route.path === '/console/data-sources/access' || model.route.path === '/console/accounts' || model.route.path.startsWith('/console/people') ? 'settings' : model.route.path.startsWith('/console/data-sources') ? 'data-sources' : model.route.lensId === 'intelligence:chat' && model.route.path !== '/console' ? 'chat' : model.account && model.route.path.startsWith('/intelligence/') ? 'intelligence' : 'main';
  return (
    <Sidebar className="v2-sidebar static min-h-full group-data-[collapsible=offcanvas]:hidden *:data-[slot=sidebar-inner]:bg-card" collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="relative h-16 border-b px-2 py-2 transition-colors hover:bg-accent/50 focus-within:bg-accent/50">
        <WorkspaceSwitcher model={model} />
      </SidebarHeader>
      {group !== 'main' && (
        <div className="group/back-link shrink-0 border-b px-2 py-2 transition-colors hover:bg-accent/50 focus-within:bg-accent/50">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-transparent hover:text-foreground group-focus-within/back-link:text-foreground group-hover/back-link:text-foreground data-pressed:bg-transparent" render={<a href="#/console" />} onClick={() => setOpenMobile(false)}>
            <ChevronLeft aria-hidden="true" className="size-4" />
            Back to Observatory
          </Button>
        </div>
      )}
      <ScrollArea data-slot="sidebar-content" data-sidebar="content" className="v2-sidebar-content h-auto min-h-0 flex-1" overscrollContain scrollFade>
        <nav aria-label="Main navigation" className="overflow-x-clip px-1 pt-2">
          <SidebarGroupTransition group={group}>
          {group === 'data-sources' ? <DataSourcesNavigation route={model.route} onNavigate={() => setOpenMobile(false)} /> : group === 'settings' ? <SettingsNavigation route={model.route} onNavigate={() => setOpenMobile(false)} /> : group === 'chat' ? <ChatNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : group === 'intelligence' ? <IntelligenceNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : <>
          <SidebarGroup>
            <SidebarMenu className="gap-2">{shellGroups.flatMap((group) => group.items).map((item) => <SidebarMenuItem key={item.href}>
              <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active.href === item.href} render={<a href={item.label === 'Reports' ? `#/console/reports?account=${encodeURIComponent(model.selectedAccountId)}` : item.label === 'Intelligence' ? accountHref(model.selectedAccountId) : item.href} aria-current={active.href === item.href ? 'page' : undefined} />} tooltip={item.label} onClick={() => setOpenMobile(false)}>
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
                  {item.label === 'Reports' && hasUnread && <ReportStatusDot unread />}
                  {(item.label === 'Chat' || item.label === 'Intelligence' || item.label === 'Settings' || item.label === 'Data Sources') && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>)}</SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator className="my-3" />
          <ChatNavigation model={model} onNavigate={() => setOpenMobile(false)} />
          </>}
          </SidebarGroupTransition>
        </nav>
      </ScrollArea>
      <SidebarFooter className="gap-3 border-t px-3 py-3">
        <SearchCommand model={model} />
        <FooterUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}



