import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { reportWeeks, weekDate } from '../data/report-weeks';
import './week-calendar.css';

const reportDates = reportWeeks.map(({ start }) => weekDate(start).getTime());
const firstReportMonth = new Date(Math.min(...reportDates));
const lastReportMonth = new Date(Math.max(...reportDates));

function startOfWeek(day) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  return start;
}

function sameWeek(day, start) {
  return start && startOfWeek(day).getTime() === start.getTime();
}

export function WeekCalendar({ month, onMonthChange, selected, onSelect }) {
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const from = weekDate(selected.start);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const reportForDay = (day) => reportWeeks.find((week) => sameWeek(day, weekDate(week.start)));
  return (
    <Calendar
      className="report-week-calendar"
      mode="range"
      numberOfMonths={1}
      weekStartsOn={1}
      month={month}
      startMonth={firstReportMonth}
      endMonth={lastReportMonth}
      onMonthChange={(next) => { setHoveredWeek(null); onMonthChange(next); }}
      selected={{ from, to }}
      disabled={(day) => !reportForDay(day)}
      onDayClick={(day, modifiers) => {
        const report = reportForDay(day);
        if (!modifiers.disabled && report) onSelect(report.value);
      }}
      onDayMouseEnter={(day, modifiers) => setHoveredWeek(modifiers.disabled ? null : startOfWeek(day))}
      onDayMouseLeave={() => setHoveredWeek(null)}
      onDayFocus={(day, modifiers) => setHoveredWeek(modifiers.disabled ? null : startOfWeek(day))}
      onDayBlur={() => setHoveredWeek(null)}
      modifiers={{ weekPreview: (day) => Boolean(sameWeek(day, hoveredWeek)) }}
      modifiersClassNames={{ weekPreview: 'week-preview' }}
    />
  );
}
