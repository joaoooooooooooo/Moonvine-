import { SidebarTrigger } from '@/components/ui/sidebar';
import { LiveBreadcrumbs } from '../live-breadcrumbs';
import { activeShellItem } from './navigation';
import { intelligenceItems } from '../../data/intelligence-navigation';
import { ClientPeriodSwitcher } from '../client-period-switcher';

export function AppHeader({ model }) {
  const item = activeShellItem(model.route);
  const detail = model.route.lensId === 'intelligence:chat' ? model.account?.name : model.route.lensId === 'account:summary' ? 'Org profile' : model.route.lensId === 'report:history' ? 'Report history' : model.lens?.label;
  const title = model.account ? detail ?? intelligenceItems.find((entry) => entry.lens === (model.route.lensId ?? ''))?.label : item.label;
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center justify-between gap-2 border-b bg-card px-5 py-2 sm:h-14 sm:py-0 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
        <SidebarTrigger className="md:hidden" aria-label="Open navigation" />
        <LiveBreadcrumbs account={model.account} accounts={model.accounts} route={model.route} current={title} />
        {model.account && <div className="ml-auto w-full min-w-0 sm:w-auto"><ClientPeriodSwitcher account={model.account} accounts={model.accounts} route={model.route} /></div>}
      </div>
    </header>
  );
}

