import { Frame, FrameHeader, FrameTitle, FramePanel } from '@/components/ui/frame';
import { Badge } from '@/components/ui/badge';
import { TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { formatMetric } from '../utils/observatory-model';
import { PagesToReview } from './site-health/pages-to-review';
import { PageHeading } from './page-heading';
import { ObservatoryTable } from './observatory-table';
import { SiteHealth } from './site-health/site-health';
import { SectionDivider } from './section-divider';
import { AnalyticsCharts } from './analytics/analytics-charts';

export function SourceDetail({ model }) {
  const { account, lens, route } = model;
  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <PageHeading title={lens.description} />
        </div>
        {lens.id === 'analytics' ? <AnalyticsCharts lens={lens} account={account} /> : <div className="space-y-6">
          {lens.id === 'ai' ? <AiVisibilityRead lens={lens} account={account} /> : lens.id === 'website' ? <SiteHealth lens={lens} account={account} /> : <SourceRead lens={lens} />}
          {lens.id === 'website' && <><SectionDivider /><PagesToReview key={account.id + route.period} account={account} /></>}
        </div>}
    </div>
  );
}
function SourceRead({ lens }) {
  return (
    <>
      <div className="space-y-3">
        <h2 className="max-w-3xl text-xl font-normal tracking-tight">{lens.summary}</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{lens.evidence[0]}</p>
      </div>
      <Frame>
        <FramePanel>
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {lens.rows.map(([label, value]) => <div key={label} className="space-y-2"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-3xl font-normal tabular-nums tracking-tight">{formatMetric(value, lens.unit)}</dd></div>)}
          </dl>
        </FramePanel>
      </Frame>
      <SectionDivider />
      <Frame>
        <FrameHeader><FrameTitle><h2>{lens.id === 'competitors' ? 'Organic search overlap' : lens.id === 'news' ? 'Media coverage' : lens.id === 'social' ? 'Account activity' : 'Source evidence'}</h2></FrameTitle></FrameHeader>
        <FramePanel><ul className="space-y-4">{lens.evidence.map((text) => <li key={text} className="max-w-2xl text-sm leading-6 text-muted-foreground">{text}</li>)}</ul></FramePanel>
      </Frame>
    </>
  );
}
function AiVisibilityRead({ lens, account }) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="space-y-3">
          <Badge variant="info">Current AI visibility read</Badge>
          <h2 className="max-w-2xl text-2xl font-normal leading-snug tracking-tight">{account.name} appears in {formatMetric(lens.value, '%')} of the sampled answers.</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Category discovery questions produced the strongest visibility. ChatGPT, Gemini, and Perplexity are represented in this sample.</p>
        </div>
        <Frame><FramePanel className="flex h-full flex-col justify-center gap-2"><span className="text-sm text-muted-foreground">AI visibility</span><span className="text-4xl font-normal tabular-nums tracking-tight">{formatMetric(lens.value, '%')}</span></FramePanel></Frame>
      </div>
      <SectionDivider />
      <ObservatoryTable label="Latest completed AI checks" pagination={{ total: 3 }} toolbar={<h3 className="text-sm font-medium">Latest completed checks</h3>}>
            <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Provider</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{['Which companies should I consider in this category?', 'Who can help with a complex project like mine?', 'How should I compare the leading providers?'].map((prompt, index) => <TableRow key={prompt}><TableCell className="whitespace-normal leading-5">{prompt}</TableCell><TableCell>{lens.rows[index][0]}</TableCell><TableCell><Badge variant="success">Completed</Badge></TableCell></TableRow>)}</TableBody>
      </ObservatoryTable>
      <SectionDivider />
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadList title="Organizations in the answers" items={[account.name, 'Studio Field', 'Common Ground']} />
        <ReadList title="Reference sources used most" items={['Company website', 'Industry directory', 'Industry publication']} />
      </div>
    </>
  );
}
function ReadList({ title, items }) {
  return <Frame><FrameHeader><FrameTitle><h3>{title}</h3></FrameTitle></FrameHeader><FramePanel><ul className="space-y-3 text-sm">{items.map((item) => <li key={item}>{item}</li>)}</ul></FramePanel></Frame>;
}
