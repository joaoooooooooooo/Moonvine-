import { SidebarControlTooltip } from './sidebar-control-tooltip';
import { useRef, useState } from 'react';
import { useTour } from '../guided-tour/use-tour';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpenIcon, CreditCardIcon, LifeBuoyIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon } from '@/components/ui/icons';
import { Menu, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';

export function FooterUserMenu() {
  const tour = useTour();
  const touring = Boolean(tour?.step);
  const [open, setOpen] = useState(false);
  const accountAnchorRef = useRef(null);
  const { isMobile, setOpenMobile, state } = useSidebar();
  const { resolvedTheme, setTheme } = useThemePreference();
  const collapsed = !isMobile && state === 'collapsed';

  return (
    <div className={collapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-2'}>
    <Tabs aria-label="Appearance" className={collapsed ? 'order-1' : 'order-2'} orientation={collapsed ? 'vertical' : 'horizontal'} size="sm" value={resolvedTheme} onValueChange={setTheme}>
      <TabsList>
        <TabsTab aria-label="Use light appearance" title="Light" value="light"><SunIcon aria-hidden="true" className="size-4" weight="light" /></TabsTab>
        <TabsTab aria-label="Use dark appearance" title="Dark" value="dark"><MoonIcon aria-hidden="true" className="size-4" weight="light" /></TabsTab>
      </TabsList>
    </Tabs>
    <SidebarMenu className={collapsed ? 'order-2 w-full min-w-0' : 'order-1 min-w-0 flex-1'}>
      <SidebarMenuItem>
        <Menu modal={!touring} open={touring ? tour.step.id === 'account' : open} onOpenChange={(next) => { if (!touring) setOpen(next); }}>
          <div ref={accountAnchorRef} className="w-full min-w-0">
            <SidebarControlTooltip label="Apta: Account menu"><MenuTrigger data-tour="account" render={<SidebarMenuButton className="h-10" aria-label="Open account menu" />}>
              <Avatar className="size-6"><AvatarFallback>A</AvatarFallback></Avatar>
              <span className="min-w-0 flex-1 truncate text-left font-medium">Apta</span>
            </MenuTrigger></SidebarControlTooltip>
          </div>
          <MenuPopup data-tour="account-menu" finalFocus={touring ? false : undefined} anchor={accountAnchorRef} align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={8} className="min-w-52">
            <MenuGroup>
              <MenuGroupLabel>Account</MenuGroupLabel>
              <MenuLinkItem href="#/console/your-account" onClick={() => setOpenMobile(false)}>
                <UserIcon aria-hidden="true" />Settings
              </MenuLinkItem>
              <MenuItem><CreditCardIcon aria-hidden="true" />Billing</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Support</MenuGroupLabel>
              <MenuItem><BookOpenIcon aria-hidden="true" />Docs</MenuItem>
              <MenuItem><LifeBuoyIcon aria-hidden="true" />Contact</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuItem variant="destructive" closeOnClick><LogOutIcon aria-hidden="true" />Log out</MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
    </div>
  );
}
