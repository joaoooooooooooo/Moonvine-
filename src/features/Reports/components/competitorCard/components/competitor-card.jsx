import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportBadge } from "@/features/Reports/components/reportBadge";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { HighlightNumber } from "@/features/Reports/components/highlightNumber/highlightNumber";
import { cn } from "@/lib/utils";

const defaultHighlights = [
  { description: "65 organic keywords", value: "65" },
  { description: "26 estimated organic traffic", value: "26" },
  { description: "Paid keywords", value: "00" },
  { description: "Estimated paid traffic", value: "0" },
  { description: "Estimated paid spend", value: "$0" },
];

function CompetitorIdentity({ avatarAlt, avatarFallback, avatarSrc, name, website }) {
  const fallback = avatarFallback ?? name.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-[2.125rem] shrink-0 rounded-sm bg-muted text-xs text-muted-foreground">
        {avatarSrc ? (
          <AvatarImage alt={avatarAlt ?? `${name} logo`} src={avatarSrc} />
        ) : null}
        <AvatarFallback className="rounded-sm">{fallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-lg/7 font-normal tracking-[-0.18px] text-foreground">
          {name}
        </p>
        <p className="truncate text-xs/4 font-normal tracking-[0.12px] text-muted-foreground">
          {website}
        </p>
      </div>
    </div>
  );
}

export function CompetitorCard({
  avatarAlt,
  avatarFallback,
  avatarSrc,
  className,
  description =
    "65 organic keywords, 26 estimated organic traffic, 0 paid keywords, 0 estimated paid traffic, $0 estimated paid spend",
  highlights = defaultHighlights,
  name = "Hlabs",
  variant = "text",
  website = "hlabs.co.uk",
}) {
  const hasHighlights = variant === "highlights";

  return (
    <FrameCard
      className={cn(
        "w-full inset-shadow-[0_1px_--theme(--color-competitor/20%)] dark:inset-shadow-[0_1px_--theme(--color-competitor/28%)]",
        !hasHighlights && "max-w-[14.5625rem]",
        className,
      )}
      withFill
    >
      {hasHighlights ? (
        <div className="flex w-full flex-wrap items-start justify-between gap-3 p-2">
          <CompetitorIdentity
            avatarAlt={avatarAlt}
            avatarFallback={avatarFallback}
            avatarSrc={avatarSrc}
            name={name}
            website={website}
          />
          <ReportBadge segment="competitor" />
        </div>
      ) : null}

      <FrameCardContent className="p-4">
        {hasHighlights ? (
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] items-start gap-4">
            {highlights.map((highlight) => (
              <div className="contents" key={`${highlight.value}-${highlight.description}`}>
                <HighlightNumber
                  className="w-auto min-w-0 flex-1 [&_[data-slot=separator]]:hidden"
                  description={highlight.description}
                  value={highlight.value}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-start gap-7">
            <ReportBadge segment="competitor" />
            <CompetitorIdentity
              avatarAlt={avatarAlt}
              avatarFallback={avatarFallback}
              avatarSrc={avatarSrc}
              name={name}
              website={website}
            />
            <p className="text-base/6 font-normal text-foreground">
              {description}
            </p>
          </div>
        )}
      </FrameCardContent>
    </FrameCard>
  );
}
