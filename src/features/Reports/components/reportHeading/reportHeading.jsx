import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const defaultTitle =
  "Weekly interactions with the client's social posts stayed close to the recent baseline.";
const defaultDescription =
  "The LinkedIn post was Apta Agency's most visible owned update this week.";

export function ReportHeading({
  align = "left",
  afterDescription,
  badge = "Good",
  badgeVariant = "secondary",
  className,
  description = defaultDescription,
  title = defaultTitle,
}) {
  return (
    <div
      className={cn(
        "flex max-w-[26.5rem] flex-col gap-5",
        align === "right" && "items-end text-right",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3.5",
          align === "right" ? "items-end" : "items-start",
        )}
      >
        {badge ? (
          <>
            <Badge
              className="px-1 tracking-[0.01em] md:hidden"
              size="default"
              variant={badgeVariant}
            >
              {badge}
            </Badge>
            <Badge
              className="hidden px-1.5 tracking-[0.01em] md:inline-flex"
              size="lg"
              variant={badgeVariant}
            >
              {badge}
            </Badge>
          </>
        ) : null}
        <h1 className={cn("text-4xl font-medium tracking-[-0.022em] text-foreground")}>
          {title}
        </h1>
      </div>
      {description || afterDescription ? (
        <div
          className={cn("flex flex-col gap-4", align === "right" && "items-end")}
        >
          {description ? (
            <p
              className={cn(
                "max-w-[21.75rem] text-base leading-6 font-medium text-muted-foreground",
                align === "right" && "text-right",
              )}
            >
              {description}
            </p>
          ) : null}
          {afterDescription}
        </div>
      ) : null}
    </div>
  );
}
