import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpenIcon, CreditCardIcon, LifeBuoyIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon } from '@/components/ui/icons';
import { Menu, MenuCheckboxItem, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuPopup, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference';

export function FooterUserMenu() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { resolvedTheme, setTheme } = useThemePreference();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger render={<SidebarMenuButton className="h-10" aria-label="Open account menu" />}>
            <Avatar className="size-6"><AvatarFallback>A</AvatarFallback></Avatar>
            <span className="min-w-0 flex-1 truncate text-left font-medium">Apta</span>
          </MenuTrigger>
          <MenuPopup align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={8} className="min-w-52">
            <MenuGroup>
              <MenuGroupLabel>Account</MenuGroupLabel>
              <MenuLinkItem href="#/console/accounts" onClick={() => setOpenMobile(false)}>
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
            <MenuCheckboxItem variant="switch" checked={resolvedTheme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}>
              <span className="flex items-center gap-2">{resolvedTheme === 'dark' ? <MoonIcon aria-hidden="true" className="size-4" /> : <SunIcon aria-hidden="true" className="size-4" />}Dark mode</span>
            </MenuCheckboxItem>
            <MenuSeparator />
            <MenuItem variant="destructive" closeOnClick><LogOutIcon aria-hidden="true" />Log out</MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
