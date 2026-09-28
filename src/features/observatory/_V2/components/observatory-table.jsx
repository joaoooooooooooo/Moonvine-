import { CardFrame } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { TablePagination } from './table-pagination';

// COSS p-table-7 with square inner row corners; shared primitives stay unchanged.
export function ObservatoryTable({ label, toolbar, search, totalRows = 0, pagination, children }) {
  return (
    <div className="w-full space-y-3">
      {toolbar}
      {totalRows >= 15 && search}
      <CardFrame className="w-full rounded-md before:rounded-[calc(var(--radius-md)-1px)]">
        <Table aria-label={label} variant="card" className="table-fixed [&_th]:px-4! [&_td]:px-4! [&_thead_tr]:border-b-0 [&_thead_tr]:hover:bg-transparent [&_tbody]:rounded-none! [&_tbody]:shadow-none! [&_tbody]:before:hidden [&_tbody_td]:rounded-none!">
          {children}
        </Table>
        {pagination && <TablePagination {...pagination} />}
      </CardFrame>
    </div>
  );
}
