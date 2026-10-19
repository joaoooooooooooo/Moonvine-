import { Fragment, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp } from '@/components/ui/icons';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ObservatoryTable } from './observatory-table';

/**
 * Reusable expandable Observatory table.
 *
 * columns: Array<{ id, header, render(row), headerClassName?, cellClassName? }>
 * rows: data records displayed by the table
 * getRowId(row): returns a stable string or number
 * getRowLabel(row): returns the accessible action label
 * renderDetails(row): renders the expanded content spanning every column
 * defaultExpandedRowIds: initial expanded row IDs
 * allowMultiple: whether more than one row can remain expanded
 * toolbar: optional content above the shared table frame
 * pagination: optional shared table pagination configuration
 */
export function ObservatoryCollapsibleTable({
  allowMultiple = false,
  columns,
  defaultExpandedRowIds = [],
  getRowId,
  getRowLabel,
  label,
  layout = 'auto',
  pagination,
  renderDetails,
  rows,
  toolbar,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [expandedRowIds, setExpandedRowIds] = useState(() => new Set(defaultExpandedRowIds.map(String)));
  const detailTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

  function toggleRow(row) {
    const rowId = String(getRowId(row));
    setExpandedRowIds((current) => {
      const next = allowMultiple ? new Set(current) : new Set();
      if (current.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  function handleRowKeyDown(event, row) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleRow(row);
  }

  return (
    <ObservatoryTable label={label} layout={layout} pagination={pagination} toolbar={toolbar}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => <TableHead key={column.id} className={column.headerClassName}>{column.header}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const rowId = String(getRowId(row));
          const expanded = expandedRowIds.has(rowId);
          const rowLabel = getRowLabel(row);
          return <Fragment key={rowId}>
            <TableRow
              aria-expanded={expanded}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${rowLabel}`}
              className={cn('cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', expanded && '[&>td]:border-b-0!')}
              onClick={() => toggleRow(row)}
              onKeyDown={(event) => handleRowKeyDown(event, row)}
              tabIndex={0}
            >
              {columns.map((column, index) => <TableCell key={column.id} className={cn('h-12', column.cellClassName)}>
                {index === columns.length - 1 ? <span className="flex items-center justify-between gap-3">{column.render(row)}{expanded ? <ChevronUp aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> : <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />}</span> : column.render(row)}
              </TableCell>)}
            </TableRow>
            <AnimatePresence initial={false}>
              {expanded && <motion.tr
                animate={{ opacity: 1 }}
                className="relative border-b [&:hover>td]:!bg-card"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={detailTransition}
              >
                <TableCell className="whitespace-normal p-0!" colSpan={columns.length}>
                  <motion.div
                    animate={{ height: 'auto' }}
                    className="overflow-hidden"
                    exit={{ height: 0 }}
                    initial={{ height: 0 }}
                    transition={detailTransition}
                  >
                    <div className="py-4">{renderDetails(row)}</div>
                  </motion.div>
                </TableCell>
              </motion.tr>}
            </AnimatePresence>
          </Fragment>;
        })}
      </TableBody>
    </ObservatoryTable>
  );
}
