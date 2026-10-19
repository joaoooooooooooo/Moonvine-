import { Agentation } from 'agentation';
import { createPortal } from 'react-dom';
import { SetupProgressCard } from './components/shell/setup-progress-card';
import { useObservatory } from './hooks/use-observatory';
import { AppShell } from './components/shell/app-shell';
import { ObservatoryHome } from './components/observatory-home';
import { AccountWorkspace } from './components/account-workspace';
import { DirectoryPage } from './components/directory-page';
import { SourceDetail } from './components/source-detail';
import { AccountProfile } from './components/account-profile';
import { ReportHistory } from './components/report-history';
import { IntelligenceEmptyPage } from './components/intelligence-empty-page';
import { IntelligenceChatPage } from './components/intelligence-chat/intelligence-chat-page';
import { DataSourcesPage } from './components/data-sources-page';
import { PersonDetailPage } from './components/person-detail-page';
import { ToastProvider } from '@/components/ui/toast';
import { NewsMediaPage } from './components/news-media/news-media-page';
import { AnalyticsV2Page } from './components/analytics-v2/analytics-v2-page';
import { BookmarksPage } from './components/bookmarks-page';

export function Observatory() {
  const model = useObservatory();
  const { route, account, lens } = model;
  const selectedWorkspace = model.accounts.find((item) => item.id === model.selectedAccountId) ?? model.accounts[0];
  const personPathMatch = route.path.match(/^\/console\/people\/([^/]+)$/);
  const personId = route.personId ?? (personPathMatch ? decodeURIComponent(personPathMatch[1]) : null);
  const bookmarkWorkspaceId = route.path.match(/^\/console\/bookmarks\/([^/]+)$/)?.[1] ?? null;
  const directory = ['accounts', 'people', 'entities'].find((id) => route.path === '/console/' + id);
  let page;
  if (route.path.startsWith('/console/bookmarks')) page = <BookmarksPage model={model} workspaceId={bookmarkWorkspaceId} />;
  else if (route.path === '/console' && account && route.threadId) page = <IntelligenceChatPage key={account.id + route.threadId} model={model} />;
  else if (route.path === '/console') page = <ObservatoryHome model={model} />;
  else if (personId) page = <PersonDetailPage personId={personId} workspaces={model.accounts} />;
  else if (route.path.startsWith('/console/data-sources')) page = <DataSourcesPage sectionId={route.path.split('/')[3]} workspace={selectedWorkspace} onSaveWorkspace={model.saveWorkspaceProfile} />;
  else if (directory) page = <DirectoryPage key={directory} type={directory} workspaces={model.accounts} />;
  else if (route.path === '/console/reports') page = <ReportHistory key={account?.id ?? 'all-reports'} account={account} />;
  else if (account && route.lensId === 'account:summary') page = <AccountProfile key={account.id} model={model} />;
  else if (account && route.lensId === 'report:history') page = <ReportHistory key={account.id} account={account} />;
  else if (account && route.lensId === 'intelligence:chat') page = <IntelligenceChatPage key={account.id + (route.threadId || 'new')} model={model} />;
  else if (account && ['insight:investor', 'account:connections'].includes(route.lensId)) page = <IntelligenceEmptyPage connections={route.lensId === 'account:connections'} />;
  else if (account && route.lensId === 'source:news-media') page = <NewsMediaPage account={account} period={route.period} />;
  else if (account && route.lensId === 'source:ga4-2') page = <AnalyticsV2Page account={account} period={route.period} lens={model.lenses.find((item) => item.id === 'analytics')} />;
  else if (account && lens) page = <SourceDetail model={model} />;
  else if (account && !route.lensId) page = <AccountWorkspace model={model} />;
  else page = <div className="space-y-3"><h1 className="text-xl font-semibold">Page not found</h1><a href="#/console" className="underline">Return to Observatory</a></div>;

  return (
    <ToastProvider bottomOffset="14.75rem">
      <div className="min-h-dvh bg-background font-sans text-foreground antialiased" data-observatory-live-recreation>
        <AppShell model={model}>
          {page}
        </AppShell>
        {createPortal(<div data-slot="setup-overlay" className="fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-72 font-sans text-foreground"><SetupProgressCard /></div>, document.body)}
        {import.meta.env.DEV && <Agentation />}
      </div>
    </ToastProvider>
  );
}
