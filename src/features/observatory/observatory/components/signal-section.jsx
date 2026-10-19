import { ChevronRight } from '@/components/ui/icons';
import { Frame, FrameHeader, FrameTitle, FramePanel } from '@/components/ui/frame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SourceIcon } from './source-icon';

export function SignalSection({ title, meta, children }) {
  return (
    <Frame>
      <FrameHeader className="flex-row items-center justify-between gap-3">
        <FrameTitle><h2>{title}</h2></FrameTitle>
        {meta && <Badge variant="outline">{meta}</Badge>}
      </FrameHeader>
      <FramePanel className="p-2"><ul className="divide-y">{children}</ul></FramePanel>
    </Frame>
  );
}
export function SignalRow({ href, label, summary, icon: Icon }) {
  return (
    <li>
      <Button render={<a href={href} />} variant="ghost" className="h-auto w-full justify-start gap-4 whitespace-normal px-3 py-4 text-start sm:h-auto">
        <SourceIcon icon={Icon} className="size-9" />
        <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-sm font-normal leading-5 text-muted-foreground">{summary}</span></span>
        <ChevronRight aria-hidden="true" className="text-muted-foreground" />
      </Button>
    </li>
  );
}
