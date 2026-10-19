import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { cn } from '@/lib/utils';

// The shared Observatory surface for small cards, collections, and saved posts.
// Keep the frame treatment here instead of borrowing Reports card primitives.
export function ObservatoryBasicFrame({ children, render, className }) {
  return <FrameCard render={render} withFill className={cn('v2-observatory-frame w-full min-w-0 outline-none', className)}>
    <FrameCardContent className="v2-observatory-frame-content min-w-0 w-full gap-0 p-0">
      {children}
    </FrameCardContent>
  </FrameCard>;
}
