import { Building2, Users } from '@/components/ui/icons';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const items = [
  { label: 'Workspace', href: '#/console/accounts', icon: Building2 },
  { label: 'People', href: '#/console/people', icon: Users },
];

export function SettingsNavigation({ route, onNavigate }) {
  return <SidebarGroup><SidebarMenu className="gap-2">
    {items.map(({ label, href, icon: Icon }) => {
      const active = '#' + route.path === href;
      return <SidebarMenuItem key={href}>
        <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active}
          render={<a href={href} aria-current={active ? 'page' : undefined} />} onClick={onNavigate} tooltip={label}>
          <Icon aria-hidden="true" className="size-4.5" /><span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>;
    })}
  </SidebarMenu></SidebarGroup>;
}
