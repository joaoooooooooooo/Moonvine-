import { Separator } from "@/components/ui/separator";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { cn } from "@/lib/utils";

export function ReportSection({
  children,
  className,
  contentClassName,
  contentContainerClassName,
  id,
  innerClassName,
  showTopDivider = false,
  showBottomDivider = true,
}) {
  return (
    <section className={cn("relative scroll-mt-16", className)} id={id}>
      {showTopDivider ? <FullWidthDivider position="top" /> : null}
      {showBottomDivider ? <FullWidthDivider position="bottom" /> : null}

      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-4 md:px-6">
        <Separator
          aria-hidden="true"
          className="absolute inset-y-0 left-4 h-full md:left-6"
          orientation="vertical"
        />
        <Separator
          aria-hidden="true"
          className="absolute inset-y-0 right-4 h-full md:right-6"
          orientation="vertical"
        />
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 xl:py-28",
          contentContainerClassName,
        )}
      >
        <div
          className={cn(
            "w-full px-0 md:px-10 xl:px-[10.5rem]",
            innerClassName,
          )}
        >
          <div className={cn("w-full", contentClassName)}>{children}</div>
        </div>
      </div>
    </section>
  );
}
