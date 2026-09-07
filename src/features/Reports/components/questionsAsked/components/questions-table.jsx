import { ReportTablePagination } from "@/features/Reports/components/reportControls";
import { useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { FrameCard, FrameCardContent, FrameCardTop } from "@/components/ui/frame-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columns = [
  { accessorKey: "text", enableSorting: false },
  { accessorKey: "type", enableSorting: false },
  {
    id: "mentions",
    accessorFn: (question) => question.mentions ?? undefined,
    sortingFn: "basic",
    sortUndefined: "last",
    sortDescFirst: false,
  },
];

export function QuestionsTable({ questions, toolbar }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data: questions,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    state: { pagination, sorting },
  });
  const mentionsColumn = table.getColumn("mentions");
  const mentionsOrder = mentionsColumn.getIsSorted();
  const SortIcon = mentionsOrder === "asc" ? ChevronUpIcon : mentionsOrder === "desc" ? ChevronDownIcon : ChevronsUpDownIcon;
  return (
    <FrameCard className="w-full" withFill>
      {toolbar && <FrameCardTop className="h-auto p-3">{toolbar}</FrameCardTop>}
      <FrameCardContent className="gap-0 p-0 shadow-none before:shadow-none">
      <Table className="[&_th]:px-5 [&_td]:px-5">
        <caption className="sr-only">Questions asked in the report sample and their mention counts</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Question</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col" className="text-right" aria-sort={mentionsOrder === "asc" ? "ascending" : mentionsOrder === "desc" ? "descending" : "none"}>
              <button
                type="button"
                className="inline-flex min-h-10 cursor-pointer items-center justify-end gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={mentionsColumn.getToggleSortingHandler()}
                aria-label={`Mentions: sort ${mentionsOrder === "asc" ? "high to low" : "low to high"}`}
              >
                Mentions
                <SortIcon aria-hidden="true" className="size-4 shrink-0" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(({ original: question, id }) => (
            <TableRow key={id}>
              <TableCell className="whitespace-normal py-4 text-sm leading-6">{question.text}</TableCell>
              <TableCell className="w-40 whitespace-normal text-xs leading-5 text-muted-foreground">{question.type}</TableCell>
              <TableCell className="text-right tabular-nums">
                {question.mentions == null ? <span aria-label="Mention count unavailable">&mdash;</span> : question.mentions.toLocaleString("en-US")}
              </TableCell>
            </TableRow>
          ))}
          {questions.length === 0 && (
            <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No questions to show.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      </FrameCardContent>
      <FrameCardTop className="h-auto p-3">
        <ReportTablePagination table={table} />
      </FrameCardTop>
    </FrameCard>
  );
}
