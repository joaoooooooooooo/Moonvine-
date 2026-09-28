import { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { SearchCommand } from './search-command';
import { shellGroups, activeShellItem } from './navigation';
import { accountHref } from '../../utils/observatory-model';

export function AppSidebar({ model }) {
  const { setOpenMobile } = useSidebar();
  useEffect(() => { setOpenMobile(false); }, [model.route, setOpenMobile]);
  const active = activeShellItem(model.route);
  return (
    <Sidebar className="static min-h-full group-data-[collapsible=offcanvas]:hidden *:data-[slot=sidebar-inner]:bg-background" collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="relative h-14 p-0"><NavUser model={model} /></SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main navigation">
          {shellGroups.map((group) => <SidebarGroup key={group.label}>
            {group.label !== 'Console' && <SidebarGroupLabel className="font-normal">{group.label}</SidebarGroupLabel>}
            <SidebarMenu>{group.items.map((item) => <SidebarMenuItem key={item.href}>
              <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active.href === item.href} render={<a href={item.label === 'Reports' && model.account ? accountHref(model.account.id, 'report:history') : item.href} aria-current={active.href === item.href ? 'page' : undefined} />} tooltip={item.label} onClick={() => setOpenMobile(false)}>
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>)}</SidebarMenu>
          </SidebarGroup>)}
        </nav>
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t px-3 py-3">
        <SearchCommand model={model} />
      </SidebarFooter>
    </Sidebar>
  );
}
