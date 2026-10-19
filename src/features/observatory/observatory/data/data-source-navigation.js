import { Building2, Network, Link2, Newspaper, MessageCircle, ChartNoAxesCombined, Layers2Icon } from '@/components/ui/icons';

export const dataSourceSections = [
  { id: 'organization', label: 'Organization', icon: Building2, connected: false },
  { id: 'competitors', label: 'Competitors', icon: Network, connected: true },
  { id: 'social-accounts', label: 'Social accounts', icon: Link2, connected: true },
  { id: 'news-keywords', label: 'News keywords', icon: Newspaper, connected: false },
  { id: 'prompts', label: 'Prompts', icon: MessageCircle },
  { id: 'first-party-data', label: 'First-party data', icon: ChartNoAxesCombined, connected: false },
  { id: 'index', label: 'Index', icon: Layers2Icon, connected: false },
];
