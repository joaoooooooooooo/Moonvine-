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
      <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lenses.filter((lens) => lens.id !== 'search' && lens.id !== 'website').map((lens) => <SignalCard key={lens.sourceId} accountId={account.id} lens={lens} />)}
      </div>
      <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {search && <SearchClicksChart hideAxes className="min-w-0 sm:col-span-2 lg:col-span-6" data={searchClicksSeries(search)} href={accountHref(account.id, search.sourceId)} />}
        {website && <SiteStatCard variant="full" className="h-full min-w-0 max-w-none lg:col-span-3" chartClassName="max-w-[24rem] self-center" title="Performance" description={scoreDescriptions.Performance} score={website.value} metric={website.metric} change={`${website.delta > 0 ? '+' : ''}${website.delta} pts`} negative={website.delta < 0} href={accountHref(account.id, website.sourceId)} />}
        <SourcePresenceCard account={account} className="lg:col-span-3" />
      </div>
    </section>
  );
}
