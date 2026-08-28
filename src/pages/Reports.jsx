import { useEffect } from "react";
import { ThemeSwitcherDropdown } from "@/components/navigation/avatar-menu";
import { CopyButton } from "@/components/shared/copy-button";
import { SideLineBackground } from "@/components/ui/line-background";
import { ReportsMultiSeriesLineChart } from "@/features/Reports/components/line";
import { ReportHeading } from "@/features/Reports/components/reportHeading/reportHeading";
import { Metric1 } from "@/features/Reports/components/metric1";
import { ReportSection } from "@/features/Reports/components/reportSection/reportSection";
import { SocialCard } from "@/features/Reports/components/social-card";
import { StatusListCard } from "@/features/Reports/components/status-list";
import { CalendarIcon, EyeIcon, NewspaperIcon } from "lucide-react";

const statusListItems = [
  { label: "Client social", badge: "7 Posts", variant: "info" },
  { label: "Competitors", badge: null, variant: "default" },
  { label: "AI answers", badge: null, variant: "default" },
  { label: "News", badge: "4 news signals", variant: "info" },
  { label: "Technical checks", badge: "23 issues", variant: "warning" },
  { label: "Search Competitors", badge: "No Overlap", variant: "success" },
  { label: "Google Analytics", badge: "Not Connect", variant: "disabled" },
  { label: "Search Console", badge: "Not Connect", variant: "disabled" },
];

const socialCards = [
  {
    icon: <CalendarIcon />,
    name: "Apta Agency",
    thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
    title: "Blank canvas to a fully built Webflow site.",
    variant: "default",
  },
  {
    badge: "Competitor",
    icon: <EyeIcon />,
    name: "Superside",
    thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
    title: "Competitor visibility increased around product landing pages.",
    variant: "badge",
  },
  {
    badge: "News",
    badgeVariant: "info",
    icon: <NewspaperIcon />,
    name: "Market signal",
    thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
    title: "Industry coverage added more context to this week's movement.",
    variant: "badge",
  },
];

export function Reports() {
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <main className="relative h-svh overflow-x-hidden overflow-y-auto">
      <SideLineBackground contentWidth="80rem" variant="medium" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-4 pt-4 md:px-6 md:pt-6">
        <ThemeSwitcherDropdown />
      </div>
      <ReportSection>
        <div className="flex flex-col gap-12 xl:grid xl:grid-cols-[minmax(0,26.5rem)_auto] xl:items-start xl:justify-between xl:gap-16">
          <ReportHeading
            afterDescription={<CopyButton label="Copy report link" />}
            align="left"
            className="max-w-[26.5rem]"
          />
          <Metric1 align="right" className="xl:justify-self-end" />
        </div>
      </ReportSection>
      <ReportSection>
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-lg"
            description="The LinkedIn post was Apta Agency's most visible owned update this week. Competitor activity was visible too, led by Superside and Curio Digital."
            title="What's covered this week."
          />
          <div className="grid gap-3 lg:grid-cols-2">
          <StatusListCard items={statusListItems} title="Signals" />
          <StatusListCard items={statusListItems} title="Signals" withFill />
          </div>
        </div>
      </ReportSection>
      <ReportSection>
        <div className="flex flex-col gap-12 xl:grid xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] xl:items-start xl:gap-16">
          <ReportHeading
            align="left"
            badge={null}
            className="max-w-[21rem]"
            description={null}
            title="Weekly interactions with the client's social posts stayed close to the recent baseline."
          />
          <ReportsMultiSeriesLineChart />
        </div>
      </ReportSection>
      <ReportSection>
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="left"
            badge={null}
            className="max-w-[24rem]"
            description="Competitor, watch-list, news, and search-neighbor signals that help explain the surrounding market."
            title="What happened around you"
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {socialCards.map((card) => (
              <SocialCard
                badge={card.badge}
                badgeVariant={card.badgeVariant}
                icon={card.icon}
                key={`${card.name}-${card.title}`}
                name={card.name}
                thumbnailSrc={card.thumbnailSrc}
                title={card.title}
                variant={card.variant}
              />
            ))}
          </div>
        </div>
      </ReportSection>
    </main>
  );
}
