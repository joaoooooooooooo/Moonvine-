import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { Newspaper } from '@/components/ui/icons';

export function NewsStoryCard({ article }) {
  return <FrameCard withFill className="h-full min-w-0">
    <FrameCardContent className="h-full items-stretch gap-4 p-4">
      <div className="flex min-w-0 gap-4">
        {article.image ? <img src={article.image} alt="" width="96" height="80" loading="lazy" className="h-20 w-24 shrink-0 rounded-md object-cover" /> : <div aria-hidden="true" className="flex h-20 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><Newspaper weight="regular" className="size-7" /></div>}
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm/normal text-muted-foreground">
            <Avatar className="size-5 text-[9px]" aria-hidden="true">{article.avatar && <AvatarImage src={article.avatar} alt="" />}<AvatarFallback>{article.initials}</AvatarFallback></Avatar>
            <span className="min-w-0 break-all">{article.publisher}</span>
            <time dateTime={article.date}>{new Date(article.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
          </div>
          <h4 className="text-base leading-6 font-medium">{article.title}</h4>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-sm/normal text-muted-foreground"><span>{article.matched}</span><span>No source link saved</span></div>
    </FrameCardContent>
  </FrameCard>;
}
