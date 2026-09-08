import { EyeIcon, GlobeIcon, MegaphoneIcon } from "lucide-react";
import { Select, SelectItem, SelectPopup, SelectValue } from "@/components/ui/select";
import { ReportSelectTrigger } from "@/features/Reports/components/reportControls";

const chartViewIcons = {
  "source-presence": GlobeIcon,
  visibility: EyeIcon,
  "share-of-voice": MegaphoneIcon,
};

function ChartViewLabel({ item }) {
  const Icon = chartViewIcons[item?.value];
  return (
    <span className="flex min-w-0 items-center gap-2">
      {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
      <span className="truncate">{item?.label}</span>
    </span>
  );
}

export function EntityChartSelect({ className, items, onValueChange, value }) {
  return (
    <Select items={items} value={value} onValueChange={(next) => { if (next != null) onValueChange?.(next); }}>
      <ReportSelectTrigger aria-label="Choose chart view" className={className ?? "w-full sm:w-64"}>
        <SelectValue><ChartViewLabel item={items.find((item) => item.value === value)} /></SelectValue>
      </ReportSelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <ChartViewLabel item={item} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
