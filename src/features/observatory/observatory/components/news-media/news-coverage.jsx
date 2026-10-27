import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveChartTabs } from '@/components/ui/responsive-chart-tabs';
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { NewsStoryCard } from './news-story-card';
import { SectionHeading } from '../section-heading';
import { newsCategories } from '../../data/news-media';

export function NewsCoverage({ data }) {
  const [category, setCategory] = useState('all');
  const [publisher, setPublisher] = useState('all');
  const publisherItems = [{ value: 'all', label: 'All publishers' }, ...data.publishers.map((label) => ({ value: label, label }))];
  const filtered = data.articles.filter((article) => (category === 'all' || article.category === category) && (publisher === 'all' || article.publisher === publisher));
  return <section aria-labelledby="news-coverage" className="space-y-10">
    <SectionHeading id="news-coverage" title="The stories behind the numbers" description="Explore coverage of your organization, your competitors, and the topics you follow." />
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResponsiveChartTabs label="Filter news by category" value={category} onValueChange={setCategory} className="tabular-nums" items={[{ id: 'all', label: 'All', count: data.articles.length }, ...newsCategories.map(item => ({ ...item, count: data.counts[item.id] }))].map(item => ({ value: item.id, label: `${item.label} ${item.count}` }))} />
        <Select items={publisherItems} value={publisher} onValueChange={setPublisher}><SelectTrigger className="w-auto min-w-40 border-transparent bg-muted shadow-none before:hidden" aria-label="Filter by publisher"><SelectValue /></SelectTrigger><SelectPopup>{publisherItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup></Select>
      </div>
      <p role="status" className="text-sm/normal text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'story' : 'stories'} in this view</p>
      {filtered.length ? newsCategories.filter((item) => category === 'all' || category === item.id).map((item) => {
        const rows = filtered.filter((article) => article.category === item.id);
        if (!rows.length) return null;
        return <section key={item.id} aria-labelledby={`news-category-${item.id}`} className="space-y-4">
          <div className="space-y-2"><h3 id={`news-category-${item.id}`} className="max-w-[32rem] text-xl/normal font-normal">{item.title}</h3><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">{item.description}</p></div>
          <div className={`v2-signals-grid grid items-stretch gap-3 ${rows.length > 1 ? 'grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))]' : ''}`}>{rows.map((article) => <NewsStoryCard key={article.id} article={article} />)}</div>
        </section>;
      }) : <Empty><EmptyHeader><EmptyTitle>No stories match these filters</EmptyTitle><EmptyDescription>Try another publisher or include all categories.</EmptyDescription></EmptyHeader><Button variant="secondary" onClick={() => { setCategory('all'); setPublisher('all'); }}>Clear filters</Button></Empty>}
    </div>
  </section>;
}

