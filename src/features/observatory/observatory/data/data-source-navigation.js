import { Building2, Network, Link2, Newspaper, MessageCircle, ChartNoAxesCombined, Layers2Icon } from '@/components/ui/icons';

export const dataSourceSections = [
  { id: 'domains', label: 'Domains', icon: Building2, connected: false },
  { id: 'competitors', label: 'Competitors', icon: Network, connected: true },
  { id: 'social-accounts', label: 'Social accounts', icon: Link2, connected: true },
  { id: 'news-keywords', label: 'News keywords', icon: Newspaper, connected: false },
  { id: 'prompts', label: 'Prompts', icon: MessageCircle },
  { id: 'first-party-data', label: 'First-party data', icon: ChartNoAxesCombined, connected: false },
  { id: 'index', label: 'Index', icon: Layers2Icon, connected: false },
];

export function workspaceSourceSections(workspace) {
  const connected = {
    domains: Boolean(workspace?.domain),
    competitors: Boolean(workspace?.competitors?.length),
    'social-accounts': Boolean(workspace?.socialAccounts?.length),
    'news-keywords': Boolean(workspace?.newsKeywords?.length),
    'first-party-data': Object.values(workspace?.firstPartyConnections ?? {}).some(Boolean),
    index: Boolean(workspace?.moonvineIndexEnabled),
  };
  return dataSourceSections.map((section) => section.id in connected ? { ...section, connected: connected[section.id] } : section);
}
export function connectedSourceCount(workspace) {
  return workspaceSourceSections(workspace).filter((section) => section.connected).length;
}
