import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { Newspaper } from '@/components/ui/icons';
import { SectionHeading } from '../section-heading';
import { SourceDistributionCard } from '../source-pages/source-distribution-card';
import { NewsStoryCard } from './news-story-card';

export function NewsAgenda({ data }) {
  const dominant = Math.round(data.topics[0].value / data.articles.length * 100);
  return <section className="space-y-10" aria-labelledby="media-agenda">
    <SectionHeading id="media-agenda" title="The media agenda" description="The themes setting the pace across this collection." />
    <div className="v2-signals-grid grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))]">
      <SourceDistributionCard title="Conversation mix" rows={data.topics} unit="stories" icon={Newspaper} />
      <FrameCard withFill><FrameCardContent className="h-full gap-6 p-6">
        <h3 className="v2-card-tagline text-sm font-normal">The dominant conversation</h3>
        <div className="space-y-2"><p className="font-heading text-4xl tabular-nums tracking-tight">{dominant}%</p><p className="text-base">General market coverage</p></div>
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Most saved stories focus on transit investment, service, and operations.</p>
        <div className="w-full space-y-2 border-t border-border pt-4"><h4 className="text-sm font-normal">Editorial tenor</h4><p className="text-xl">Generally positive</p><p className="text-sm text-muted-foreground">Directional assessment from the Figma reference.</p></div>
      </FrameCardContent></FrameCard>
    </div>
    <div className="space-y-4"><h3 className="text-xl font-normal">Stories outside the main current</h3><div className="v2-signals-grid"><NewsStoryCard article={data.articles[1]} /></div></div>
  </section>;
}
