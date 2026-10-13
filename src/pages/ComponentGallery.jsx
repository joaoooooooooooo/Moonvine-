import { Globe, Search } from '@/components/ui/icons'
import { ReportProvider } from '@/features/Reports/context'
import { reportMock } from '@/features/Reports/report.mock'
import { accounts } from '@/features/observatory/_V2/data/observatory-fixtures'
import { buildLenses } from '@/features/observatory/_V2/utils/observatory-model'
import { SignalCard } from '@/features/observatory/_V2/components/signal-card'
import { MetricLineChart } from '@/features/observatory/_V2/components/search-clicks-chart'
import { MainChannelCard } from '@/features/observatory/_V2/components/analytics/main-channel-card'
import { TopPagesChart } from '@/features/observatory/_V2/components/analytics/top-pages-chart'
import { LandingPagesCard } from '@/features/observatory/_V2/components/analytics/landing-pages-card'
import { VisitorSourcesChart } from '@/features/observatory/_V2/components/analytics/visitor-sources-chart'
import { SiteStatCard as ObservatorySiteStatCard } from '@/features/observatory/_V2/components/site-health/site-stat-card'
import { SiteCheckCard as ObservatorySiteCheckCard } from '@/features/observatory/_V2/components/site-health/site-check-card'
import { SourcePresenceCard } from '@/features/observatory/_V2/components/source-presence-card'
import { WeeklyBrief } from '@/features/observatory/_V2/components/weekly-brief'
import { AiVisibilityMethod } from '@/features/observatory/_V2/components/ai-visibility/ai-visibility-method'
import { ProviderCoverage } from '@/features/observatory/_V2/components/ai-visibility/provider-coverage'
import { SignalMetric } from '@/features/observatory/_V2/components/signal-metric'
import { MetricComparison } from '@/features/observatory/_V2/components/metric-comparison'
import { TableProfileAvatar } from '@/features/observatory/_V2/components/table-profile-avatar'
import { SourceIcon } from '@/features/observatory/_V2/components/source-icon'
import { PageHeading } from '@/features/observatory/_V2/components/page-heading'
import { SectionHeading } from '@/features/observatory/_V2/components/section-heading'
import { SectionDivider } from '@/features/observatory/_V2/components/section-divider'
import { ObservatoryInput } from '@/features/observatory/_V2/components/observatory-input'
import { ReportStatusDot } from '@/features/observatory/_V2/components/report-status-dot'
import { AccountSelectLabel } from '@/features/observatory/_V2/components/account-select-label'
import { ReportRecipients } from '@/features/observatory/_V2/components/report-recipients'
import { SiteFixStatus } from '@/features/observatory/_V2/components/site-health/site-fix-status'
import { SocialPostHeader } from '@/features/observatory/_V2/components/social-media/social-post-header'
import { ChatReasoning } from '@/features/observatory/_V2/components/intelligence-chat/chat-reasoning'
import { ChatSuggestions } from '@/features/observatory/_V2/components/intelligence-chat/chat-suggestions'
import { ChatComposer } from '@/features/observatory/_V2/components/intelligence-chat/chat-composer'
import { ReportHeading } from '@/features/Reports/components/reportHeading/reportHeading'
import { HighlightNumber } from '@/features/Reports/components/highlightNumber/highlightNumber'
import { NewsCard } from '@/features/Reports/components/newsCard/components/news-card'
import { CompetitorCard } from '@/features/Reports/components/competitorCard/components/competitor-card'
import { SiteCheckCard } from '@/features/Reports/components/siteCheckCard/components/site-check-card'
import { SiteStatCard } from '@/features/Reports/components/siteStatCard/components/site-stat-card'
import { ActionCard } from '@/features/Reports/components/actionItem/components/actionCard'
import { StatusListCard } from '@/features/Reports/components/status-list/components/status-list-card'
import { ReportsMultiSeriesLineChart } from '@/features/Reports/components/line/line'
import { ReportsCalendar } from '@/features/Reports/components/reportsCalendar/components/reportsCalendar'
import { ReportContact } from '@/features/Reports/components/reportContact/reportContact'
import { ReportBadge } from '@/features/Reports/components/reportBadge'
import { ReportFooter } from '@/features/Reports/components/reportFooter/report-footer'
import { TaskCard } from '@/features/Reports/components/taskCard/taskCard'
import { ActionListItem } from '@/features/Reports/components/actionItem/components/actionListItem'
import { StatusListItem } from '@/features/Reports/components/status-list/components/status-list-item'
import { Metric1 } from '@/features/Reports/components/metric1/metric1'
import { QuestionsAsked } from '@/features/Reports/components/questionsAsked/components/questions-asked'
import './component-gallery.css'

const account = accounts[0]
const lenses = buildLenses(account)
const lens = id => lenses.find(item => item.id === id)
const analytics = lens('analytics')

export default function ComponentGallery() {
  return <ReportProvider value={reportMock.context}>
    <main className="component-gallery">
      <div className="component-gallery-grid">
        {lenses.map(item => <SignalCard key={item.id} accountId={account.id} lens={item} />)}
        <MetricLineChart />
        <MetricLineChart compact title="Search clicks" icon={Search} />
        <MainChannelCard lens={analytics} />
        <TopPagesChart total={analytics.value} />
        <LandingPagesCard lens={analytics} account={account} />
        <VisitorSourcesChart lens={analytics} />
        <ObservatorySiteStatCard />
        <ObservatorySiteCheckCard title="Missing page description" description="Add a clear summary to the page." />
        <SourcePresenceCard account={account} />
        <WeeklyBrief account={account} />
        <AiVisibilityMethod lens={lens('ai')} />
        <ProviderCoverage providers={lens('ai').providerCoverage} />
        <SignalMetric value="12,480" label="Website sessions" change="+12.4%" />
        <MetricComparison change="+12.4%" />
        <TableProfileAvatar src={account.imageSrc} />
        <SourceIcon icon={Globe} />
        <PageHeading title="Intelligence overview" />
        <SectionHeading title="Search visibility" description="Weekly performance across tracked sources." />
        <SectionDivider />
        <ObservatoryInput placeholder="Search" />
        <ReportStatusDot unread />
        <AccountSelectLabel account={account} />
        <ReportRecipients recipients={[{ id: 'alex', name: 'Alex' }, { id: 'sam', name: 'Sam' }]} />
        <SiteFixStatus count={3} />
        <SocialPostHeader name="Studio Field" avatarSrc="/entity-profiles/studio-field.svg" platform="LinkedIn" />
        <ChatReasoning />
        <ChatSuggestions onSelect={() => {}} />
        <ChatComposer value="" onChange={() => {}} onSend={() => {}} />
        <ReportHeading size="small" />
        <HighlightNumber />
        <NewsCard title="A weekly market update" takeaway="The story behind this week's activity." source={{ label: 'Industry news' }} />
        <CompetitorCard />
        <CompetitorCard variant="highlights" />
        <SiteCheckCard title="Missing page description" description="Add a clear summary to the page." />
        <SiteStatCard />
        <ActionCard />
        <StatusListCard items={[{ label: 'Search traffic', variant: 'success' }, { label: 'Social activity', variant: 'warning' }]} />
        <ReportsMultiSeriesLineChart />
        <ReportsCalendar />
        <ReportContact />
        <ReportBadge segment="competitor" />
        <ReportFooter />
        <TaskCard title="Improve page metadata" description="Add a clear description to priority pages." priority="high" />
        <ActionListItem />
        <StatusListItem />
        <Metric1 />
        <QuestionsAsked questions={[]} />
      </div>
    </main>
  </ReportProvider>
}
