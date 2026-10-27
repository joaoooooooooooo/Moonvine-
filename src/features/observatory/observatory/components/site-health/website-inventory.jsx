import { Badge } from '@/components/ui/badge';
import { CardFrame } from '@/components/ui/card';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, FileText, FolderOpenIcon, FolderSimpleIcon, Globe } from '@/components/ui/icons';
import { getWebsiteInventory } from '../../data/site-fixes';

const groupDefinitions = [
  {
    id: 'top-level',
    label: 'Top-level pages',
    includes: (path) => path === '/' || path.split('/').filter(Boolean).length === 1,
  },
  {
    id: 'blog',
    label: 'Blog',
    includes: (path) => path.startsWith('/blog/'),
  },
  {
    id: 'jobs',
    label: 'Jobs',
    includes: (path) => path.startsWith('/jobs/'),
  },
];

function pageName(page, domain) {
  if (page.path === '/') return 'Home';
  const segment = page.path.split('/').filter(Boolean).at(-1) ?? domain;
  return segment.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function InventoryPage({ page, domain }) {
  const issueCount = page.issues.length;
  return <li>
    <a className="group/page flex min-h-10 items-center gap-2.5 rounded-md px-3 py-2 text-sm/normal outline-none hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring" href={page.url} target="_blank" rel="noreferrer">
      <FileText aria-hidden="true" className="size-5 shrink-0 text-muted-foreground group-hover/page:text-foreground" weight="regular" />
      <span className="min-w-0 truncate font-medium text-foreground">{pageName(page, domain)}</span>
      {issueCount > 0 && <Badge variant="warning">{issueCount} {issueCount === 1 ? 'issue' : 'issues'}</Badge>}
    </a>
  </li>;
}

function InventoryGroup({ group, domain }) {
  return <Collapsible defaultOpen className="border-b border-border/64 last:border-b-0">
    <CollapsibleTrigger className="group/folder flex min-h-12 w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
      <FolderSimpleIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground in-aria-expanded:hidden" weight="regular" />
      <FolderOpenIcon aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground in-aria-expanded:block" weight="regular" />
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm/normal font-medium text-foreground">{group.label}</span>
        <span className="shrink-0 text-xs/normal text-muted-foreground">{group.pages.length} {group.pages.length === 1 ? 'page' : 'pages'}</span>
      </span>
      <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform in-aria-expanded:rotate-180 motion-reduce:transition-none" />
    </CollapsibleTrigger>
    <CollapsiblePanel className="motion-reduce:transition-none">
      <ul className="ml-5 border-l border-border/64 pl-2 py-1">
        {group.pages.map((page) => <InventoryPage key={page.path} page={page} domain={domain} />)}
      </ul>
    </CollapsiblePanel>
  </Collapsible>;
}

export function WebsiteInventory({ account }) {
  const pages = getWebsiteInventory(account.domain);
  const groups = groupDefinitions.map((group) => ({
    ...group,
    pages: pages.filter((page) => group.includes(page.path)),
  })).filter((group) => group.pages.length > 0);

  return <section aria-labelledby="website-inventory-title" className="space-y-3">
    <div className="space-y-2">
      <h2 id="website-inventory-title" className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">{pages.some((page) => page.issues.length) ? 'Issues remain across your mapped pages.' : pages.length ? 'Your mapped pages have no recorded issues.' : 'No pages have been mapped yet.'}</h2>
      <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Browse the saved site tree and open any mapped page.</p>
    </div>
    <CardFrame className="w-full overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)]">
      <div className="relative flex h-10 w-full items-center gap-2.5 border-b border-border/64 px-4 text-muted-foreground">
        <Globe aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" weight="regular" />
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-sm/normal font-medium text-foreground">{account.domain}</span>
          <span className="shrink-0 text-xs/normal text-muted-foreground">{pages.length} pages</span>
        </span>
      </div>
      <div className="relative w-full bg-card">
        {groups.map((group) => <InventoryGroup key={group.id} group={group} domain={account.domain} />)}
      </div>
    </CardFrame>
  </section>;
}
