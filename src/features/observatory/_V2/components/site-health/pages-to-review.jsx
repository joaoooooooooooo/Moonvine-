import { useState } from 'react';
import { TableBody } from '@/components/ui/table';
import { ObservatoryTable } from '../observatory-table';
import { PageFixRow } from './page-fix-row';
import { getSiteFixes } from '../../data/site-fixes';

export function PagesToReview({ account }) {
  const pages = getSiteFixes(account.domain);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const visiblePages = pages.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  return (
    <section aria-label="Pages to review">
      <ObservatoryTable label="Pages to review" pagination={{ total: pages.length, pageIndex, pageSize, onPageChange: setPageIndex }} toolbar={<div className="space-y-2">
        <h2 className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">Pages to review</h2>
        <p className="max-w-[32rem] text-sm leading-6 text-muted-foreground">These pages carried saved issue counts. Expand a row to see what failed and how to fix it.</p>
      </div>}>
        <TableBody>{visiblePages.map((page) => <PageFixRow key={account.id + page.path} page={page} />)}</TableBody>
      </ObservatoryTable>
    </section>
  );
}
