import { Building2, ShieldCheckIcon, Users } from '@/components/ui/icons';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const items = [
  { label: 'Workspace', href: '#/console/accounts', icon: Building2 },
  { label: 'People', href: '#/console/people', icon: Users },
  { label: 'Access', href: '#/console/data-sources/access', icon: ShieldCheckIcon },
];

export function SettingsNavigation({ route, onNavigate }) {
  return <SidebarGroup><SidebarMenu className="gap-2">
    {items.map(({ label, href, icon: Icon }) => {
      const active = '#' + route.path === href || (href === '#/console/people' && route.path.startsWith('/console/people/'));
      return <SidebarMenuItem key={href}>
        <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active}
          render={<a href={href} aria-current={active ? 'page' : undefined} />} onClick={onNavigate} tooltip={label}>
          <Icon aria-hidden="true" className="size-4.5" weight="fill" /><span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>;
    })}
  </SidebarMenu></SidebarGroup>;
}
