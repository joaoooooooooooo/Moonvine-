import { PageHeading } from '../page-heading';
import { SectionDivider } from '../section-divider';
import { NewsCoverage } from './news-coverage';
import { NewsAgenda } from './news-agenda';
import { newsMediaData } from '../../data/news-media';
import '../signals-grid.css';

export function NewsMediaPage() {
  const data = newsMediaData();
  return <div className="v2-page-sections">
    <div className="space-y-2"><PageHeading title={data.counts.coverage ? 'Your watchlist is making the news.' : 'No coverage appeared in this collection.'} /><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Coverage, competitor mentions, and the themes shaping your industry.</p><p className="text-sm/normal text-muted-foreground">Reference collection · October 6–9, 2026</p></div>
    <dl className="flex flex-wrap gap-x-12 gap-y-6">{[{ label: 'Coverage stories', value: data.counts.coverage }, { label: 'Competitor mentions', value: data.counts.competitors }, { label: 'Publishers', value: data.publishers.length }].map(({ label, value }) => <div key={label} className="space-y-2"><dt className="text-sm/normal text-muted-foreground">{label}</dt><dd className="font-heading text-3xl font-normal tabular-nums tracking-tight sm:text-4xl">{value}</dd></div>)}</dl>
    <NewsAgenda data={data} />
    <SectionDivider />
    <NewsCoverage data={data} />
    <p className="text-sm/normal text-muted-foreground">Reference content for design preview. Account and period controls do not change this saved collection. Source article URLs were not included in the reference.</p>
  </div>;
}
