"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeSwitcherDropdown } from "@/components/navigation/avatar-menu";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { Tabs, TabsList, TabsTrigger } from "@/features/Reports/components/nav/components/nav-tabs";
import { cn } from "@/lib/utils";

const reportNavItems = [
  { label: "Overview", value: "report-overview" },
  { label: "This week", value: "weekly-overview" },
  { label: "Questions", value: "questions-asked" },
  { label: "Social", value: "social-performance" },
  { label: "Market", value: "market-activity" },
  { label: "News", value: "news" },
  { label: "Visibility", value: "ai-visibility" },
  { label: "Actions", value: "recommended-actions" },
];

export function ReportNav({ className, items = reportNavItems }) {
  const headerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(items[0]?.value);

  useEffect(() => {
    const scrollRoot = headerRef.current?.closest("main");
    if (!scrollRoot) return;
    let frame;
    const update = () => {
      const top = scrollRoot.getBoundingClientRect().top + 80;
      let current = items[0]?.value;
      for (const item of items) {
        const section = document.getElementById(item.value);
        if (section && section.getBoundingClientRect().top <= top) current = item.value;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      scrollRoot.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

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
              <nav aria-label="Report sections" className="h-full min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Tabs
                  className="flex h-full w-max"
                  onValueChange={handleSectionChange}
                  value={activeSection}
                  variant="underline"
                >
                  <TabsList className="flex h-full gap-0 border-b-0">
                    {items.map((item) => (
                      <TabsTrigger className="mb-0 h-full px-3 py-0" indicatorClassName="bottom-0" key={item.value} value={item.value}>
                        {item.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-3">
                <ThemeSwitcherDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
