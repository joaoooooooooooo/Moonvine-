import { SiteStatCard } from './site-stat-card';
import { Badge } from '@/components/ui/badge';
import { CircleAlertIcon, CircleCheckIcon } from '@/components/ui/icons';
import { aiReadinessScore, scoreDescriptions, siteChecks } from '../../data/site-health';
import { ObservatoryCollapsibleTable } from '../observatory-collapsible-table';
import { siteHealthAreaIcons } from './site-health-areas';
import '../signals-grid.css';

const statuses = {
  missing: { label: 'Not detected', variant: 'secondary', icon: CircleAlertIcon, className: 'text-muted-foreground' },
  warning: { label: 'Needs attention', variant: 'warning', icon: CircleAlertIcon },
  good: { label: 'Good shape', variant: 'success', icon: CircleCheckIcon },
};

const scoreComparisons = {
  Performance: { change: '-3 pts', negative: true },
  Accessibility: { change: '+2 pts' },
  'Best Practices': { change: '+1 pt' },
  SEO: { change: '+4 pts' },
  'AI readiness': { change: '+6 pts' },
};

const auditColumns = [
  {
    id: 'audit',
    header: 'Audit',
    render: (check) => <span className="font-medium text-foreground">{check.title}</span>,
  },
  {
    id: 'area',
    header: 'Area',
    headerClassName: 'hidden md:table-cell',
    cellClassName: 'hidden md:table-cell',
    render: (check) => {
      const AreaIcon = siteHealthAreaIcons[check.area];
      return <span className="inline-flex items-center gap-2 text-muted-foreground"><AreaIcon aria-hidden="true" className="size-4 shrink-0" weight="regular" />{check.area}</span>;
    },
  },
  {
    id: 'impact',
    header: 'Expected impact',
    headerClassName: 'hidden md:table-cell',
    cellClassName: 'hidden text-foreground md:table-cell',
    render: (check) => check.status === 'good' ? <span className="text-muted-foreground">-</span> : check.impact,
  },
  {
    id: 'status',
    header: 'Status',
    render: (check) => {
      const currentStatus = statuses[check.status] ?? statuses.missing;
      const StatusIcon = currentStatus.icon;
      return <Badge className={currentStatus.className} size="lg" variant={currentStatus.variant}><StatusIcon aria-hidden="true" />{currentStatus.label}</Badge>;
    },
  },
];

export function SiteHealth({ lens, account }) {
  return (
    <section aria-label="Website check summary" className="space-y-3">
      <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lens.rows.map(([title, score]) => <SiteStatCard key={title} title={title} icon={siteHealthAreaIcons[title]} score={score} description={scoreDescriptions[title]} change={scoreComparisons[title]?.change} negative={scoreComparisons[title]?.negative} className="h-full max-w-none" />)}
        <SiteStatCard title="AI readiness" icon={siteHealthAreaIcons['AI readiness']} score={aiReadinessScore(account.domain)} description={scoreDescriptions['AI readiness']} change={scoreComparisons['AI readiness'].change} className="h-full max-w-none" />
      </div>
      <ObservatoryCollapsibleTable
        columns={auditColumns}
        getRowId={(check) => check.title}
        getRowLabel={(check) => check.title}
        label="Site checks"
        renderDetails={(check) => <p className="w-full max-w-[48ch] text-sm/normal text-muted-foreground [overflow-wrap:anywhere] [text-wrap:pretty] md:w-1/4 md:max-w-none">{check.description}</p>}
        rows={siteChecks(account.domain)}
      />
    </section>
  );
}
