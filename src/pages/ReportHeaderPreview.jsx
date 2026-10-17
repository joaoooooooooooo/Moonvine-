import { useEffect, useState } from 'react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { PanelFrameHeader, PanelFrameTitle } from '@/components/ui/panel-frame';
import { Badge } from '@/components/ui/badge';
import { Activity, ChartNoAxesCombined, TriangleAlertIcon } from '@/components/ui/icons';
import { PageHeading } from '@/features/observatory/_V2/components/page-heading';
import '@/features/observatory/_V2/components/signals-grid.css';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverPopup } from '@/components/ui/popover';

const examples = {
  search: {
    name: 'Google Search Console', status: 'Watch', tone: 'text-warning-foreground',
    headline: 'Search clicks softened this week.',
    description: 'Your pages appeared more often, but fewer searches became visits.',
    result: 'Your brand name led the clicks',
    resultDescription: 'Branded searches brought more visitors than discovery queries.',
    next: 'Review your high-impression queries',
    reason: 'Start with queries that appear often but earn few clicks. Check whether the page title matches what people are searching for.',
    evidence: 'In this sample, “brand strategy” had 36 impressions and no clicks. Review its search intent before changing the page title.',
  },
  analytics: {
    name: 'Google Analytics', status: 'Healthy', tone: 'text-success-foreground',
    headline: 'More visits. Stronger engagement.',
    description: 'Traffic grew this week, with direct visits contributing the largest share.',
    result: 'Direct was the leading channel',
    resultDescription: 'Most visitors arrived directly, with the homepage as the main entry point.',
    next: 'Make the homepage’s next step clearer',
    reason: 'Your homepage is the leading entry point. Give visitors a clear route to your work or a conversation.',
    evidence: 'In this sample, the homepage received 23 entrances. Check its primary action and compare engagement with other landing pages.',
  },
};

function Status({ data }) {
  return <Popover>
    <PopoverTrigger aria-label={`About ${data.status} status`} render={<Badge render={<button type="button" />} variant={data.status === 'Watch' ? 'warning' : 'info'} size="lg" />}>
      <Activity aria-hidden="true" />{data.status}
    </PopoverTrigger>
    <PopoverPopup className="max-w-80 p-4"><div className="space-y-2 text-sm/normal"><p>Vibes: {data.status}</p><p className="text-muted-foreground">Based on comparable weekly traffic and search signals. This is illustrative data, not an overall website-health score.</p></div></PopoverPopup>
  </Popover>;
}

function HeaderOption({ data }) {
  const items = [
    { label: 'Vibes', icon: Activity, title: data.headline, description: data.description, status: true },
    { label: 'Most visible result', icon: ChartNoAxesCombined, title: data.result, description: data.resultDescription },
    { label: 'Priority', icon: TriangleAlertIcon, title: data.next, description: data.reason },
  ];
  return <div className="v2-signals-grid">
    <FrameCard withFill data-preview-summary className="w-full overflow-hidden">
      <FrameCardContent className="p-0!">
        <div className="grid w-full divide-y divide-border min-[740px]:grid-cols-3 min-[740px]:divide-x min-[740px]:divide-y-0">
          {items.map(({ icon: Icon, ...item }) => <section key={item.label} aria-label={item.label} className="min-w-0">
            <PanelFrameHeader><Icon aria-hidden="true" className="size-4 shrink-0" /><PanelFrameTitle render={<h3 />}>{item.label}</PanelFrameTitle></PanelFrameHeader>
            <div className="space-y-2 p-4 text-sm/normal">
              <div className={item.status ? 'mb-3 flex min-h-6 items-center' : 'hidden min-h-6 min-[740px]:mb-3 min-[740px]:block'}>{item.status && <Status data={data} />}</div>
              <p className="font-normal text-foreground">{item.title}</p>
              <p className="font-normal text-muted-foreground">{item.description}</p>
            </div>
          </section>)}
        </div>
      </FrameCardContent>
    </FrameCard>
  </div>;
}

export default function ReportHeaderPreview() {
  const [source, setSource] = useState('search');
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const data = examples[source];
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-8">
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="space-y-2"><PageHeading title={data.name} aside={<Button variant="secondary" onClick={() => setDark(!dark)}>{dark ? 'Light mode' : 'Dark mode'}</Button>} /><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Header component preview. Illustrative content only.</p></div>
      <Tabs value={source} onValueChange={setSource}><TabsList variant="underline" aria-label="Preview source"><TabsTab value="search">Search Console</TabsTab><TabsTab value="analytics">Google Analytics</TabsTab></TabsList></Tabs>
      <HeaderOption key={source} data={data} />
    </div>
  </main>;
}

