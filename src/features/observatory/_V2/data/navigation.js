import { Brain, SatelliteDish, Blocks, Users, Eye, ChartNoAxesCombined, Search, MessageCircle, Newspaper, Globe, ScanSearch } from '@/components/ui/icons';

// Mirrors observatorySurfaces.js and the account menu in AdminAppChrome.jsx.
export const directorySurfaces = [
  { id: 'accounts', label: 'Accounts', icon: Brain, detail: 'Customers and prospects you watch here. 3 accounts.', mobileDetail: '3 accounts.' },
  { id: 'reports', label: 'Reports', icon: SatelliteDish, detail: 'Published reports, shared links, and delivery checks.', mobileDetail: 'Reports and links.' },
  { id: 'people', label: 'People', icon: Users, detail: 'People with Account access, report recipients, and monitored people. 25 people.', mobileDetail: '25 people.' },
  { id: 'entities', label: 'Entities', icon: Blocks, detail: 'Accounts and watched entities in scope. 39 entities.', mobileDetail: '39 entities.' },
];
export const lensIcons = { ai: Eye, analytics: ChartNoAxesCombined, search: Search, social: MessageCircle, news: Newspaper, website: Globe, competitors: ScanSearch };
