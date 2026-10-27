import { useState } from 'react';
import { FeatureIcon } from '@/components/ui/feature-icon';
import { FrameCard } from '@/components/ui/frame-card';
import { Button } from '@/components/ui/button';
import { ChartNoAxesCombined, Eye, FileText, SquarePen, Sparkles, Table2, Users } from '@/components/ui/icons';
import { startChatHref } from '../hooks/use-chat-threads';
import './signals-grid.css';
import { ChatComposer } from './intelligence-chat/chat-composer';

const starters = [
  {
    label: 'Resume my week',
    detail: 'See what changed for your organization this week.',
    prompt: 'Summarize what changed for my organization this week.',
    icon: Sparkles,
    variant: 'blue',
  },
  {
    label: 'Check competitors',
    detail: 'See the latest news about your competitors this week.',
    prompt: 'How are my competitors doing this week?',
    icon: Users,
    variant: 'purple',
  },
  {
    label: 'Find opportunities',
    detail: 'Find the next opportunity worth your attention.',
    prompt: 'Where should I focus next based on this week’s intelligence?',
    icon: ChartNoAxesCombined,
    variant: 'emerald',
  },
  {
    label: 'Review my report',
    detail: 'Get the key takeaways from your latest report.',
    prompt: 'Walk me through the key takeaways from my latest report.',
    icon: FileText,
    variant: 'amber',
  },
];

const quickActions = [
  { label: 'See all social', prompt: 'Show me all social activity.', icon: Eye },
  { label: 'Edit watchlist', prompt: 'Help me edit my news watchlist.', icon: SquarePen },
  { label: 'Show posts as table', prompt: 'Show recent social posts as a table.', icon: Table2 },
  { label: 'Compare competitors', prompt: 'Compare my competitors.', icon: Users },
];

export function ObservatoryHome({ model }) {
  const [draft, setDraft] = useState('');
  function startChat() {
    const prompt = draft.trim();
    if (!prompt) return;
    window.location.hash = startChatHref(model.selectedAccountId, prompt);
  }
  return (
    <main className="flex flex-col gap-12 pb-28">
      <div className="space-y-0.5">
        <p className="font-heading text-4xl font-normal leading-tight tracking-tight text-muted-foreground sm:text-[2.625rem]">Hello, Julio.</p>
        <h1 className="max-w-[32rem] font-heading text-4xl font-normal leading-tight tracking-tight text-foreground sm:text-[2.625rem]">How can I help you today?</h1>
      </div>
      <div className="flex w-full max-w-[49.25rem] flex-col gap-4">
        <nav aria-label="Start a conversation" className="v2-signals-grid v2-home-starters v2-question-cards grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {starters.map(({ label, detail, prompt, icon, variant }) => (
            <FrameCard
              key={label}
              render={<a href={startChatHref(model.selectedAccountId, prompt)} />}
              withFill
              className="min-h-[179px] min-w-0 cursor-pointer overflow-hidden rounded-md text-left shadow-sm/5 transition-colors hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex w-full flex-1 flex-col justify-between gap-4 p-3">
                <FeatureIcon icon={icon} variant={variant} size="lg" weight="regular" />
                <span className="flex flex-col gap-1">
                  <span className="text-base/normal font-normal text-foreground">{label}</span>
                  <span className="text-sm leading-5 font-normal text-muted-foreground">{detail}</span>
                </span>
              </span>
            </FrameCard>
          ))}
        </nav>
        <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
          {quickActions.map(({ label, prompt, icon: Icon }) => (
            <Button key={label} variant="secondary" size="lg" render={<a href={startChatHref(model.selectedAccountId, prompt)} />}>
              <Icon aria-hidden="true" weight="fill" />
              {label}
            </Button>
          ))}
        </nav>
      </div>
      <ChatComposer wide value={draft} onChange={setDraft} onSend={startChat} isReplying={false} />
    </main>
  );
}
