import { ObservatorySelectTrigger as SelectTrigger } from './observatory-select-trigger';
import { FrameFooter } from '@/components/ui/frame';
import { Button } from '@/components/ui/button';
import { Select, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

export function TablePagination({ total, pageIndex = 0, pageSize = 10, onPageChange }) {
  const pageCount = Math.ceil(total / pageSize);
  const ranges = Array.from({ length: pageCount }, (_, i) => ({ value: i, label: `${i * pageSize + 1}-${Math.min((i + 1) * pageSize, total)}` }));
  return (
    <FrameFooter className="p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="text-sm text-muted-foreground">Viewing</p>
          <Select items={ranges} value={pageCount ? pageIndex : null} onValueChange={(value) => { if (value !== null) onPageChange?.(value); }} disabled={!pageCount}>
            <SelectTrigger aria-label="Select result range" className="w-fit min-w-0" size="sm"><SelectValue placeholder="0" /></SelectTrigger>
            <SelectPopup>{ranges.map((range) => <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>)}</SelectPopup>
          </Select>
          <p className="text-sm text-muted-foreground">of <strong className="font-medium text-foreground">{total}</strong> results</p>
        </div>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem><PaginationPrevious className="sm:*:[svg]:hidden" render={<Button disabled={pageIndex === 0} onClick={() => onPageChange?.(pageIndex - 1)} size="sm" variant="secondary" />} /></PaginationItem>
            <PaginationItem><PaginationNext className="sm:*:[svg]:hidden" render={<Button disabled={pageIndex >= pageCount - 1} onClick={() => onPageChange?.(pageIndex + 1)} size="sm" variant="secondary" />} /></PaginationItem>
          </PaginationContent>
        </Pagination>
        <span className="sr-only" aria-live="polite">Page {pageCount ? pageIndex + 1 : 0} of {pageCount}</span>
      </div>
    </FrameFooter>
  );
}
