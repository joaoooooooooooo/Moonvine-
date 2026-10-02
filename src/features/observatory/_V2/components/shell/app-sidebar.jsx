import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { SidebarGroupTransition } from './sidebar-group-transition';
import { NavUser } from './nav-user';
import { SearchCommand } from './search-command';
import { shellGroups, activeShellItem, chatShellItem } from './navigation';
import { accountHref } from '../../utils/observatory-model';
import { ChatNavigation } from './chat-navigation';
import { IntelligenceNavigation } from './intelligence-navigation';
import { useReportReadState } from '../../hooks/use-report-read-state';
import { ReportStatusDot } from '../report-status-dot';
import { chatHref } from '../../hooks/use-chat-threads';

export function AppSidebar({ model }) {
  const { hasUnread } = useReportReadState();
  const { setOpenMobile } = useSidebar();
  useEffect(() => { setOpenMobile(false); }, [model.route, setOpenMobile]);
  const active = activeShellItem(model.route);
  const group = model.route.lensId === 'intelligence:chat' ? 'chat' : model.account ? 'intelligence' : 'main';
  return (
    <Sidebar className="static min-h-full group-data-[collapsible=offcanvas]:hidden *:data-[slot=sidebar-inner]:bg-card" collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="relative h-14 p-0">
        {model.account ? (
          <SidebarMenu className="h-14 border-b px-3 py-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-muted-foreground" render={<a href="#/console" />} onClick={() => setOpenMobile(false)} tooltip="Back to Observatory">
                <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
                <span>{model.route.lensId === 'intelligence:chat' ? 'Chat' : 'Intelligence'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : <NavUser model={model} />}
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main navigation" className="overflow-x-clip px-1 pt-2">
          <SidebarGroupTransition group={group}>
          {model.route.lensId === 'intelligence:chat' ? <ChatNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : model.account ? <IntelligenceNavigation model={model} onNavigate={() => setOpenMobile(false)} /> : shellGroups.map((group) => <SidebarGroup key={group.label}>
            {group.label !== 'Console' && <SidebarGroupLabel className="font-normal">{group.label}</SidebarGroupLabel>}
            <SidebarMenu className="gap-2">{group.items.map((item) => <SidebarMenuItem key={item.href}>
              <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active.href === item.href} render={<a href={item.label === 'Reports' && model.account ? accountHref(model.account.id, 'report:history') : item.href} aria-current={active.href === item.href ? 'page' : undefined} />} tooltip={item.label} onClick={() => setOpenMobile(false)}>
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
                {item.label === 'Reports' && hasUnread && <ReportStatusDot unread />}
                {(item.label === 'Chat' || item.label === 'Intelligence') && <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0" />}
              </SidebarMenuButton>
            </SidebarMenuItem>)}</SidebarMenu>
          </SidebarGroup>)}
          </SidebarGroupTransition>
        </nav>
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t px-3 py-3">
        <a href={chatHref(model.account?.id ?? 'canopy')} onClick={() => setOpenMobile(false)}
          className="flex h-9.5 items-center gap-2 rounded-lg bg-foreground px-[calc(--spacing(3)-1px)] text-sm text-background transition-colors hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-8.5">
          {group === 'chat' ? <SquarePen aria-hidden="true" className="size-4 shrink-0" /> : <chatShellItem.icon aria-hidden="true" className="size-4 shrink-0" />}
          <span>{group === 'chat' ? 'New Chat' : 'Chat'}</span>
          {group !== 'chat' && <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0" />}
        </a>
        <SearchCommand model={model} />
      </SidebarFooter>
    </Sidebar>
  );
}



