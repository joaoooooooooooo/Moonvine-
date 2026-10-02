import { Table2, Link2, ChartNoAxesCombined, Hash, MessageCircle, Sparkles } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { chatSuggestions } from '../../data/intelligence-chat';

const icons = { table: Table2, links: Link2, search: ChartNoAxesCombined, numbers: Hash, social: MessageCircle, ai: Sparkles };

export function ChatSuggestions({ onSelect }) {
  return (
    <div className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Suggested questions">
      {chatSuggestions.map(({ id, label, prompt }) => {
        const Icon = icons[id];
        return <FrameCard key={id} render={<button type="button" onClick={() => onSelect(prompt)} />} withFill
          className="h-full min-w-0 cursor-pointer text-left transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <FrameCardContent className="h-full gap-5 p-6">
            <div className="v2-card-tagline flex items-center gap-2 text-sm/normal">
              <Icon className="size-4 shrink-0" aria-hidden="true" /><span>{label}</span>
            </div>
            <span className="text-base font-normal">{prompt}</span>
          </FrameCardContent>
        </FrameCard>;
      })}
    </div>
  );
}
