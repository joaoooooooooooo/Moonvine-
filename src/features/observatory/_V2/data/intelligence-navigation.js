import { LayoutGrid, Sparkles, Activity, ChartNoAxesCombined, Search, MessageCircle, Newspaper, Globe, ScanSearch, FileText, Plug } from '@/components/ui/icons';

export const intelligenceItems = [
  { label: 'Overview', lens: '', icon: LayoutGrid },
  { label: 'AI visibility', lens: 'insight:ai-visibility', icon: Sparkles },
  { label: 'Investor intelligence', lens: 'insight:investor', icon: Activity },
  { label: 'Google Analytics', lens: 'source:ga4', icon: ChartNoAxesCombined },
  { label: 'Google Search Console', lens: 'source:gsc', icon: Search },
  { label: 'Social media', lens: 'source:social', icon: MessageCircle },
  { label: 'News + media', lens: 'source:news', icon: Newspaper },
  { label: 'Site health', lens: 'source:site', icon: Globe },
  { label: 'Search competitors', lens: 'source:semrush', icon: ScanSearch },
  { label: 'Reports', lens: 'report:history', icon: FileText },
  { label: 'Connection status', lens: 'account:connections', icon: Plug },
];



