import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";
import { useSocialCard } from "@/features/Reports/components/social-card/hooks/use-social-card";

export function SocialCard({
  actionIcon,
  avatarAlt,
  avatarFallback,
  avatarSrc,
  badge,
  badgeIcon,
  badgeLabel = "Competitor",
  badgeVariant = "warning",
  className,
  icon,
  metaLabel = "LinkedIn",
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
  const fallbackLabel = avatarFallback ?? icon ?? name.slice(0, 1).toUpperCase();

  return (
    <FrameCard
      className={cn(
        "w-full max-w-[24.875rem] cursor-pointer transition-colors [@media(any-hover:hover)]:hover:bg-primary-foreground",
        className,
      )}
      withFill={withFill}
    >
      <FrameCardContent className="h-fit flex-none gap-0 p-5 shadow-none before:shadow-none">
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

      <div className="relative isolate flex w-full flex-col gap-0.5 overflow-clip rounded-xl p-2">
        <div className="flex w-full flex-col gap-4 px-2 py-2">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1">
              <Avatar className="size-9 bg-muted text-muted-foreground">
                {avatarSrc ? (
                  <AvatarImage alt={avatarAlt || `${name} avatar`} src={avatarSrc} />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0">
                  {fallbackLabel}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-col justify-center">
                <p className="truncate text-xs leading-4 tracking-[0.12px] text-muted-foreground">
                  {metaLabel}
                </p>
                <p
                  className={cn(
                    "truncate text-sm font-normal leading-5",
                    card.nameClassName,
                  )}
                >
                  {name}
                </p>
              </div>
            </div>

            {card.badge || actionIcon ? (
              <div className="flex shrink-0 items-center gap-2">
                {card.badge ? (
                  <Badge
                    className="shrink-0"
                    variant={card.badge.variant ?? badgeVariant}
                  >
                    {card.badge.icon}
                    <span>{card.badge.label}</span>
                  </Badge>
                ) : null}

                {actionIcon ? (
                  <div className="flex items-center justify-center text-muted-foreground/50 [&_img]:size-4 [&_img]:shrink-0 [&_svg]:size-4 [&_svg]:shrink-0">
                    {actionIcon}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <p className="w-full text-lg font-normal leading-7 tracking-[-0.18px] text-foreground [text-wrap:pretty]">
            {title}
          </p>
        </div>
      </div>
    </FrameCard>
  );
}
