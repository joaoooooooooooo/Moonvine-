"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CardFrame } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ReportsTable } from "@/features/reportsTable/components/reportsTable";
import { cn } from "@/lib/utils";

const TODAY = new Date(2026, 7, 23);
const INITIAL_MONTH = new Date(2026, 7, 1);

const dayButtonClassNames =
  "relative flex size-(--cell-size) aspect-square items-center justify-center rounded-[10px] text-sm font-normal text-foreground disabled:pointer-events-none disabled:opacity-64";

const navButtonClassNames =
  "relative flex size-(--cell-size) items-center justify-center rounded-lg text-foreground not-in-data-selected:hover:bg-accent disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const placeholderReportDates = [
  new Date(2026, 2, 4),
  new Date(2026, 2, 11),
  new Date(2026, 2, 18),
  new Date(2026, 2, 25),
  new Date(2026, 3, 3),
  new Date(2026, 3, 10),
  new Date(2026, 3, 16),
  new Date(2026, 3, 24),
  new Date(2026, 4, 6),
  new Date(2026, 4, 14),
  new Date(2026, 4, 21),
  new Date(2026, 4, 28),
  new Date(2026, 5, 2),
  new Date(2026, 5, 11),
  new Date(2026, 5, 17),
  new Date(2026, 5, 25),
  new Date(2026, 6, 1),
  new Date(2026, 6, 9),
  new Date(2026, 6, 15),
  new Date(2026, 6, 23),
  new Date(2026, 7, 6),
  new Date(2026, 7, 13),
  new Date(2026, 7, 20),
  new Date(2026, 7, 23),
  new Date(2026, 7, 27),
  new Date(2026, 8, 4),
  new Date(2026, 8, 10),
  new Date(2026, 8, 17),
  new Date(2026, 8, 25),
  new Date(2026, 9, 2),
  new Date(2026, 9, 8),
  new Date(2026, 9, 16),
  new Date(2026, 9, 22),
  new Date(2026, 10, 5),
  new Date(2026, 10, 12),
  new Date(2026, 10, 19),
  new Date(2026, 10, 26),
  new Date(2026, 11, 3),
  new Date(2026, 11, 9),
  new Date(2026, 11, 17),
  new Date(2026, 11, 23),
  new Date(2027, 0, 7),
  new Date(2027, 0, 14),
  new Date(2027, 0, 20),
  new Date(2027, 0, 28),
  new Date(2027, 1, 5),
  new Date(2027, 1, 11),
  new Date(2027, 1, 18),
  new Date(2027, 1, 26),
];

const calendarClassNames = {
  button_next: navButtonClassNames,
  button_previous: navButtonClassNames,
  caption_label:
    "flex h-full items-center gap-2 text-center font-medium text-base text-foreground sm:text-sm",
  day: "size-(--cell-size) p-px text-sm",
  day_button: cn(dayButtonClassNames, [
    "h-full w-full cursor-default bg-primary-foreground pointer-events-none",
    "hover:bg-primary-foreground focus-visible:ring-0",
    "in-data-outside:text-muted-foreground in-data-outside:opacity-72",
    "in-[.info]:bg-info in-[.success]:bg-success in-[.mutedAccent]:bg-ring in-[.mutedAccent]:text-foreground",
  ]),
  dropdown: "absolute inset-0 bg-popover opacity-0",
  dropdown_root:
    "relative h-9 rounded-lg border border-input px-[calc(--spacing(3)-1px)] shadow-xs/5 has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50 sm:h-8",
  dropdowns:
    "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-base sm:text-sm *:[span]:font-medium",
  hidden: "invisible",
  month: "w-full",
  month_grid: "w-full border-separate border-spacing-[2px] table-fixed",
  month_caption:
    "relative mb-[2px] flex h-9 items-center justify-center px-1",
  months: "relative flex w-full flex-col gap-2",
  nav: "absolute top-0 flex w-full justify-between",
  outside: "text-muted-foreground",
  range_end: "range-end",
  range_middle: "range-middle",
  range_start: "range-start",
  today: "",
  week: "w-full",
  week_number:
    "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
  weekdays: "w-full",
  weeks: "w-full",
  weekday:
    "h-9 p-0 text-center text-xs font-medium tracking-[0.12px] text-muted-foreground/70",
};

export function ReportsCalendar() {
  const [month, setMonth] = useState(INITIAL_MONTH);

  const modifiers = useMemo(
    () => ({
      info: placeholderReportDates.filter((date) => date < TODAY),
      mutedAccent: placeholderReportDates.filter((date) => date > TODAY),
      success: placeholderReportDates.filter(
        (date) => date.getTime() === TODAY.getTime(),
      ),
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-[24rem] text-2xl leading-9 text-foreground">
          Review scheduled report runs by company, month, week, and report type.
        </h1>

        <div className="flex flex-wrap gap-2">
          <Badge size="lg" variant="success">
            Current
          </Badge>
          <Badge size="lg" variant="secondary">
            Future
          </Badge>
          <Badge size="lg" variant="info">
            Past
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
        <CardFrame className="overflow-hidden bg-card p-4 text-card-foreground shadow-xs/5 before:bg-muted/72 sm:p-5">
          <Calendar
            className="w-full max-w-[536px] bg-transparent p-0 [--cell-size:min(calc((100%-12px)/7),74px)] [&_.rdp-month]:max-w-[536px] [&_.rdp-month]:w-full [&_.rdp-month_grid]:w-full [&_.rdp-months]:w-full [&_.rdp-table]:w-full [&_.rdp-tbody]:flex [&_.rdp-tbody]:flex-col [&_.rdp-tbody]:gap-[2px] [&_.rdp-week]:w-full [&_.rdp-week]:table [&_.rdp-week]:table-fixed [&_.rdp-weekdays]:table [&_.rdp-weeks]:w-full"
            classNames={calendarClassNames}
            defaultMonth={INITIAL_MONTH}
            fixedWeeks
            hideNavigation={false}
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
            }}
            modifiers={modifiers}
            modifiersClassNames={{
              info: "info",
              mutedAccent: "mutedAccent",
              success: "success",
            }}
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
          />
        </CardFrame>
        <div className="min-w-0">
          <ReportsTable />
        </div>
      </div>
    </div>
  );
}
