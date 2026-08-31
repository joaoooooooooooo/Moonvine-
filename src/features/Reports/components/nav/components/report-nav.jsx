import { ThemeSwitcherDropdown } from "@/components/navigation/avatar-menu";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { ReportBreadcrumb } from "@/features/Reports/components/nav/components/report-breadcrumb";
import { cn } from "@/lib/utils";

export function ReportNav({
  avatarAlt,
  avatarFallback,
  avatarSrc,
  className,
  companyName,
  reportLabel,
}) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 bg-background",
        className,
      )}
      >
      <div className="relative">
        <FullWidthDivider position="bottom" />

        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="w-full px-0 md:px-10 xl:px-[10.5rem]">
            <div className="flex h-16 w-full items-center justify-between gap-4">
              <ReportBreadcrumb
                avatarAlt={avatarAlt}
                avatarFallback={avatarFallback}
                avatarSrc={avatarSrc}
                companyName={companyName}
                reportLabel={reportLabel}
              />
              <ThemeSwitcherDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
