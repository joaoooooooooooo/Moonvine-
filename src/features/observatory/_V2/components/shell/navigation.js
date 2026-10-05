import { LayoutGrid, SatelliteDish, Blocks, Network, Users, Brain, MessageCircle } from '@/components/ui/icons';

export const shellGroups = [
  { label: 'Console', items: [
    { label: 'Observatory', href: '#/console', icon: LayoutGrid, variant: 'success' },
    { label: 'Reports', href: '#/console/reports', icon: SatelliteDish, variant: 'info' },
    { label: 'Entities', href: '#/console/entities', icon: Blocks, variant: 'warning' },
    { label: 'Intelligence', href: '#/intelligence/client/canopy/current', icon: Brain },
  ] },
  { label: 'Administration', items: [
    { label: 'Accounts', href: '#/console/accounts', icon: Network },
    { label: 'People', href: '#/console/people', icon: Users },
  ] },
];

export const chatShellItem = { label: 'Chat', href: '#/chat/canopy/new', icon: MessageCircle };
export const shellItems = [...shellGroups.flatMap((group) => group.items), chatShellItem];

export function activeShellItem(route) {
  if (route.lensId === 'report:history') return shellItems.find((item) => item.label === 'Reports');
  return shellItems.find((item) => item.href === '#' + route.path) ?? shellItems[0];
}

