import { Select, SelectItem, SelectPopup, SelectValue } from "@/components/ui/select";
import { ReportSelectTrigger } from "@/features/Reports/components/reportControls";

export function EntityChartSelect({ className, items, onValueChange, value }) {
  return (
    <Select items={items} value={value} onValueChange={(next) => { if (next != null) onValueChange?.(next); }}>
      <ReportSelectTrigger aria-label="Choose chart view" className={className ?? "w-full sm:w-64"}><SelectValue /></ReportSelectTrigger>
      <SelectPopup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup>
    </Select>
  );
}
