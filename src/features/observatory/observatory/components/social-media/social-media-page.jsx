import { PageHeading } from '../page-heading';
import { SectionDivider } from '../section-divider';
import { socialMediaData, watchedSocialAccounts } from '../../data/social-media';
import { SocialPosts } from './social-posts';
import { SocialHandles } from './social-handles';
import { WatchedHandles } from './watched-handles';
import { SocialEngagementChart } from './social-engagement-chart';
import '../signals-grid.css';

export function SocialMediaPage({ account, period, lens }) {
  const data = socialMediaData(account, period);
  return (
    <div className="v2-page-sections">
      <div className="space-y-2">
        <PageHeading title="Watched accounts are posting while you are quiet." />
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">{data.posts.length} watched-account posts were saved. No posts from {account.name} were captured for this report week.</p>
      </div>
      <SocialEngagementChart lens={lens} />
      <SectionDivider />
      <SocialPosts key={account.id + period} account={account} posts={data.posts} />
      <SectionDivider />
      <SocialHandles key={account.id} handles={data.handles} account={account} />
      <SectionDivider />
      <WatchedHandles organizations={watchedSocialAccounts} />
    </div>
  );
}


