import { ObservatoryDirectoryCard } from './observatory-directory-card';
import { directorySurfaces } from '../data/navigation';
import { PageHeading } from './page-heading';
import './signals-grid.css';

export function ObservatoryHome() {
  return (
    <div className="v2-page-sections">
      <PageHeading title="Welcome back to Observatory." />
      <nav aria-label="Observatory directory" className="space-y-3">
        <div className="v2-signals-grid grid max-w-2xl grid-cols-2 gap-3">
        {directorySurfaces.map((surface) => (
          <ObservatoryDirectoryCard
            key={surface.id}
            {...surface}
            label={surface.id === 'accounts' ? 'Intelligence' : surface.label}
            href={surface.id === 'accounts' ? '#/intelligence/client/canopy/current' : surface.href}
          />
        ))}
        </div>
      </nav>
    </div>
  );
}


