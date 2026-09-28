import { LayoutGrid, SatelliteDish, Blocks, Network, Users } from 'lucide-react';

export const shellGroups = [
  { label: 'Console', items: [
    { label: 'Observatory', href: '#/console', icon: LayoutGrid, variant: 'success' },
    { label: 'Reports', href: '#/console/reports', icon: SatelliteDish, variant: 'info' },
    { label: 'Entities', href: '#/console/entities', icon: Blocks, variant: 'warning' },
  ] },
  { label: 'Administration', items: [
    { label: 'Accounts', href: '#/console/accounts', icon: Network },
    { label: 'People', href: '#/console/people', icon: Users },
  ] },
];

export const shellItems = shellGroups.flatMap((group) => group.items);

export function activeShellItem(route) {
  if (route.lensId === 'report:history') return shellItems.find((item) => item.label === 'Reports');
  return shellItems.find((item) => item.href === '#' + route.path) ?? shellItems[0];
}
