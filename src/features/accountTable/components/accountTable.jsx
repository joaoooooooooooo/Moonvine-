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
  SearchIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { useAccountSignalFilter } from "@/features/accountTable/hooks/use-account-signal-filter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFrame, CardFrameFooter } from "@/components/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from "@/components/ui/combobox";
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
    id: "acct-001",
    account: "Alder & Thread",
    domain: "alder-thread.com",
    pageName: "/alder-thread",
    signal: "Active",
  },
  {
    id: "acct-002",
    account: "Northlight Capital",
    domain: "northlightcapital.co",
    pageName: "/northlight-capital",
    signal: "Pending",
  },
  {
    id: "acct-003",
    account: "Solstice Ventures",
    domain: "solsticeventures.com",
    pageName: "/solstice-ventures",
    signal: "Active",
  },
  {
    id: "acct-004",
    account: "Helix Bio",
    domain: "helixbio.io",
    pageName: "/helix-bio",
    signal: "Inactive",
  },
  {
    id: "acct-005",
    account: "Evergreen Mobility",
    domain: "evergreenmobility.com",
    pageName: "/evergreen-mobility",
    signal: "Active",
  },
  {
    id: "acct-006",
    account: "Atlas Infrastructure",
    domain: "atlasinfra.ca",
    pageName: "/atlas-infrastructure",
    signal: "Pending",
  },
  {
    id: "acct-007",
    account: "Mirage Commerce",
    domain: "miragecommerce.ae",
    pageName: "/mirage-commerce",
    signal: "Active",
  },
  {
    id: "acct-008",
    account: "Blue Oak Energy",
    domain: "blueoakenergy.kr",
    pageName: "/blue-oak-energy",
    signal: "Inactive",
  },
];

const signalItems = [
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Inactive", value: "Inactive" },
];

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
    accessorKey: "account",
    cell: ({ row }) => {
      const account = row.getValue("account");

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-border bg-background text-foreground">
            <AvatarFallback className="bg-muted text-sm font-medium text-foreground">
              {getInitials(account)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <div className="truncate font-medium text-foreground">{account}</div>
            <div className="truncate text-muted-foreground text-sm">
              {row.original.pageName}
            </div>
          </div>
        </div>
      );
    },
    header: "Account",
    size: 360,
  },
  {
    accessorKey: "domain",
    header: "Domain",
    size: 220,
  },
  {
    accessorKey: "signal",
    cell: ({ row }) => {
      const signal = row.getValue("signal");

      return (
        <Badge
          variant={
            signal === "Active"
              ? "success"
              : signal === "Pending"
                ? "warning"
                : "secondary"
          }
        >
          {signal}
        </Badge>
      );
    },
    header: "Signal",
    size: 120,
  },
];

export function AccountTable() {
  const id = useId();
  const { filteredAccounts, selectedSignals, setSelectedSignals } =
    useAccountSignalFilter(data);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState([
    {
      desc: false,
      id: "account",
    },
  ]);

  const table = useReactTable({
    columns,
    data: filteredAccounts,
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
      <div className="max-w-md">
        <Combobox
          items={signalItems}
          multiple
          onValueChange={setSelectedSignals}
          value={selectedSignals}
        >
          <ComboboxChips startAddon={<SearchIcon />}>
            <ComboboxValue>
              {(value) => (
                <>
                  {value?.map((item) => (
                    <ComboboxChip aria-label={item.label} key={item.value}>
                      {item.label}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    aria-label="Search signal types"
                    placeholder={value.length > 0 ? undefined : "Search signal type..."}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxPopup>
            <ComboboxEmpty>No signal types found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
      </div>

      <CardFrame className="w-full [&_[data-slot=table-container]]:m-0 [&_[data-slot=table-container]]:w-full [&_[data-slot=table-container]]:p-1">
        <Table className="table-fixed" variant="card">
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
                  No accounts found.
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
