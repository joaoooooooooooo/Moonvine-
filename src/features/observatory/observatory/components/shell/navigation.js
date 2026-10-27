import { LayoutGrid, SatelliteDish, Brain, MessageCircle, Settings, Plug, BookmarkIcon } from '@/components/ui/icons';

export const shellGroups = [
  { label: 'Console', items: [
    { label: 'Observatory', href: '#/console', icon: LayoutGrid, variant: 'success' },
    { label: 'Reports', href: '#/console/reports', icon: SatelliteDish, variant: 'info' },
    { label: 'Intelligence', href: '#/intelligence/client/canopy/current', icon: Brain },
    { label: 'Data Sources', href: '#/console/data-sources/domains', icon: Plug },
    { label: 'Bookmarks', href: '#/console/bookmarks', icon: BookmarkIcon },
  ] },
  { label: 'Administration', items: [
    { label: 'Settings', href: '#/console/accounts', icon: Settings },
  ] },
];

export const chatShellItem = { label: 'Chat', href: '#/console', icon: MessageCircle };
export const shellItems = [...shellGroups.flatMap((group) => group.items), chatShellItem];

export function activeShellItem(route) {
  if (route.lensId === 'intelligence:chat' && route.threadId) return chatShellItem;
  if (route.path.startsWith('/console/bookmarks')) return shellItems.find((item) => item.label === 'Bookmarks');
  if (route.path === '/console/your-account' || route.path === '/console/accounts' || route.path.startsWith('/console/people') || route.path === '/console/data-sources/access') return shellItems.find((item) => item.label === 'Settings');
  if (route.path.startsWith('/console/data-sources')) return shellItems.find((item) => item.label === 'Data Sources');
  if (route.lensId === 'report:history') return shellItems.find((item) => item.label === 'Reports');
  return shellItems.find((item) => item.href === '#' + route.path) ?? shellItems[0];
}

