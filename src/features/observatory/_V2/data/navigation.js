import { Brain, SatelliteDish, Blocks, Users, Eye, ChartNoAxesCombined, Search, MessageCircle, Newspaper, Globe, ScanSearch } from '@/components/ui/icons';

// Mirrors observatorySurfaces.js and the account menu in AdminAppChrome.jsx.
export const directorySurfaces = [
  { id: 'accounts', label: 'Workspaces', icon: Brain, detail: 'Customers and prospects you watch here. 3 workspaces.', mobileDetail: '3 workspaces.' },
  { id: 'reports', label: 'Reports', icon: SatelliteDish, detail: 'Published reports, shared links, and delivery checks.', mobileDetail: 'Reports and links.' },
  { id: 'people', label: 'People', icon: Users, detail: 'People with workspace access, report recipients, and monitored people. 25 people.', mobileDetail: '25 people.' },
  { id: 'entities', label: 'Competitors', href: '#/console/data-sources/competitors', icon: Blocks, detail: 'Competitors tracked across your workspaces.', mobileDetail: 'Competitors across your workspaces.' },
];
export const lensIcons = { ai: Eye, analytics: ChartNoAxesCombined, search: Search, social: MessageCircle, news: Newspaper, website: Globe, competitors: ScanSearch };
