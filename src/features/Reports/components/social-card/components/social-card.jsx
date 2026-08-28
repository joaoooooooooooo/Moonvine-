import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";
import { useSocialCard } from "@/features/Reports/components/social-card/hooks/use-social-card";

export function SocialCard({
  actionIcon,
  badge,
  badgeIcon,
  badgeLabel = "Competitor",
  badgeVariant = "warning",
  className,
  icon,
  name = "Apta Agency",
  thumbnailAlt = "",
  thumbnailClassName,
  thumbnailSrc,
  title = "Blank canvas to a fully built Webflow site.",
  variant = "default",
  withFill = true,
}) {
  const card = useSocialCard({
    badge,
    badgeIcon,
    badgeLabel,
    badgeVariant,
    variant,
  });

  return (
    <FrameCard className={cn("w-full max-w-[24.875rem]", className)} withFill={withFill}>
      <FrameCardContent className="gap-0 p-5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
          {thumbnailSrc ? (
            <img
              alt={thumbnailAlt}
              className={cn("size-full object-cover", thumbnailClassName)}
              src={thumbnailSrc}
            />
          ) : null}
        </div>
      </FrameCardContent>

      <div className="relative isolate flex w-full flex-col gap-0.5 overflow-clip rounded-xl bg-card p-2">
        <div className="flex w-full flex-col gap-4 px-2 py-2">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex shrink-0 items-center justify-center text-muted-foreground [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0">
                {icon}
              </div>

              <div className="flex min-w-0 items-center gap-4">
                <p
                  className={cn(
                    "truncate text-sm font-normal leading-5",
                    card.nameClassName,
                  )}
                >
                  {name}
                </p>

                {card.badge ? (
                  <Badge
                    className="shrink-0"
                    size="sm"
                    variant={card.badge.variant ?? badgeVariant}
                  >
                    {card.badge.icon}
                    <span>{card.badge.label}</span>
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center text-muted-foreground/50 [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0">
              {actionIcon ?? <ArrowUpRightIcon />}
            </div>
          </div>

          <p className="w-full text-lg font-normal leading-7 tracking-[-0.18px] text-foreground">
            {title}
          </p>
        </div>
      </div>
    </FrameCard>
  );
}
