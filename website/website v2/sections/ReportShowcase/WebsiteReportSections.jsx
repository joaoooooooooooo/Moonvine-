import { CopyButton } from '../../../../src/components/shared/copy-button'
import { ReportBreadcrumb } from '../../../../src/features/Reports/components/nav/components/report-breadcrumb'
import { ReportSection } from '../../../../src/features/Reports/components/reportSection/components/reportSection'
import { ReportHeading } from '../../../../src/features/Reports/components/reportHeading/reportHeading'
import { Metric1 } from '../../../../src/features/Reports/components/metric1'
import { ActionCard } from '../../../../src/features/Reports/components/actionItem'
import { useReportCompany, useReportContext } from '../../../../src/features/Reports/context'
import { SearchCompetitors } from '../../../../src/features/Reports/sections/Overview Section/components/search-competitors'
import { SocialWatch } from '../../../../src/features/Reports/sections/Overview Section/components/social-watch'
import { OverviewNews } from '../../../../src/features/Reports/sections/Overview Section/components/overview-news'
import { SocialInteractions } from '../../../../src/features/Reports/sections/Overview Section/components/social-interactions'
import { AiTestResults } from '../../../../src/features/Reports/sections/AI Visibility Section/components/ai-test-results'
import { CitationRankings } from '../../../../src/features/Reports/sections/AI Visibility Section/components/citation-rankings'
import { AiQuestions } from '../../../../src/features/Reports/sections/AI Visibility Section/components/ai-questions'
import { VisibilityDistribution } from '../../../../src/features/Reports/sections/AI Visibility Section/components/visibility-distribution'
import { AuditSummary } from '../../../../src/features/Reports/sections/Website Audit Section/components/audit-summary'
import { AuditIssues } from '../../../../src/features/Reports/sections/Website Audit Section/components/audit-issues'

function PreviewHeading({ badge, title, description }) {
  return <div className="relative w-full px-6 py-12 md:px-10 xl:px-[10.5rem]"><ReportHeading variant="intro" align="left" badge={badge} title={title} description={description} /></div>
}

export function IntroSection({ data, reportUrl, id = 'report-overview' }) {
  const company = useReportCompany()
  const { period, locale } = useReportContext()
  const reportLabel = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(period.end))
  return <ReportSection variant="main" showBottomDivider id={id}>
    <ReportBreadcrumb avatarFallback={company.avatarFallback ?? company.name.slice(0, 2).toUpperCase()} avatarSrc={company.avatarUrl} className="mb-8 w-fit max-w-full" companyName={company.name} reportLabel={reportLabel} />
    <div className="min-h-[28rem] md:min-h-[31rem]"><div className="flex flex-col gap-12 xl:grid xl:grid-cols-[minmax(0,30rem)_auto] xl:items-start xl:justify-between xl:gap-16">
      <ReportHeading variant="intro" titleClassName="text-5xl/13" afterDescription={reportUrl ? <CopyButton label="Copy report link" text={reportUrl} /> : null} title={data.title} description={data.description} align="left" badge={null} className="max-w-[30rem]" />
      {data.metric && <Metric1 align="left" className="self-start xl:justify-self-end" value={data.metric.value} label={data.metric.label} prefix={data.metric.prefix} suffix={data.metric.suffix} comparisonBadgeLabel={data.metric.comparison?.label ?? data.metric.status?.label ?? ''} comparisonText={data.metric.comparison?.text ?? ''} comparisonBadgeVariant={(data.metric.comparison?.sentiment ?? data.metric.status?.sentiment) === 'positive' ? 'success' : (data.metric.comparison?.sentiment ?? data.metric.status?.sentiment) === 'negative' ? 'error' : data.metric.status?.sentiment === 'warning' ? 'warning' : 'secondary'} />}
    </div></div>
  </ReportSection>
}

export function OverviewSection({ data, id = 'report-market-overview' }) {
  return <ReportSection variant="main" id={id} contentContainerClassName="!py-0" innerClassName="md:!px-0 xl:!px-0">
    <PreviewHeading badge={data.badge} title={data.title} description={data.description} />
    <div className="flex flex-col gap-12 pb-16 md:px-10 md:pb-20 xl:px-[10.5rem] xl:pb-28"><SearchCompetitors results={data.searchCompetitors} /><SocialWatch data={data.socialWatch} /><OverviewNews data={data.news} />{data.interactions && <SocialInteractions data={data.interactions} />}</div>
  </ReportSection>
}

export function AiVisibilitySection({ data, id = 'report-ai-visibility' }) {
  const company = useReportCompany()
  return <ReportSection variant="main" id={id} contentContainerClassName="!py-0" innerClassName="md:!px-0 xl:!px-0">
    <PreviewHeading badge={data.badge} title={data.title} description={`We asked the AI systems category questions a prospective client might ask before they know ${company.name} by name.`} />
    <div className="flex flex-col gap-16 pb-16 md:px-10 md:pb-20 xl:px-[10.5rem] xl:pb-28"><AiTestResults data={data.test} /><CitationRankings citations={data.citations} /><AiQuestions questions={data.questions} />{data.distribution && <VisibilityDistribution views={data.distribution} />}</div>
  </ReportSection>
}

export function WebsiteAuditSection({ data, id = 'report-website-audit' }) {
  return <ReportSection variant="main" id={id} contentContainerClassName="!py-0" innerClassName="md:!px-0 xl:!px-0">
    <PreviewHeading badge={data.badge} title={data.title} description={data.description} />
    <div className="flex flex-col gap-16 pb-16 md:px-10 md:pb-20 xl:px-[10.5rem] xl:pb-28"><AuditSummary data={data} /><AuditIssues data={data} /></div>
  </ReportSection>
}

export function WebsiteNextStepsSection({ data }) {
  const company = useReportCompany()
  return <ReportSection variant="main" id="report-next-steps" contentContainerClassName="!py-0" innerClassName="md:!px-0 xl:!px-0">
    <PreviewHeading badge={null} title={data.title.replaceAll('{company}', company.name)} description={data.description.replaceAll('{company}', company.name)} />
    <div className="pb-16 md:px-10 md:pb-20 xl:px-[10.5rem] xl:pb-28"><ReportSection variant="subsection">{data.actions.length === 0 && <p className="text-sm text-muted-foreground">No next steps are included in this report yet.</p>}<div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">{data.actions.map(({ id, ...action }) => <ActionCard key={id} {...action} />)}</div></ReportSection></div>
  </ReportSection>
}
