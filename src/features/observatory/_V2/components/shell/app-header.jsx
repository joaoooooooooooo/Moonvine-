import { SidebarTrigger } from '@/components/ui/sidebar';
import { LiveBreadcrumbs } from '../live-breadcrumbs';
import { activeShellItem } from './navigation';

export function AppHeader({ model }) {
  const item = activeShellItem(model.route);
  const detail = model.route.lensId === 'account:summary' ? 'Org profile' : model.route.lensId === 'report:history' ? 'Report history' : model.lens?.label;
  const title = model.account ? detail : item.label;
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-card px-5 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl min-w-0 items-center gap-2">
        <SidebarTrigger className="md:hidden" aria-label="Open navigation" />
        <LiveBreadcrumbs account={model.account} accounts={model.accounts} route={model.route} current={title} />
      </div>
    </header>
  );
}
