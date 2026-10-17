import { useEffect, useState } from 'react';
import { ReportSignalSummary } from '@/features/observatory/_V2/components/report-signal-summary';
import { PageHeading } from '@/features/observatory/_V2/components/page-heading';
import '@/features/observatory/_V2/components/signals-grid.css';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';

const examples = {
  search: {
    name: 'Google Search Console', status: 'Watch', tone: 'text-warning-foreground',
    headline: 'Search clicks softened this week.',
    description: 'Your pages appeared more often, but fewer searches became visits.',
    metric: { value: '198', label: 'Impressions', change: '+55%' },
    result: 'Your pages appeared more often',
    resultDescription: 'More search appearances did not translate into more clicks.',
    next: 'Review your high-impression queries',
    reason: 'Start with queries that appear often but earn few clicks. Check whether the page title matches what people are searching for.',
    evidence: 'In this sample, “brand strategy” had 36 impressions and no clicks. Review its search intent before changing the page title.',
  },
  analytics: {
    name: 'Google Analytics', status: 'Healthy', tone: 'text-success-foreground',
    headline: 'More visits. Stronger engagement.',
    description: 'Traffic grew this week, with direct visits contributing the largest share.',
    metric: { value: '64.8%', label: 'Engagement rate', change: '+2.4 pp' },
    result: 'Visitors were more engaged',
    resultDescription: 'A larger share of visits included meaningful activity.',
    next: 'Make the homepage’s next step clearer',
    reason: 'Your homepage is the leading entry point. Give visitors a clear route to your work or a conversation.',
    evidence: 'In this sample, the homepage received 23 entrances. Check its primary action and compare engagement with other landing pages.',
  },
};

export default function ReportHeaderPreview() {
  const [source, setSource] = useState('search');
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const data = examples[source];
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-8">
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="space-y-2"><PageHeading title={data.name} aside={<Button variant="secondary" onClick={() => setDark(!dark)}>{dark ? 'Light mode' : 'Dark mode'}</Button>} /><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Header component preview. Illustrative content only.</p></div>
      <Tabs value={source} onValueChange={setSource}><TabsList variant="underline" aria-label="Preview source"><TabsTab value="search">Search Console</TabsTab><TabsTab value="analytics">Google Analytics</TabsTab></TabsList></Tabs>
      <ReportSignalSummary key={source} data={data} />
    </div>
  </main>;
}

