"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useId } from "react";
import { useEntitiesTable } from "@/features/entitiesTable/hooks/use-entities-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFrame, CardFrameFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data = [
  {
    id: "entity-001",
    domain: "apta.agency",
    entity: "Apta Agency",
    logo: null,
    logoMark: "a",
    type: "Account",
  },
  {
    id: "entity-002",
    domain: "curiodigital.io",
    entity: "Curio Digital",
    logo: null,
    logoMark: "C",
    type: "Watched",
  },
  {
    id: "entity-003",
    domain: "hlabs.co.uk",
    entity: "HLabs",
    logo: null,
    logoMark: "H",
    type: "Watched",
  },
  {
    id: "entity-004",
    domain: "superside.com",
    entity: "Superside",
    logo: null,
    logoMark: "S",
    type: "Watched",
  },
];

const columns = [
  {
    accessorKey: "entity",
    cell: ({ row }) => {
      const entity = row.getValue("entity");

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-border bg-background text-foreground">
            {row.original.logo ? <AvatarImage alt={entity} src={row.original.logo} /> : null}
            <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
              {row.original.logoMark}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <div className="truncate font-medium text-foreground">{entity}</div>
            <div className="truncate text-muted-foreground text-sm">
              {row.original.domain}
            </div>
          </div>
        </div>
      );
    },
    header: "Entity",
    size: 340,
  },
  {
    accessorKey: "domain",
    header: "Domain",
    size: 220,
  },
  {
    accessorKey: "type",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    header: "Type",
    size: 120,
  },
];

export function EntitiesTable() {
  const id = useId();
  const { pagination, setPagination, setSorting, sorting } = useEntitiesTable();

  const table = useReactTable({
    columns,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <CardFrame className="w-full  [&_[data-slot=table-container]]:m-0 [&_[data-slot=table-container]]:w-full [&_[data-slot=table-container]]:p-0">
        <Table
          className="table-fixed bg-card [&_td]:!whitespace-normal [&_th]:!whitespace-normal"
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="h-11 px-3 text-left text-sm font-semibold bg-background text-muted-foreground"
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex h-full cursor-pointer select-none items-center justify-between gap-2 "
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            header.column.getToggleSortingHandler()?.(event);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: (
                            <ChevronUpIcon
                              aria-hidden="true"
                              className="shrink-0 opacity-60"
                              size={16}
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="shrink-0 opacity-60"
                              size={16}
                            />
                          ),
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No entities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <CardFrameFooter className="p-2 bg-background">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Label className="sr-only" htmlFor={id}>
                Viewing range
              </Label>
              <p className="text-muted-foreground text-sm">Viewing</p>
              <Select
                onValueChange={(value) => table.setPageIndex(Number(value))}
                value={table.getState().pagination.pageIndex.toString()}
              >
                <SelectTrigger className="min-w-0 w-fit whitespace-nowrap" id={id} size="sm">
                  <SelectValue placeholder="Select row count" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                  {Array.from({ length: table.getPageCount() }, (_, pageIndex) => {
                    const start =
                      pageIndex * table.getState().pagination.pageSize + 1;
                    const end = Math.min(
                      (pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getRowCount(),
                    );

                    return (
                      <SelectItem key={pageIndex} value={pageIndex.toString()}>
                        {`${start}-${end}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-sm">
                of <span className="text-foreground">{table.getRowCount()}</span> results
              </p>
            </div>

            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label="Go to first page"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.firstPage()}
                    size="icon"
                    variant="outline"
                  >
                    <ChevronFirstIcon aria-hidden="true" size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    aria-label="Go to previous page"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    size="icon"
                    variant="outline"
                  >
                    <ChevronLeftIcon aria-hidden="true" size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    aria-label="Go to next page"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    size="icon"
                    variant="outline"
                  >
                    <ChevronRightIcon aria-hidden="true" size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    aria-label="Go to last page"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.lastPage()}
                    size="icon"
                    variant="outline"
                  >
                    <ChevronLastIcon aria-hidden="true" size={16} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFrameFooter>
      </CardFrame>
    </div>
  );
}
