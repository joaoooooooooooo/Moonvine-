import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { SocialCard } from '@/features/Reports/components/social-card';
import { SectionHeading } from '../section-heading';
import { ReportBadge } from '@/features/Reports/components/reportBadge';
import { SocialPostHeader } from './social-post-header';

export function SocialPosts({ account, posts }) {
  const [filter, setFilter] = useState('all');
  const visible = posts.filter((post) => filter === 'all' || post.ownership === filter);
  return (
    <section aria-labelledby="social-posts" className="space-y-10">
      <SectionHeading id="social-posts" title={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'} captured this week`} description="Saved posts from your account and the organizations you watch, for the selected report week." />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter posts">
          {[['all', 'All'], ['owned', 'You'], ['watched', 'Watched']].map(([value, label]) => (
            <Button key={value} size="sm" variant={filter === value ? 'secondary' : 'ghost'} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</Button>
          ))}
        </div>
        {visible.length ? <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => <SocialCard key={post.id} name={post.name} avatarSrc={post.avatarSrc} metaLabel={post.platform}
            title={post.title} description={post.description} thumbnailSrc={post.imageUrl} thumbnailAlt={post.imageAlt} thumbnailClassName="object-cover"
            header={<SocialPostHeader name={post.name} avatarSrc={post.avatarSrc} platform={post.platform} />}
            thumbnailFrameClassName="aspect-square"
            headingBadge={post.ownership === 'watched' ? <ReportBadge segment="competitor" size="default">Watched</ReportBadge> : null}
            className="max-w-none cursor-default hover:bg-card! [&_h3]:text-lg [&_h3]:font-normal" />)}
        </div> : <Empty><EmptyHeader><EmptyTitle>No posts captured</EmptyTitle><EmptyDescription>No posts from {account.name} were saved for this report week.</EmptyDescription></EmptyHeader></Empty>}
      </div>
    </section>
  );
}

