import { Message, MessageContent, MessageFooter } from '@/components/agents/message';
import { MessageBubble, MessageBubbleContent } from '@/components/agents/message-bubble';
import { ChatResponse } from './chat-response';
import { accountHref } from '../../utils/observatory-model';

export function ChatMessage({ message, model }) {
  const user = message.from === 'user';
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
      </MessageContent>
    </Message>
  );
}
