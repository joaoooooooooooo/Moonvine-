import { SignalCard } from './signal-card';
import { SourcePresenceCard } from './source-presence-card';
import './signals-grid.css';

export function SignalsGrid({ account, lenses }) {
  return (
    <section aria-label="Signals" className="space-y-3">
      <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lenses.map((lens) => <SignalCard key={lens.sourceId} accountId={account.id} lens={lens} />)}
        <SourcePresenceCard account={account} />
      </div>
    </section>
  );
}
