import { useState } from 'react';
import { WeekCalendar } from './week-calendar';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverPopup, PopoverTitle } from '@/components/ui/popover';
import { reportWeeks, weekDate, weekLabel } from '../data/report-weeks';
import { accountHref } from '../utils/observatory-model';

export function ReportWeekPicker({ account, route }) {
  const selected = reportWeeks.find((week) => week.value === route.period) ?? reportWeeks[0];
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => weekDate(selected.start));
  function selectWeek(period) {
    window.location.hash = accountHref(account.id, route.lensId, period).slice(1);
    setOpen(false);
  }
  return (
    <Popover open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) setMonth(weekDate(selected.start));
      setOpen(nextOpen);
    }}>
      <PopoverTrigger render={<Button variant="secondary" size="sm" className="min-w-0 bg-muted font-normal shadow-none" />} aria-label={`Report week: ${weekLabel(selected.start)}`}>
        <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
        <span className="truncate">{weekLabel(selected.start)}</span>
      </PopoverTrigger>
      <PopoverPopup align="end" className="max-w-[calc(100vw-2rem)]">
        <PopoverTitle className="sr-only">Choose a weekly report</PopoverTitle>
        <div className="flex max-sm:flex-col">
          <div className="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
            <div className="flex h-full flex-col sm:border-e sm:pe-3">
              {[['current', 'This week'], ['previous', 'Last week']].map(([period, label]) => (
                <Button key={period} className="w-full justify-start" size="sm" variant="ghost"
                  aria-pressed={selected.value === period} onClick={() => selectWeek(period)}>{label}</Button>
              ))}
            </div>
          </div>
          <div className="max-sm:pb-3 sm:ps-2">
            <WeekCalendar month={month} onMonthChange={setMonth} selected={selected} onSelect={selectWeek} />
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  );
}

