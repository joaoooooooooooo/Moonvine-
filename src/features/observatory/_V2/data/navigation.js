import { Building2, Users, Shapes, FileText, Eye, ChartNoAxesCombined, Search, MessageCircle, Newspaper, Globe, ScanSearch } from 'lucide-react';

// Mirrors observatorySurfaces.js and the account menu in AdminAppChrome.jsx.
export const directorySurfaces = [
  { id: 'accounts', label: 'Accounts', icon: Building2, detail: 'Customers and prospects you watch here. 3 accounts.' },
  { id: 'reports', label: 'Reports', icon: FileText, detail: 'Published reports, shared links, and delivery checks.' },
  { id: 'people', label: 'People', icon: Users, detail: 'People with Account access, report recipients, and monitored people. 25 people.' },
  { id: 'entities', label: 'Entities', icon: Shapes, detail: 'Accounts and watched entities in scope. 39 entities.' },
];
export const lensIcons = { ai: Eye, analytics: ChartNoAxesCombined, search: Search, social: MessageCircle, news: Newspaper, website: Globe, competitors: ScanSearch };
