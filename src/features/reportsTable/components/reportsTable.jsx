"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
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
import { ReportsCompanyPicker } from "@/features/reportsTable/components/reports-company-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const companies = [
  {
    company: "Apta Agency",
    domain: "apta.agency",
    logoMark: "a",
  },
  {
    company: "Curio Digital",
    domain: "curiodigital.io",
    logoMark: "C",
  },
];

const reportMonths = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
];

const data = companies.flatMap(({ company, domain, logoMark }) =>
  reportMonths.flatMap((month) =>
    Array.from({ length: 4 }, (_, weekIndex) => ({
      id: `report-${company.toLowerCase().replaceAll(" ", "-")}-${month.toLowerCase()}-${weekIndex + 1}`,
      company,
      domain,
      logoMark,
      month,
      reportType: "Weekly",
      week: `Week ${weekIndex + 1}`,
    })),
  ),
);

const monthItems = [
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
];

const monthAbbreviations = {
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
};

export function ReportsTable() {
  const id = useId();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState([
    {
      desc: false,
      id: "company",
    },
  ]);
  const companyItems = useMemo(
    () => [...new Set(data.map((report) => report.company))],
    [],
  );
  const filteredReports = useMemo(() => {
    let nextReports = data;

    if (selectedCompany !== "all") {
      nextReports = nextReports.filter((report) => report.company === selectedCompany);
    }

    if (selectedMonths.length === 0) {
      return nextReports;
    }

    return nextReports.filter((report) =>
      selectedMonths.some((selectedMonth) => selectedMonth.value === report.month),
    );
  }, [selectedCompany, selectedMonths]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "company",
        cell: ({ row }) => {
          const company = row.getValue("company");

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border bg-background text-foreground">
                <AvatarFallback className="bg-card text-sm font-semibold text-foreground">
                  {row.original.logoMark}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <div className="truncate font-medium text-foreground">{company}</div>
                <div className="truncate text-muted-foreground text-sm">
                  {row.original.domain}
                </div>
              </div>
            </div>
          );
        },
        enableSorting: false,
        header: () => (
          <div onClick={(event) => event.stopPropagation()}>
            <ReportsCompanyPicker
              companies={companyItems}
              onValueChange={setSelectedCompany}
              value={selectedCompany}
            />
          </div>
        ),
        size: 220,
      },
      {
        accessorKey: "month",
        enableSorting: false,
        header: "Month",
        size: 180,
      },
      {
        accessorKey: "week",
        header: "Week",
        size: 96,
      },
      {
        accessorKey: "reportType",
        cell: ({ row }) => {
          const reportType = row.getValue("reportType");

          return (
            <Badge variant={reportType === "Special" ? "warning" : "outline"}>
              {reportType}
            </Badge>
          );
        },
        header: "Report Type",
        size: 104,
      },
    ],
    [companyItems, selectedCompany],
  );

  const table = useReactTable({
    columns,
    data: filteredReports,
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
    <div>
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
                  {header.isPlaceholder ? null : header.column.id === "month" ? (
                    <div onClick={(event) => event.stopPropagation()}>
                      <Combobox
                        items={monthItems}
                        multiple
                        onValueChange={setSelectedMonths}
                        value={selectedMonths}
                      >
                        <ComboboxChips
                          className="min-h-8 border-0 bg-transparent px-0 shadow-none"
                          startAddon={<CalendarIcon className="size-4" />}
                        >
                          <ComboboxValue>
                            {(value) => (
                              <>
                                {value?.map((item) => (
                                  <ComboboxChip aria-label={item.label} key={item.value}>
                                    {monthAbbreviations[item.value] ?? item.label}
                                  </ComboboxChip>
                                ))}
                                <ComboboxChipsInput
                                  aria-label="Search months"
                                  placeholder={value.length > 0 ? undefined : "Search month..."}
                                />
                              </>
                            )}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxPopup>
                          <ComboboxEmpty>No months found.</ComboboxEmpty>
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
                  ) : header.column.getCanSort() ? (
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
                No reports found.
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
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                  {Array.from({ length: table.getPageCount() }, (_, pageIndex) => {
                    const start = pageIndex * table.getState().pagination.pageSize + 1;
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
