"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcherDropdown } from "@/components/navigation/avatar-menu";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { ReportBreadcrumb } from "@/features/Reports/components/nav/components/report-breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/features/Reports/components/nav/components/nav-tabs";
import { cn } from "@/lib/utils";

const reportNavItems = [
  { label: "Overview", value: "report-overview" },
  { label: "This week", value: "weekly-overview" },
  { label: "Social", value: "social-performance" },
  { label: "Market", value: "market-activity" },
  { label: "Visibility", value: "ai-visibility" },
  { label: "Actions", value: "recommended-actions" },
];

export function ReportNav({
  avatarAlt,
  avatarFallback,
  avatarSrc,
  className,
  companyName,
  reportLabel,
}) {
  const [activeSection, setActiveSection] = useState(reportNavItems[0].value);

  useEffect(() => {
    const scrollRoot = document.querySelector("main");
    if (!scrollRoot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { root: scrollRoot, rootMargin: "-64px 0px -50%", threshold: 0 },
    );

    for (const item of reportNavItems) {
      const section = document.getElementById(item.value);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleSectionChange = (value) => {
    setActiveSection(value);
    const section = document.getElementById(value);
    if (!section) return;

    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

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
              <nav aria-label="Report sections" className="hidden h-full lg:block">
                <Tabs
                  className="h-full"
                  onValueChange={handleSectionChange}
                  value={activeSection}
                  variant="underline"
                >
                  <TabsList className="h-full gap-0 border-b-0">
                    {reportNavItems.map((item) => (
                      <TabsTrigger className="h-full px-3 py-0" key={item.value} value={item.value}>
                        {item.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </nav>

              <div className="ml-auto flex min-w-0 items-center gap-3">
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
      </div>
    </header>
  );
}
