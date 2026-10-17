import { useState } from 'react';
import { Message, MessageContent, MessageFooter } from '@/components/agents/message';
import { MessageBubble, MessageBubbleContent } from '@/components/agents/message-bubble';
import { ChatResponse } from './chat-response';
import { accountHref } from '../../utils/observatory-model';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, CheckIcon, CopyIcon } from '@/components/ui/icons';
import { Tooltip, TooltipPopup, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ChatMessage({ message, model }) {
  const user = message.from === 'user';
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  async function copyMessage() {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <Message from={message.from} animateIn className={user ? "items-center" : undefined}>
      <MessageContent className={user ? "gap-3" : "max-w-[60ch] gap-6"}>
        <MessageBubble variant={user ? 'soft' : 'ghost'} className={user ? "min-h-11 max-w-full items-end justify-center" : "max-w-full"}>
          <MessageBubbleContent className={user ? "whitespace-pre-wrap text-base leading-6 [&>.absolute]:bg-primary-foreground" : "whitespace-pre-wrap text-base leading-6"}>{message.text}</MessageBubbleContent>
        </MessageBubble>
        {message.format && <ChatResponse message={message} model={model} />}
        {message.sources && <MessageFooter className="flex-wrap gap-3">
          {message.sources.map((source) => <a key={source} className="text-xs underline underline-offset-4" href={accountHref(model.account.id, source, model.route.period)}>{model.lenses.find((lens) => lens.sourceId === source)?.label}</a>)}
        </MessageFooter>}
        <TooltipProvider delay={150} timeout={500}>
          <MessageFooter className="gap-1 px-0">
            <Tooltip>
              <TooltipTrigger render={<Button type="button" size="icon-sm" variant="ghost" aria-label={copied ? 'Message copied' : 'Copy message'} onClick={copyMessage} />}>
                {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
              </TooltipTrigger>
              <TooltipPopup>{copied ? 'Copied' : 'Copy'}</TooltipPopup>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button type="button" size="icon-sm" variant="ghost" aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark message'} aria-pressed={bookmarked} onClick={() => setBookmarked((current) => !current)} />}>
                <BookmarkIcon aria-hidden="true" weight={bookmarked ? 'fill' : 'regular'} />
              </TooltipTrigger>
              <TooltipPopup>{bookmarked ? 'Remove bookmark' : 'Bookmark'}</TooltipPopup>
            </Tooltip>
          </MessageFooter>
        </TooltipProvider>
      </MessageContent>
    </Message>
  );
}
