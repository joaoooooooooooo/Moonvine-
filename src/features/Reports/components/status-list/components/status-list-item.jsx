import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStatusListItem } from "@/features/Reports/components/status-list/hooks/use-status-list-item";

export function StatusListItem({
  badge = "7 Posts",
  className,
  label = "Client social",
  variant = "default",
}) {
  const styles = useStatusListItem({ variant });

  return (
    <div
      className={cn(
        "flex w-full items-center justify-start gap-3",
        styles.className,
        className,
      )}
    >
      <p className={cn("text-base font-normal leading-6", styles.labelClassName)}>
        {label}
      </p>
      {badge ? (
        <Badge
          className="shrink-0"
          hideBackground={variant !== "disabled"}
          size="default"
          variant={styles.badgeVariant}
        >
          {badge}
        </Badge>
      ) : null}
    </div>
  );
}
