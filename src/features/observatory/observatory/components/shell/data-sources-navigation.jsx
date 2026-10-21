import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Plug, PlugConnected } from '@/components/ui/icons';
import { dataSourceSections } from '../../data/data-source-navigation';
import { SidebarTooltipContent } from './sidebar-tooltip-content';

export function DataSourcesNavigation({ route, onNavigate }) {
  return <SidebarGroup data-tour="sources"><SidebarMenu className="gap-1">
    {dataSourceSections.map((section) => <DataSourceItem key={section.id} section={section} route={route} onNavigate={onNavigate} />)}
  </SidebarMenu></SidebarGroup>;
}

function DataSourceItem({ section: { id, label, icon: Icon, connected }, route, onNavigate }) {
  const href = `#/console/data-sources/${id}`;
  const active = '#' + route.path === href;
  const hasStatus = typeof connected === 'boolean';
  const status = connected ? 'Connected' : 'No Source';
  const StatusIcon = connected ? PlugConnected : Plug;

  return <SidebarMenuItem>
    <SidebarMenuButton
      data-collapsed-status={hasStatus ? (connected ? 'success' : 'muted') : undefined}
      tooltip={{ children: <SidebarTooltipContent title={label} /> }}
      className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5"
      isActive={active}
      render={<a href={href} aria-label={hasStatus ? `${label}: ${status}` : label} aria-current={active ? 'page' : undefined} />}
      onClick={onNavigate}
    >
      <Icon aria-hidden="true" className="size-4.5" weight="fill" />
      <span className="min-w-0 truncate">{label}</span>
      {hasStatus && <span aria-hidden="true" className="ml-auto inline-flex shrink-0 items-center justify-end">
        <StatusIcon aria-hidden="true" className={`size-4 ${connected ? 'text-success-foreground' : 'text-muted-foreground'}`} weight="fill" />
      </span>}
      {hasStatus && <span className="sr-only">{status}</span>}
    </SidebarMenuButton>
  </SidebarMenuItem>;
}
