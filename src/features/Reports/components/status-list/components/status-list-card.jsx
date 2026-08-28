import {
  FrameCard,
  FrameCardContent,
  FrameCardTop,
} from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";
import { StatusListItem } from "@/features/Reports/components/status-list/components/status-list-item";
import { useStatusListCard } from "@/features/Reports/components/status-list/hooks/use-status-list-card";

export function StatusListCard({
  className,
  items = [],
  title = "Signals",
  withFill = false,
}) {
  const { count } = useStatusListCard({ items });

  return (
    <FrameCard className={cn("min-h-[20rem] w-full", className)} withFill={withFill}>
      <FrameCardTop className="flex-row items-center justify-between">
        <p className="text-base font-normal leading-6 text-foreground">{title}</p>
        <p className="text-sm font-normal leading-5 text-muted-foreground">{count}</p>
      </FrameCardTop>

      <FrameCardContent className="gap-1.5">
        {items.map((item, index) => (
          <StatusListItem
            badge={item.badge}
            key={`${item.label}-${index}`}
            label={item.label}
            variant={item.variant}
          />
        ))}
      </FrameCardContent>
    </FrameCard>
  );
}
