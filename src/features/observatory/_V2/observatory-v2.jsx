import { Agentation } from 'agentation';
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

export function ObservatoryV2() {
  const model = useObservatory();
  const { route, account, lens } = model;
  const selectedWorkspace = model.accounts.find((item) => item.id === model.selectedAccountId) ?? model.accounts[0];
  const personPathMatch = route.path.match(/^\/console\/people\/([^/]+)$/);
  const personId = route.personId ?? (personPathMatch ? decodeURIComponent(personPathMatch[1]) : null);
  const directory = ['accounts', 'people', 'entities'].find((id) => route.path === '/console/' + id);
  let page;
  if (route.path === '/console' && account && route.threadId) page = <IntelligenceChatPage key={account.id + route.threadId} model={model} />;
  else if (route.path === '/console') page = <ObservatoryHome />;
  else if (personId) page = <PersonDetailPage personId={personId} workspaces={model.accounts} />;
  else if (route.path.startsWith('/console/data-sources')) page = <DataSourcesPage sectionId={route.path.split('/')[3]} workspace={selectedWorkspace} onSaveWorkspace={model.saveWorkspaceProfile} />;
  else if (directory) page = <DirectoryPage key={directory} type={directory} workspaces={model.accounts} />;
  else if (route.path === '/console/reports') page = <ReportHistory key={account?.id ?? 'all-reports'} account={account} />;
  else if (account && route.lensId === 'account:summary') page = <AccountProfile key={account.id} model={model} />;
  else if (account && route.lensId === 'report:history') page = <ReportHistory key={account.id} account={account} />;
  else if (account && route.lensId === 'intelligence:chat') page = <IntelligenceChatPage key={account.id + (route.threadId || 'new')} model={model} />;
  else if (account && ['insight:investor', 'account:connections'].includes(route.lensId)) page = <IntelligenceEmptyPage connections={route.lensId === 'account:connections'} />;
  else if (account && lens) page = <SourceDetail model={model} />;
  else if (account && !route.lensId) page = <AccountWorkspace model={model} />;
  else page = <div className="space-y-3"><h1 className="text-xl font-semibold">Page not found</h1><a href="#/console" className="underline">Return to Observatory</a></div>;

  return (
    <ToastProvider bottomOffset="14.75rem">
      <div className="min-h-dvh bg-background font-sans text-foreground antialiased" data-observatory-live-recreation>
        <AppShell model={model}>
          {page}
        </AppShell>
        {import.meta.env.DEV && <Agentation />}
      </div>
    </ToastProvider>
  );
}
