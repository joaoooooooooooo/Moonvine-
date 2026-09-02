import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { SideLineBackground } from "@/components/ui/line-background";
import { ActionCard } from "@/features/Reports/components/actionItem";
import { EntitySegment } from "@/features/Reports/components/entitySegment";
import { ReportsMultiSeriesLineChart } from "@/features/Reports/components/line";
import { ReportNav } from "@/features/Reports/components/nav";
import { NextStepsDivider } from "@/features/Reports/components/nextStepsDivider";
import { ReportHeading } from "@/features/Reports/components/reportHeading/reportHeading";
import { Metric1 } from "@/features/Reports/components/metric1";
import { ReportSection } from "@/features/Reports/components/reportSection/components/reportSection";
import { SocialCard } from "@/features/Reports/components/social-card";
import { StatusListCard } from "@/features/Reports/components/status-list";
import { TaskCard } from "@/features/Reports/components/taskCard/taskCard";
import { CalendarIcon, EyeIcon } from "lucide-react";

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

const socialCardsByEntity = {
  competitor: [
    {
      badge: "Competitor",
      icon: <EyeIcon />,
      metaLabel: "LinkedIn",
      name: "Superside",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Competitor visibility increased around product landing pages.",
      variant: "competitor",
    },
    {
      badge: "Competitor",
      icon: <EyeIcon />,
      metaLabel: "LinkedIn",
      name: "Superside",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Superside published another high-visibility post around campaign work.",
      variant: "competitor",
    },
    {
      badge: "Competitor",
      icon: <EyeIcon />,
      metaLabel: "LinkedIn",
      name: "Superside",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Engagement clustered around Superside's creative production positioning.",
      variant: "competitor",
    },
  ],
  you: [
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Blank canvas to a fully built Webflow site.",
      variant: "default",
    },
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Apta Agency shared another product-focused post with steady engagement.",
      variant: "default",
    },
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "The week's owned updates stayed consistent across design and development themes.",
      variant: "default",
    },
  ],
};

const actionCards = [
  {
    count: "01",
    description: "Structured data was not detected on the checked priority pages.",
    items: [
      { label: "Add llm.txt", variant: "default" },
      { label: "Review robots.txt rules", variant: "default" },
    ],
    title: "LLM.txt Missing",
  },
  {
    count: "02",
    description: "Important pages have mixed metadata quality and should be normalized this week.",
    items: [
      { label: "Rewrite homepage meta description", variant: "default" },
      { label: "Align title tags across service pages", variant: "default" },
    ],
    title: "Metadata Alignment",
  },
  {
    count: "03",
    description: "A few tracked URLs are still missing internal reinforcement from high-authority pages.",
    items: [
      { label: "Link pricing page from top nav", variant: "default" },
      { label: "Add case study cross-links", variant: "default" },
    ],
    title: "Internal Linking Gaps",
  },
  {
    count: "04",
    description: "There is room to improve entity coverage on pages already performing well in search.",
    items: [
      { label: "Add organization schema to about page", variant: "default" },
      { label: "Expand entity mentions on service pages", variant: "default" },
    ],
    title: "Entity Coverage",
  },
];

const fixTasks = [
  {
    description:
      "Create an llms.txt file that points AI crawlers to the public pages and content your organization wants surfaced.",
    fixPrompt:
      "Create a concise llms.txt file for this website. Link to the key services, important articles, about page, and any public information that best explains the organization.",
    meta: "Checked standard location",
    title: "LLMs file not detected",
  },
  {
    description:
      "Review robots.txt so search and AI crawlers can access the intended public pages and locate the sitemap.",
    fixPrompt:
      "Audit and correct robots.txt for this website. Allow the intended public pages, confirm the sitemap location, and avoid blocking important crawler access.",
    meta: "Checked standard location",
    title: "Robots file needs attention",
  },
  {
    description:
      "Add a visible FAQ section to key service or topic pages using real buyer questions and direct answers.",
    fixPrompt:
      "Add a concise visible FAQ section to the relevant service pages. Use real buyer questions about fit, timing, process, and next steps, with clear answers on the page.",
    meta: "Priority public pages",
    title: "Visible FAQs not detected",
  },
  {
    description:
      "Publish valid JSON-LD that describes the organization and the primary content types shown on key public pages.",
    fixPrompt:
      "Add valid JSON-LD schema to key public pages. Include the Organization and applicable WebPage, Service, Article, Person, BreadcrumbList, and FAQPage types.",
    meta: "Priority public pages",
    title: "Structured data not detected",
  },
  {
    description:
      "Write unique meta descriptions for affected pages so search results clearly explain the page value and intended audience.",
    fixPrompt:
      "Write unique, specific meta descriptions for the affected pages. State the page value and audience in plain language and keep each description useful in search results.",
    meta: "26 affected pages",
    title: "Duplicate meta descriptions",
  },
  {
    description:
      "Find the shared title-tag pattern across affected pages, correct it, and verify that each title is unique and relevant.",
    fixPrompt:
      "Audit duplicate title tags across the affected pages. Identify the shared template or page-copy cause, create unique titles, and verify the issue is resolved.",
    meta: "12 affected pages",
    title: "Duplicate title tag",
  },
  {
    description:
      "Strengthen internal links from relevant pages so affected URLs are easier for readers and crawlers to discover.",
    fixPrompt:
      "Add relevant internal links from stronger pages to the affected URLs. Use descriptive anchor text and connect each page to the next useful service, article, or contact route.",
    meta: "2 affected pages",
    title: "Broken internal links",
  },
  {
    description:
      "Expand thin pages with helpful visible copy and remove unnecessary template clutter that hides the main content.",
    fixPrompt:
      "Improve pages with a low text-to-HTML ratio. Add useful visible copy that explains the page topic and reduce unnecessary template or markup clutter where possible.",
    meta: "50 affected pages",
    title: "Low text to HTML ratio",
  },
  {
    description:
      "Add one clear H1 to each affected page so the topic is unambiguous for readers, search engines, and AI crawlers.",
    fixPrompt:
      "Add one clear, descriptive H1 to each affected page. Make it accurately state the primary page topic and align it with the visible content.",
    meta: "30 affected pages",
    title: "Missing h1",
  },
  {
    description:
      "Expand thin pages with direct explanations of the service, audience, use cases, and a useful next step.",
    fixPrompt:
      "Expand low-word-count pages with clear, useful copy about the service, intended audience, use cases, proof points, and the next step a reader can take.",
    meta: "15 affected pages",
    title: "Low word count",
  },
  {
    description:
      "Keep one primary H1 per page and convert additional primary headings to the appropriate lower-level heading.",
    fixPrompt:
      "Audit pages with multiple H1 tags. Keep one clear H1 that defines the page topic, then change additional H1s to suitable H2 or H3 headings.",
    meta: "5 affected pages",
    title: "Multiple h1 tags",
  },
];

export function Reports() {
  const [activeEntity, setActiveEntity] = useState("you");

  const socialCards = useMemo(
    () => socialCardsByEntity[activeEntity] ?? socialCardsByEntity.you,
    [activeEntity],
  );

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
    <main className="relative h-svh overflow-x-hidden overflow-y-auto pt-16">
      <SideLineBackground contentWidth="80rem" variant="medium" />
      <ReportNav
        avatarFallback="AA"
        companyName="Apta Agency"
        reportLabel="Aug 31 Report"
      />
      <ReportSection id="report-overview">
        <div className="flex flex-col gap-12 xl:grid xl:grid-cols-[minmax(0,26.5rem)_auto] xl:items-start xl:justify-between xl:gap-16">
          <ReportHeading
            afterDescription={<CopyButton label="Copy report link" />}
            align="left"
            className="max-w-[26.5rem]"
          />
          <Metric1 align="right" className="xl:justify-self-end" />
        </div>
      </ReportSection>
      <ReportSection id="weekly-overview">
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
      <ReportSection id="social-performance">
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
      <ReportSection id="market-activity">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <ReportHeading
              align="left"
              badge={null}
              className="max-w-[24rem]"
              description="Competitor, watch-list, news, and search-neighbor signals that help explain the surrounding market."
              title="What happened around you"
            />
            <EntitySegment
              className="self-start lg:self-end"
              onValueChange={setActiveEntity}
              value={activeEntity}
            />
          </div>
          <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
            {socialCards.map((card) => (
              <SocialCard
                avatarSrc={card.avatarSrc}
                badge={card.badge}
                badgeVariant={card.badgeVariant}
                icon={card.icon}
                key={`${card.name}-${card.title}`}
                metaLabel={card.metaLabel}
                name={card.name}
                thumbnailSrc={card.thumbnailSrc}
                title={card.title}
                variant={card.variant}
              />
            ))}
          </div>
        </div>
      </ReportSection>
      <ReportSection id="ai-visibility">
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="left"
            badge={null}
            className="max-w-[36rem]"
            description="Debug placement for the donut distribution chart component."
            title="Your AI visibility summary across sources, visibility and share of voice"
          />
          <EntitySegment
            className="w-full"
            chartViews={[
              {
                comparisonBadgeLabel: "+ 12 %",
                comparisonText: "Vs Last Week",
                data: [
                  {
                    channel: "subject",
                    label: "Apta Agency",
                    kind: "entity",
                    role: "subject",
                    value: 37,
                  },
                  {
                    channel: "superside",
                    label: "Superside",
                    kind: "entity",
                    role: "comparison",
                    value: 28,
                  },
                  {
                    channel: "curio",
                    label: "Curio Digital",
                    kind: "entity",
                    role: "comparison",
                    value: 21,
                  },
                  {
                    channel: "others",
                    kind: "others",
                    label: "Others",
                    role: "comparison",
                    value: 14,
                  },
                ],
                label: "Average across 1 daily points",
                subjectValue: "37",
                tabLabel: "Source Presence",
                value: "source-presence",
              },
              {
                comparisonBadgeLabel: "+ 8 %",
                comparisonText: "Vs Last Week",
                data: [
                  {
                    channel: "subject",
                    label: "Apta Agency",
                    kind: "entity",
                    role: "subject",
                    value: 41,
                  },
                  {
                    channel: "superside",
                    label: "Superside",
                    kind: "entity",
                    role: "comparison",
                    value: 30,
                  },
                  {
                    channel: "curio",
                    label: "Curio Digital",
                    kind: "entity",
                    role: "comparison",
                    value: 17,
                  },
                  {
                    channel: "others",
                    kind: "others",
                    label: "Others",
                    role: "comparison",
                    value: 12,
                  },
                ],
                label: "Average visibility across 1 daily points",
                subjectValue: "41",
                tabLabel: "Visibility",
                value: "visibility",
              },
              {
                comparisonBadgeLabel: "+ 19 %",
                comparisonText: "Vs Last Week",
                data: [
                  {
                    channel: "subject",
                    label: "Apta Agency",
                    kind: "entity",
                    role: "subject",
                    value: 37,
                  },
                  {
                    channel: "superside",
                    label: "Superside",
                    kind: "entity",
                    role: "comparison",
                    value: 28,
                  },
                  {
                    channel: "curio",
                    label: "Curio Digital",
                    kind: "entity",
                    role: "comparison",
                    value: 21,
                  },
                  {
                    channel: "others",
                    label: "Others",
                    kind: "others",
                    role: "comparison",
                    value: 14,
                  },
                ],
                label: "Share of voice across 1 daily points",
                subjectValue: "37",
                tabLabel: "Share of voice",
                value: "share-of-voice",
              },
            ]}
            layout="chart"
            value="you"
          />
        </div>
      </ReportSection>
      <ReportSection
        contentClassName="flex justify-center"
        contentContainerClassName="!px-0 !py-0 md:!px-0 md:!py-0 xl:!py-0"
        id="next-steps-divider"
        innerClassName="md:!px-0 xl:!px-0"
      >
        <NextStepsDivider className="!min-h-[40rem] w-full md:!min-h-[42rem] xl:!min-h-[46rem]" />
      </ReportSection>
      <ReportSection id="recommended-actions">
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="center"
            badge={null}
            className="mx-auto max-w-[24rem]"
            description="Priority fixes and opportunities pulled into a compact action queue for the week."
            title="What to do next"
          />
          <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
            {actionCards.map((card) => (
              <ActionCard
                count={card.count}
                description={card.description}
                items={card.items}
                key={card.count}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </ReportSection>
      <ReportSection id="fix-prompts">
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="center"
            badge={null}
            className="mx-auto max-w-[32rem]"
            description="Prioritized technical and content fixes from the latest site review. Copy a prompt to hand each item to the right owner."
            title="Fix prompts"
          />
          <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
            {fixTasks.map((task) => (
              <TaskCard {...task} key={task.title} />
            ))}
          </div>
        </div>
      </ReportSection>
    </main>
  );
}
