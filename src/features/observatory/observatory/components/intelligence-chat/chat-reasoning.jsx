import { Message, MessageContent } from '@/components/agents/message';
import { ReasoningText } from '@/components/agents/loading-states/reasoning-text';

const phrases = ['Thinking', 'Reviewing the report', 'Preparing a response'];

export function ChatReasoning() {
  return (
    <Message from="assistant" className="items-center">
      <MessageContent>
        <ReasoningText variant="swap" phrases={phrases} interval={1200} className="text-base font-normal" />
      </MessageContent>
    </Message>
  );
}
