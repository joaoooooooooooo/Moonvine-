import { ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible';
import { FramePanel } from '@/components/ui/frame';
import { TableRow, TableCell } from '@/components/ui/table';

export function PageFixRow({ page }) {
  const warnings = page.issues.filter((issue) => issue.severity === 'warning').length;
  return (
    <TableRow>
      <TableCell className="whitespace-normal p-0!">
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-4 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            <span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <span className="min-w-0 flex-1 basis-48">
                <span className="block break-words text-sm font-medium leading-5">{page.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <Badge variant="outline">{page.issues.length} {page.issues.length === 1 ? 'issue' : 'issues'}</Badge>
                {warnings > 0 && <Badge variant="warning">{warnings} {warnings === 1 ? 'warning' : 'warnings'}</Badge>}
              </span>
            </span>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-data-panel-open:rotate-90" />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="px-3 pb-3">
              <FramePanel className="p-4">
                <ul className="divide-y">
                  {page.issues.map((issue) => <li key={issue.title} className="py-3 first:pt-0">
                    <h3 className="text-sm font-medium leading-5">{issue.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{issue.fix}</p>
                  </li>)}
                </ul>
                <Button render={<a href={page.url} target="_blank" rel="noreferrer" />} variant="secondary" size="sm" className="mt-3">Check the live page<span className="sr-only"> (opens in a new tab)</span><ExternalLink aria-hidden="true" /></Button>
              </FramePanel>
            </div>
          </CollapsiblePanel>
        </Collapsible>
      </TableCell>
    </TableRow>
  );
}
