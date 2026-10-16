import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Plug, PlugConnected } from '@/components/ui/icons';
import { dataSourceSections } from '../../data/data-source-navigation';

export function DataSourcesNavigation({ route, onNavigate }) {
  return <SidebarGroup><SidebarMenu className="gap-2">
    {dataSourceSections.map((section) => <DataSourceItem key={section.id} section={section} route={route} onNavigate={onNavigate} />)}
  </SidebarMenu></SidebarGroup>;
}

function DataSourceItem({ section: { id, label, icon: Icon, connected }, route, onNavigate }) {
  const statusRef = useRef(null);
  const labelRef = useRef(null);
  const badgeRef = useRef(null);
  const [badgePosition, setBadgePosition] = useState(null);
  const href = `#/console/data-sources/${id}`;
  const active = '#' + route.path === href;
  const hasStatus = typeof connected === 'boolean';
  const status = connected ? 'Connected' : 'No Source';
  const StatusIcon = connected ? PlugConnected : Plug;
  const badgeVariant = connected ? 'info' : 'secondary';
  function showBadge() {
    if (!hasStatus || !statusRef.current) return;
    const rect = statusRef.current.getBoundingClientRect();
    const row = statusRef.current.closest('[data-sidebar="menu-item"]').getBoundingClientRect();
    setBadgePosition({ left: row.right - 4, top: rect.top + rect.height / 2, minLeft: row.left, right: row.right - 4 });
  }
  function hideBadge() {
    setBadgePosition(null);
  }
  useLayoutEffect(() => {
    if (!badgePosition || !badgeRef.current || !labelRef.current) return;
    const width = badgeRef.current.getBoundingClientRect().width;
    const left = Math.max(badgePosition.minLeft, badgePosition.right - width);
    const labelRect = labelRef.current.getBoundingClientRect();
    const overlapsLabel = left < labelRect.right && badgePosition.right > labelRect.left;
    const fadePoint = Math.max(0, left - labelRect.left);
    const mask = overlapsLabel
      ? `linear-gradient(to right, black 0px, black ${Math.max(0, fadePoint - 16)}px, transparent ${Math.min(labelRect.width, fadePoint + 8)}px)`
      : null;
    if (left !== badgePosition.left || mask !== badgePosition.mask) setBadgePosition({ ...badgePosition, left, mask });
  }, [badgePosition]);
  useEffect(() => {
    window.addEventListener('scroll', hideBadge, true);
    window.addEventListener('resize', hideBadge);
    return () => {
      window.removeEventListener('scroll', hideBadge, true);
      window.removeEventListener('resize', hideBadge);
    };
  }, []);
  const button = <SidebarMenuButton className="h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5" isActive={active}
    render={<a href={href} aria-current={active ? 'page' : undefined} />} onClick={onNavigate}>
    <Icon aria-hidden="true" className="size-4.5" weight="fill" /><span ref={labelRef} className="min-w-0 truncate"
      style={badgePosition?.mask ? { maskImage: badgePosition.mask, WebkitMaskImage: badgePosition.mask } : undefined}>{label}</span>
    {hasStatus && <span ref={statusRef} aria-hidden="true" className="ml-auto inline-flex shrink-0">
      <Badge variant={badgeVariant} size="lg" className={connected ? '[&_svg]:opacity-100' : 'text-muted-foreground [&_svg]:opacity-100'}>
        <StatusIcon aria-hidden="true" weight="fill" />
      </Badge>
    </span>}
    {hasStatus && <span className="sr-only">{status}</span>}
  </SidebarMenuButton>;

  return <SidebarMenuItem onMouseEnter={showBadge} onMouseLeave={hideBadge} onFocus={showBadge} onBlur={hideBadge}
    onKeyDown={(event) => { if (event.key === 'Escape') hideBadge(); }}>
    {button}
    {badgePosition && createPortal(
      <span ref={badgeRef} aria-hidden="true" className="pointer-events-none fixed z-50 inline-flex -translate-y-1/2 rounded-sm bg-popover"
        style={{ left: badgePosition.left, top: badgePosition.top, maxWidth: badgePosition.right - badgePosition.minLeft }}>
        <Badge variant={badgeVariant} size="lg" className={connected ? '[&_svg]:opacity-100' : 'text-muted-foreground [&_svg]:opacity-100'}><StatusIcon aria-hidden="true" weight="fill" />{status}</Badge>
      </span>, document.body,
    )}
  </SidebarMenuItem>;
}
