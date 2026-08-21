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
import { people } from "@/features/people/config/people-data";
import { usePeopleTable } from "@/features/people/hooks/use-people-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

function getInitials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const columns = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.getValue("name");

      return (
        <div className="flex w-fit items-center gap-4">
          <Avatar className="size-10 border border-border bg-background text-foreground">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <div className="truncate font-medium text-foreground">{name}</div>
            <div className="truncate text-muted-foreground text-sm">
              {row.original.email}
            </div>
          </div>
        </div>
      );
    },
    header: "Name",
    size: 340,
  },
  {
    accessorKey: "companies",
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        {row.original.companies.map((company) => (
          <Badge key={company} variant="outline">
            {company}
          </Badge>
        ))}
      </div>
    ),
    header: "Company",
    size: 220,
  },
  {
    accessorKey: "tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        {row.original.tags.map((tag) => (
          <Badge key={tag.label} variant={tag.variant}>
            {tag.label}
          </Badge>
        ))}
      </div>
    ),
    header: "Tags",
    size: 210,
  },
];

export function PeopleTable() {
  const id = useId();
  const { pagination, setPagination, setSorting, sorting } = usePeopleTable();

  const table = useReactTable({
    columns,
    data: people,
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
      <CardFrame className="w-full [&_[data-slot=table-container]]:m-0 [&_[data-slot=table-container]]:w-full [&_[data-slot=table-container]]:p-1">
        <Table
          className="table-fixed [&_td]:!whitespace-normal [&_th]:!whitespace-normal"
          variant="card"
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="h-11"
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex h-full cursor-pointer select-none items-center justify-between gap-2"
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
                <TableRow
                  aria-label={`Open ${row.original.name}`}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  key={row.id}
                  onClick={() => {
                    window.location.hash = `/people/${row.original.id}`;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      window.location.hash = `/people/${row.original.id}`;
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
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
                  No people found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <CardFrameFooter className="p-2">
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
