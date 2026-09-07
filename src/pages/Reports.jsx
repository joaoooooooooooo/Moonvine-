import { IntroSection } from "@/features/Reports/sections/Intro Section";
import { ReportProvider } from "@/features/Reports/context";
import { reportMock } from "@/features/Reports/report.mock";
import { SiteCheckCard } from "@/features/Reports/components/siteCheckCard";
import { QuestionsAsked } from "@/features/Reports/components/questionsAsked";
import { sampleQuestions } from "@/features/Reports/components/questionsAsked/sample-questions";
import { NewsCard } from "@/features/Reports/components/newsCard";
import { useEffect, useMemo, useState } from "react";
import { SideLineBackground } from "@/components/ui/line-background";
import { ActionCard } from "@/features/Reports/components/actionItem";
import { CompetitorCard } from "@/features/Reports/components/competitorCard";
import { EntitySegment } from "@/features/Reports/components/entitySegment";
import { HighlightNumber } from "@/features/Reports/components/highlightNumber/highlightNumber";
import { ReportsMultiSeriesLineChart } from "@/features/Reports/components/line";
import { ReportNav } from "@/features/Reports/components/nav";
import { NextStepsIntro } from "@/features/Reports/components/nextStepsIntro";
import { ReportHeading } from "@/features/Reports/components/reportHeading/reportHeading";
import { ReportContact } from "@/features/Reports/components/reportContact/reportContact";
import { RankEntities } from "@/features/Reports/components/rankEntities";
import { ReportSection } from "@/features/Reports/components/reportSection/components/reportSection";
import { SocialCard } from "@/features/Reports/components/social-card";
import { SiteStatCard } from "@/features/Reports/components/siteStatCard";
import { SourceCard } from "@/features/Reports/components/sourceCard";
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
      title: "Product pages gain visibility",
      description: "Competitor visibility increased around product landing pages.",
      variant: "competitor",
    },
    {
      badge: "Competitor",
      icon: <EyeIcon />,
      metaLabel: "LinkedIn",
      name: "Superside",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Campaign work in the spotlight",
      description: "Superside published another high-visibility post around campaign work.",
      variant: "competitor",
    },
    {
      badge: "Competitor",
      icon: <EyeIcon />,
      metaLabel: "LinkedIn",
      name: "Superside",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Creative production draws interest",
      description: "Engagement clustered around Superside's creative production positioning.",
      variant: "competitor",
    },
  ],
  you: [
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "From concept to Webflow",
      description: "Blank canvas to a fully built Webflow site.",
      variant: "default",
    },
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "Steady interest in product work",
      description: "Apta Agency shared another product-focused post with steady engagement.",
      variant: "default",
    },
    {
      icon: <CalendarIcon />,
      metaLabel: "LinkedIn",
      name: "Apta Agency",
      thumbnailSrc: "https://www.figma.com/api/mcp/asset/2c3fdb3f-23e5-4c05-bb02-3e76dee071cc.png",
      title: "A consistent design story",
      description: "The week's owned updates stayed consistent across design and development themes.",
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

const sourceCards = [
  {
    avatarSrc: "/source-card-overlay.png",
    description: "apta.agency",
    name: "Website",
    status: "connected",
  },
  {
    avatarFallback: "GA",
    description: "Traffic and engagement",
    name: "Google Analytics",
    status: "connected",
  },
  {
    avatarFallback: "SC",
    description: "Search performance",
    name: "Search Console",
    status: "connected",
  },
  {
    avatarFallback: "LI",
    description: "Company activity",
    name: "LinkedIn",
    status: "watching",
  },
  {
    avatarFallback: "IG",
    description: "Social activity",
    name: "Instagram",
    status: "watching",
  },
  {
    avatarFallback: "YT",
    description: "Channel updates",
    name: "YouTube",
    status: "watching",
  },
  {
    avatarFallback: "HS",
    description: "Contact activity",
    name: "HubSpot",
    status: "not-connected",
  },
  {
    avatarFallback: "AD",
    description: "Campaign performance",
    name: "Google Ads",
    status: "not-connected",
  },
];

const citationRankItems = [
  { label: "superside.com", value: 32 },
  { label: "curio.digital", value: 24 },
  { label: "designstudio.com", value: 15 },
  { label: "brandfuel.co", value: 9 },
];

const siteStatCards = [
  {
    "id": "performance",
    "title": "Performance",
    "score": 31,
    "description": "How quickly the page loads and responds to user interactions."
  },
  {
    "id": "accessibility",
    "title": "Accessibility",
    "score": 56,
    "description": "How well the page passes automated accessibility checks."
  },
  {
    "id": "best-practices",
    "title": "Best Practices",
    "score": 73,
    "description": "How well the page follows web security and development best practices."
  },
  {
    "id": "seo",
    "title": "SEO",
    "score": 95,
    "description": "How well the page follows basic search engine optimization practices."
  }
];

const fixTasks = [
  {
    description: "Add an llms.txt file linking AI crawlers to your key public pages.",
    fixPrompt:
      "Create a concise llms.txt file for this website. Link to the key services, important articles, about page, and any public information that best explains the organization.",
    meta: "Sitewide check ? Standard location",
    scopeNote: "This is a sitewide check, not a page-specific crawl finding.",
    priority: "high",
    title: "LLMs file not detected",
  },
  {
    description: "Review robots.txt to allow crawler access and point to the sitemap.",
    fixPrompt:
      "Audit and correct robots.txt for this website. Allow the intended public pages, confirm the sitemap location, and avoid blocking important crawler access.",
    meta: "Sitewide check ? Standard location",
    scopeNote: "This is a sitewide check, not a page-specific crawl finding.",
    title: "Robots file needs attention",
  },
  {
    description: "Add FAQs to key pages with real buyer questions and clear answers.",
    fixPrompt:
      "Add a concise visible FAQ section to the relevant service pages. Use real buyer questions about fit, timing, process, and next steps, with clear answers on the page.",
    meta: "Priority public pages",
    title: "Visible FAQs not detected",
  },
  {
    description: "Add valid JSON-LD describing your organization and key page content.",
    fixPrompt:
      "Add valid JSON-LD schema to key public pages. Include the Organization and applicable WebPage, Service, Article, Person, BreadcrumbList, and FAQPage types.",
    meta: "Priority public pages",
    title: "Structured data not detected",
  },
  {
    description: "Write unique meta descriptions that explain each page?s value and audience.",
    fixPrompt:
      "Write unique, specific meta descriptions for the affected pages. State the page value and audience in plain language and keep each description useful in search results.",
    meta: "26 affected pages",
    title: "Duplicate meta descriptions",
  },
  {
    description: "Replace duplicate title tags with unique, relevant page titles.",
    fixPrompt:
      "Audit duplicate title tags across the affected pages. Identify the shared template or page-copy cause, create unique titles, and verify the issue is resolved.",
    meta: "12 affected pages",
    title: "Duplicate title tag",
  },
  {
    description: "Fix broken internal links by updating URLs or removing obsolete links.",
    fixPrompt:
      "Find broken internal links on the affected pages. Update each link to a relevant live URL, restore the intended destination where appropriate, or remove obsolete links. Verify that the updated destinations load successfully.",
    meta: "2 affected pages",
    title: "Broken internal links",
  },
  {
    description: "Add useful visible copy and reduce unnecessary markup.",
    fixPrompt:
      "Improve pages with a low text-to-HTML ratio. Add useful visible copy that explains the page topic and reduce unnecessary template or markup clutter where possible.",
    meta: "50 affected pages",
    title: "Low text to HTML ratio",
  },
  {
    description: "Add one clear H1 that describes each page?s main topic.",
    fixPrompt:
      "Add one clear, descriptive H1 to each affected page. Make it accurately state the primary page topic and align it with the visible content.",
    meta: "30 affected pages",
    title: "Missing H1",
  },
  {
    description: "Expand thin pages with service details, proof, and a clear next step.",
    fixPrompt:
      "Expand low-word-count pages with clear, useful copy about the service, intended audience, use cases, proof points, and the next step a reader can take.",
    meta: "15 affected pages",
    title: "Low word count",
  },
  {
    description: "Keep one primary H1 and change the rest to H2 or H3 headings.",
    fixPrompt:
      "Audit pages with multiple H1 tags. Keep one clear H1 that defines the page topic, then change additional H1s to suitable H2 or H3 headings.",
    meta: "5 affected pages",
    title: "Multiple H1 tags",
  },
];

const nextStepIntroSections = [
  {
    artboard: "Artboard",
    description:
      "Start with the LinkedIn post. It led Apta Agency's activity this week. Competitor activity was visible too, especially Superside and Curio Digital.",
    id: "next-steps-intro",
    title: "Here is the nexts steps for apta agency",
  },
  {
    artboard: "Artboard 2",
    description:
      "These are website fixes that make important pages easier for search engines, AI systems, and buyers to understand.",
    id: "onsite-search-ai-visibility",
    title: "Onsite search and AI visibility",
  },
  {
    artboard: "Artboard 3",
    badge: "How to read this",
    badgeVariant: "secondary",
    description:
      "High-priority problems are the most urgent. Warnings and notices are less severe, but they can still affect accessibility, search visibility, or site quality. The rows below group those findings into practical fixes.",
    id: "site-check-found",
    title: "What the site check found",
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
    <ReportProvider value={reportMock.context}>
    <main className="relative h-svh overflow-x-hidden overflow-y-auto pt-16">
      <SideLineBackground contentWidth="80rem" variant="medium" />
      <ReportNav />
      <IntroSection data={reportMock.intro} reportUrl={window.location.href} />
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
      <ReportSection id="source-connections">
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-[28rem]"
            description="The sources that power this report, including active integrations and channels we are watching."
            size="medium"
            title="Source connections"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {sourceCards.map((source) => (
              <SourceCard {...source} key={source.name} />
            ))}
          </div>
        </div>
      </ReportSection>
      <ReportSection id="competitor-overview">
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-[28rem]"
            description="A compact competitor summary and the expanded search-performance view."
            size="medium"
            title="Competitor overview"
          />
          <div className="flex flex-col items-start gap-3">
            <CompetitorCard
              avatarFallback="HL"
              name="Hlabs"
              website="hlabs.co.uk"
            />
            <CompetitorCard
              avatarFallback="HL"
              name="Hlabs"
              variant="highlights"
              website="hlabs.co.uk"
            />
          </div>
        </div>
      </ReportSection>
      <ReportSection id="citation-rankings">
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-[30rem]"
            description="Competitors ranked by the citations they received in tracked answers. Fill length reflects each source's share of 80 total citations."
            size="medium"
            title="Citation rankings"
          />
          <RankEntities
            className="max-w-[27.5rem]"
            items={citationRankItems}
            maxValue={80}
          />
        </div>
      </ReportSection>
      <ReportSection id="website-performance">
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-[30rem]"
            description="A focused PageSpeed metric with a score-linked semicircle progress indicator."
            size="medium"
            title="Website performance"
          />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {siteStatCards.map((stat) => (
              <SiteStatCard
                {...stat}
                className="max-w-none"
                key={stat.score}
              />
            ))}
          </div>
        </div>
      </ReportSection>
      <ReportSection id="site-checks">
        <div className="flex flex-col gap-8">
          <ReportHeading
            align="left"
            badge={null}
            title="Website checks"
            description="A snapshot of the files and on-page content checked in this sample."
          />
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SiteCheckCard
              title="LLMs file"
              status="missing"
              description="No llms.txt file was found at https://apta.agency/llms.txt. This file can guide AI tools to useful public content."
            />
            <SiteCheckCard
              title="Robots file"
              status="good"
              description="The check found robots.txt and a sitemap reference."
            />
            <SiteCheckCard
              title="Visible FAQs"
              status="missing"
              description="No visible FAQ sections were detected on the 25 public pages in the sitemap sample."
            />
            <SiteCheckCard
              title="Structured data"
              status="missing"
              description="Structured data was not detected on the public pages in the sitemap sample."
            />
          </div>
        </div>
      </ReportSection>
      <ReportSection id="test-results">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ReportHeading
            badge="How to read this test"
            badgeVariant="secondary"
            className="max-w-[24rem]"
            description="A neutral category answer asks about campaign creative without naming Apta Agency. We use those answers to measure organic discovery, rather than whether AI can confirm a firm the person already knows."
            size="large"
            title="We asked the questions someone asks before they know Apta Agency by name."
          />
          <div className="flex h-full flex-col gap-8">
            <ReportHeading
              className="max-w-[21rem]"
              description={null}
              label="bad"
              size="medium"
              title={
                <>
                  Apta Agency appeared in <span className="text-red-400">0 of 75</span>{" "}
                  neutral category answers.
                </>
              }
            />
            <div className="mt-auto flex items-start">
              <HighlightNumber
                className="w-auto min-w-0 flex-1"
                description="Answers that did not name Apta Agency"
                value="75"
              />
              <HighlightNumber
                className="w-auto min-w-0 flex-1"
                description="Answers that did not name Apta Agency"
                value="75"
              />
            </div>
          </div>
        </div>
      </ReportSection>
      <ReportSection id="questions-asked">
        <div className="flex flex-col gap-8">
          <ReportHeading align="left" badge="The sample" title="Questions asked" description="Explore the questions by type. Select one or more types to narrow the sample." />
          <QuestionsAsked questions={sampleQuestions} />
        </div>
      </ReportSection>
      <ReportSection id="social-performance">
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="left"
            badge={null}
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
          <div className="grid auto-rows-fr items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                description={card.description}
                variant={card.variant}
              />
            ))}
          </div>
        </div>
      </ReportSection>
      <ReportSection id="news">
        <div className="flex flex-col gap-12">
          <ReportHeading
            align="left"
            badge={null}
            title="News and articles"
            description="Updates and ideas worth your attention."
          />
          <NewsCard
            className="max-w-md"
            title="Get your next campaign ready"
            takeaway="Start with a clear offer and audience. Use an existing page if it already gives visitors what they need to act."
            source={{ label: "OpenAI" }}
          />
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
      {nextStepIntroSections.map((section) => (
        <ReportSection
          contentContainerClassName="!py-0 md:!py-0 xl:!py-0"
          id={section.id}
          innerClassName="md:!px-0 xl:!px-0"
          key={section.id}
        >
          <NextStepsIntro
            ariaLabel={`${section.title} animation`}
            artboard={section.artboard}
          >
            <div className="w-full md:px-10 xl:px-[10.5rem]">
              <ReportHeading
                align="left"
                badge={section.badge ?? null}
                badgeVariant={section.badgeVariant}
                className="max-w-[28rem]"
                description={section.description}
                title={section.title}
              />
            </div>
          </NextStepsIntro>
        </ReportSection>
      ))}
      <ReportSection id="recommended-actions">
        <div className="flex flex-col gap-12">
          <ReportHeading
            badge={null}
            className="max-w-[24rem]"
            description="Priority fixes and opportunities pulled into a compact action queue for the week."
            title="What to do next"
          />
          <div className="grid items-stretch gap-3">
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
            badge={null}
            className="max-w-[32rem]"
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
      <ReportContact />
    </main>
    </ReportProvider>
  );
}
