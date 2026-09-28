import { SiteStatCard } from './site-stat-card';
import { SiteCheckCard } from './site-check-card';
import { scoreDescriptions, siteChecks } from '../../data/site-health';
import '../signals-grid.css';

export function SiteHealth({ lens, account }) {
  return (
    <section aria-label="Website check summary" className="space-y-3">
      <div className="v2-signals-grid grid gap-3 items-stretch sm:grid-cols-2 xl:grid-cols-4">
        {lens.rows.map(([title, score]) => <SiteStatCard key={title} title={title} score={score} description={scoreDescriptions[title]} className="h-full max-w-none" />)}
      </div>
      <div className="v2-signals-grid grid gap-3 items-stretch sm:grid-cols-2 xl:grid-cols-4">
        {siteChecks(account.domain).map((check) => <SiteCheckCard key={check.title} {...check} />)}
      </div>
    </section>
  );
}
