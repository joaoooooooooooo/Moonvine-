import { SourceOverview } from './source-pages/source-overview';
import { SocialMediaPage } from './social-media/social-media-page';
import { FixableWebsiteIssues } from './site-health/fixable-website-issues';
import { PagesToReview } from './site-health/pages-to-review';
import { WebsiteInventory } from './site-health/website-inventory';
import { PageHeading } from './page-heading';
import { SiteHealth } from './site-health/site-health';
import { SectionDivider } from './section-divider';
import { AnalyticsCharts } from './analytics/analytics-charts';
import { AiVisibilitySummary } from './ai-visibility/ai-visibility-summary';
import { AiVisibilityMethod } from './ai-visibility/ai-visibility-method';
import { AiVisibilityQuestions } from './ai-visibility/ai-visibility-questions';
import { AiVisibilitySources } from './ai-visibility/ai-visibility-sources';
import { AiVisibilityNextSteps } from './ai-visibility/ai-visibility-next-steps';
import { AiVisibilityProcess } from './ai-visibility/ai-visibility-process';
import { Button } from '@/components/ui/button';
import { SearchConsolePage } from './search-console/search-console-page';
import { AnalyticsV2Page } from './analytics-v2/analytics-v2-page';

export function SourceDetail({ model }) {
  const { account, lens, route } = model;
  if (lens.id === 'search') return <SearchConsolePage key={account.id + route.period} account={account} lens={lens} />;
  if (lens.id === 'analytics') return <AnalyticsV2Page key={account.id + route.period} account={account} lens={lens} period={route.period} />;
  if (lens.id === 'social') return <SocialMediaPage account={account} period={route.period} lens={lens} />;
  if (lens.id === 'ai') {
    return (
      <div className="v2-page-sections">
        <AiVisibilitySummary account={account} lens={lens} period={route.period} />
        <AiVisibilityMethod lens={lens} />
        <AiVisibilityQuestions account={account} surfaced={Math.round(lens.sampleQuestions * lens.value / 100)} />
        <AiVisibilitySources account={account} competitorNames={model.lenses.find(({ id }) => id === 'competitors')?.rows.map(([name]) => name) ?? []} />
        <AiVisibilityNextSteps account={account} />
        <AiVisibilityProcess />
      </div>
    );
  }
  return (
    <div className="v2-page-sections">
      <div className="space-y-2">
        <div className="max-w-[32rem]"><PageHeading title={lens.description} /></div>
        {lens.id !== 'website' && <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">{lens.summary}</p>}
        {lens.id === 'analytics' && <Button className="mt-2" variant="secondary" render={<a href="#/console/data-sources/first-party-data" />}>Manage Google Analytics</Button>}
        {lens.id === 'search' && <Button className="mt-2" variant="secondary" render={<a href="#/console/data-sources/first-party-data" />}>Manage Google Search Console</Button>}
      </div>
      {lens.id === 'analytics' ? <AnalyticsCharts lens={lens} account={account} /> : lens.id === 'website' ? (
        <div className="v2-page-sections">
          <SiteHealth lens={lens} account={account} />
          <SectionDivider />
          <FixableWebsiteIssues key={account.id + route.period} account={account} />
          <SectionDivider />
          <PagesToReview key={`pages-${account.id}-${route.period}`} account={account} />
          <SectionDivider />
          <WebsiteInventory key={`inventory-${account.id}-${route.period}`} account={account} />
        </div>
      ) : <SourceOverview lens={lens} account={account} period={route.period} />}
    </div>
  );
}


