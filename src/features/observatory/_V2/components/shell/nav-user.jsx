import { ChevronsUpDown, Settings, Building2, Monitor, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, MenuTrigger, MenuPopup, MenuGroup, MenuGroupLabel, MenuLinkItem, MenuSeparator, MenuSub, MenuSubTrigger, MenuSubPopup, MenuRadioGroup, MenuRadioItem } from '@/components/ui/menu';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';
import { accountHref } from '../../utils/observatory-model';

export function NavUser({ model }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useThemePreference();
  return (
    <SidebarMenu className="h-14 border-b px-3 py-2"><SidebarMenuItem>
      <Menu>
        <MenuTrigger render={<SidebarMenuButton className="h-10 text-muted-foreground" aria-label="Open workspace menu" />}>
          <Avatar className="size-5"><AvatarFallback>A</AvatarFallback></Avatar>
          <span className="text-sm font-medium">Apta</span><ChevronsUpDown className="ml-auto size-3!" />
        </MenuTrigger>
        <MenuPopup align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={4} className="min-w-56">
          <MenuGroup><MenuGroupLabel>Apta workspace</MenuGroupLabel>
            <MenuLinkItem href="#/console/accounts" closeOnClick onClick={() => setOpenMobile(false)}><Building2 />Accounts</MenuLinkItem>
            {model.account && <MenuLinkItem href={accountHref(model.account.id, 'account:summary')} closeOnClick onClick={() => setOpenMobile(false)}><Settings />Account settings</MenuLinkItem>}
          </MenuGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger><Moon />Theme</MenuSubTrigger>
            <MenuSubPopup className="min-w-32">
              <MenuRadioGroup value={theme} onValueChange={setTheme}>
                {[['light', 'Light', Sun], ['dark', 'Dark', Moon], ['system', 'System', Monitor]].map(([value, label, Icon]) => (
                  <MenuRadioItem key={value} value={value} closeOnClick>
                    <span className="flex items-center gap-2"><Icon aria-hidden="true" />{label}</span>
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuSubPopup>
          </MenuSub>
        </MenuPopup>
      </Menu>
    </SidebarMenuItem></SidebarMenu>
  );
}
