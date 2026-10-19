import { FileText } from '@/components/ui/icons';
import { ObservatoryCollapsibleTable } from '../observatory-collapsible-table';
import { getFixableWebsiteIssues } from '../../data/site-fixes';
import { siteHealthAreaIcons } from './site-health-areas';

const issueColumns = [
  {
    id: 'issue',
    header: 'Issue',
    cellClassName: 'h-auto! py-3.5!',
    render: (issue) => <span className="inline-flex items-center gap-2 text-sm/normal font-medium text-foreground"><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-warning-foreground" />{issue.title}</span>,
  },
  {
    id: 'area',
    header: 'Area',
    render: (issue) => {
      const AreaIcon = siteHealthAreaIcons[issue.area];
      return <span className="inline-flex items-center gap-2 text-muted-foreground"><AreaIcon aria-hidden="true" className="size-4 shrink-0" weight="regular" />{issue.area}</span>;
    },
  },
  {
    id: 'impact',
    header: 'Expected impact',
    render: (issue) => issue.expectedImpact,
  },
  {
    id: 'occurrences',
    header: 'Occurrences',
    cellClassName: 'h-auto! py-3.5! whitespace-nowrap',
    render: (issue) => <span className="flex items-center gap-2 whitespace-nowrap"><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-warning-foreground" /><span>{issue.occurrenceCount} {issue.occurrenceCount === 1 ? 'occurrence' : 'occurrences'}</span></span>,
  },
];

function IssueExplanation({ issue }) {
  const explanations = [
    ['What is this?', issue.what],
    ['Why is it happening?', issue.why],
    ['What can fix it?', issue.fix],
  ];
  return <div className="space-y-5">
    <dl className="grid gap-5 md:grid-cols-3">
      {explanations.map(([label, value]) => <div key={label} className="space-y-2">
        <dt className="text-xs/normal font-medium text-muted-foreground">{label}</dt>
        <dd className="w-full max-w-[32ch] text-sm/normal text-foreground">{value}</dd>
      </div>)}
    </dl>
    {issue.showAffectedPages && <div className="space-y-3 border-t border-border/64 pt-4">
      <h3 className="text-sm/normal font-medium text-foreground">Affected pages</h3>
      <ul className="divide-y divide-border/64">
        {issue.affectedPages.map((page) => <li key={page.path}>
          <a className="-mx-2.5 flex min-h-9 items-center gap-2 rounded-md px-2.5 py-2 text-sm/normal text-foreground outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring" href={page.url} target="_blank" rel="noreferrer"><FileText aria-hidden="true" className="size-4 shrink-0" weight="regular" /><span className="min-w-0 truncate">{page.label}</span></a>
        </li>)}
      </ul>
    </div>}
  </div>;
}

export function FixableWebsiteIssues({ account }) {
  const issues = getFixableWebsiteIssues(account.domain);
  return <section aria-label="Fixable website issues">
    <ObservatoryCollapsibleTable
      columns={issueColumns}
      getRowId={(issue) => issue.id}
      getRowLabel={(issue) => issue.title}
      label="Fixable website issues"
      renderDetails={(issue) => <IssueExplanation issue={issue} />}
      rows={issues}
      toolbar={<div className="space-y-2">
        <h2 className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">Fixable website issues</h2>
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Saved issue types from the latest website checks.</p>
      </div>}
    />
  </section>;
}
