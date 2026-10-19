import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { LiveBreadcrumbs } from '../live-breadcrumbs';
import { activeShellItem } from './navigation';
import { intelligenceItems } from '../../data/intelligence-navigation';
import { findDirectoryPerson } from '../../data/directory-rows';
import { dataSourceSections } from '../../data/data-source-navigation';
import { Brain, Building2, LayoutGrid, MessageCircle, Plug, PlugConnected, SatelliteDish, Settings, Users, BookmarkIcon, FolderIcon } from '@/components/ui/icons';
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AppHeader({ model }) {
  const { open: sidebarOpen } = useSidebar();
  const isChatPage = model.route.lensId === 'intelligence:chat';
  const isIntelligencePage = model.route.path.startsWith('/intelligence/') || model.route.lensId?.startsWith('intelligence:');
  const isHomeChat = model.route.path === '/console' && !isChatPage;
  const item = activeShellItem(model.route);
  const dataSourceLabels = {
    organization: 'Organization',
    competitors: 'Competitors',
    'social-accounts': 'Social accounts',
    'news-keywords': 'News keywords',
    prompts: 'Prompts',
    'first-party-data': 'First-party data',
    index: 'Index',
    access: 'Access',
  };
  const isDataSource = model.route.path.startsWith('/console/data-sources');
  const isBookmarks = model.route.path.startsWith('/console/bookmarks');
  const bookmarkId = model.route.path.match(/^\/console\/bookmarks\/([^/]+)$/)?.[1];
  const bookmarkNames = { inspiration: 'Inspiration', 'content-ideas': 'Content ideas' };
  const dataSourceSection = model.route.path.split('/')[3];
  const detail = model.route.lensId === 'intelligence:chat' ? model.account?.name : model.route.lensId === 'account:summary' ? 'Org profile' : model.route.lensId === 'report:history' ? 'Report history' : model.lens?.label;
  const isPerson = model.route.path.startsWith('/console/people/');
  const personPathMatch = isPerson ? model.route.path.match(/^\/console\/people\/([^/]+)$/) : null;
  const personId = model.route.personId ?? (personPathMatch ? decodeURIComponent(personPathMatch[1]) : null);
  const person = personId ? findDirectoryPerson(personId, model.accounts) : null;
  const title = isBookmarks ? (bookmarkNames[bookmarkId] ?? 'Bookmarks') : isDataSource ? dataSourceLabels[dataSourceSection] ?? 'Organization' : isPerson ? person?.name ?? 'Person' : model.route.path === '/console/people' ? 'People' : model.route.path === '/console/accounts' ? 'Workspaces' : model.route.path === '/console/reports' ? item.label : model.account ? detail ?? intelligenceItems.find((entry) => entry.lens === (model.route.lensId ?? ''))?.label : item.label;
  const root = model.route.lensId === 'intelligence:chat' && model.route.path !== '/console'
    ? { label: 'Chat', icon: MessageCircle }
    : model.route.path.startsWith('/intelligence/')
      ? { label: 'Intelligence', icon: Brain }
      : { label: 'Observatory', icon: LayoutGrid };
  const source = dataSourceSections.find((section) => section.id === dataSourceSection);
  const parent = isBookmarks && bookmarkId
    ? { label: 'Bookmarks', icon: BookmarkIcon }
    : dataSourceSection === 'access'
    ? { label: 'Settings', icon: Settings }
    : isDataSource
      ? { label: 'Data Sources', icon: Plug }
      : isPerson
        ? { label: 'People', icon: Users }
        : null;
  const currentIcon = isBookmarks && bookmarkId ? FolderIcon : isBookmarks ? BookmarkIcon : isDataSource ? source?.icon ?? Building2 : isPerson || model.route.path === '/console/people' ? Users : model.route.path === '/console/accounts' ? Building2 : model.route.path === '/console/reports' || model.route.lensId === 'report:history' ? SatelliteDish : model.route.path.startsWith('/intelligence/') ? intelligenceItems.find((entry) => entry.lens === model.route.lensId)?.icon ?? Brain : root.icon;
  const breadcrumbs = title === root.label ? [root] : [root, ...(parent ? [parent] : []), { label: title, icon: currentIcon }];
  return (
    <header className="sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-5 py-2 sm:h-16 md:px-8">
      <TooltipProvider delay={150} timeout={500}>
        <Tooltip>
          <TooltipTrigger render={<SidebarTrigger className="hidden md:absolute md:start-4 md:top-1/2 md:inline-flex md:-translate-y-1/2" aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} aria-controls="observatory-sidebar" aria-expanded={sidebarOpen} />} />
          <TooltipPopup side="bottom" sideOffset={8}>{sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}</TooltipPopup>
        </Tooltip>
      </TooltipProvider>
      <div className={`mx-auto flex w-full ${isChatPage || isHomeChat ? 'max-w-5xl' : isIntelligencePage ? 'max-w-6xl' : 'max-w-7xl'} min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap`}>
        <SidebarTrigger className="md:hidden" aria-label="Open navigation" />
        <LiveBreadcrumbs items={breadcrumbs} />
        {isDataSource && typeof source?.connected === 'boolean' && <Badge variant={source.connected ? 'success' : 'secondary'} size="lg" className={source.connected ? undefined : 'text-muted-foreground'}>
          {source.connected ? <PlugConnected aria-hidden="true" weight="fill" /> : <Plug aria-hidden="true" weight="fill" />}
          {source.connected ? 'Connected' : 'No Source'}
        </Badge>}
      </div>
    </header>
  );
}

