import { SignalCard } from './signal-card';
import { SearchClicksChart } from './search-clicks-chart';
import { SiteStatCard } from './site-health/site-stat-card';
import { SourcePresenceCard } from './source-presence-card';
import { scoreDescriptions } from '../data/site-health';
import { searchClicksSeries } from '../utils/search-clicks-series';
import { accountHref } from '../utils/observatory-model';
import './signals-grid.css';

export function SignalsGrid({ account, lenses }) {
  const search = lenses.find((lens) => lens.id === 'search');
  const website = lenses.find((lens) => lens.id === 'website');
  return (
    <section aria-label="Signals" className="space-y-3">
      <div className="v2-signals-grid grid gap-3 items-stretch sm:grid-cols-2 xl:grid-cols-5">
        {lenses.filter((lens) => lens.id !== 'search' && lens.id !== 'website').map((lens) => <SignalCard key={lens.sourceId} accountId={account.id} lens={lens} />)}
      </div>
      <div className="v2-signals-grid grid gap-3 items-stretch sm:grid-cols-2 xl:grid-cols-4">
        {search && <SearchClicksChart hideAxes className="min-w-0 sm:col-span-2" data={searchClicksSeries(search)} href={accountHref(account.id, search.sourceId)} />}
        {website && <SiteStatCard variant="full" className="h-full min-w-0 max-w-none" chartClassName="max-w-[24rem] self-center" title="Performance" description={scoreDescriptions.Performance} score={website.value} metric={website.metric} change={`${website.delta > 0 ? '+' : ''}${website.delta} pts`} negative={website.delta < 0} href={accountHref(account.id, website.sourceId)} />}
        <SourcePresenceCard account={account} />
      </div>
    </section>
  );
}
