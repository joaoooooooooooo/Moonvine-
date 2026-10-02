import { useEffect, useRef, useState } from 'react';
import { MessageGroup } from '@/components/agents/message';
import { ChatSuggestions } from './chat-suggestions';
import { PageHeading } from '../page-heading';
import { ChatMessage } from './chat-message';
import { ChatComposer } from './chat-composer';
import { chatHref, saveChatThread, useChatThreads } from '../../hooks/use-chat-threads';
import { ChatReasoning } from './chat-reasoning';
import { chatReply } from '../../data/intelligence-chat';
import '../signals-grid.css';

export function IntelligenceChatPage({ model }) {
  const threads = useChatThreads();
  const [messages, setMessages] = useState(() => threads.find((thread) => thread.id === model.route.threadId && thread.accountId === model.account.id)?.messages || []);
  const [draft, setDraft] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const replyTimer = useRef(null);
  const end = useRef(null);
  useEffect(() => () => window.clearTimeout(replyTimer.current), []);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length]);

  function send(text = draft) {
    const prompt = text.trim();
    if (!prompt || replyTimer.current !== null) return;
    const nextMessages = [...messages, { id: crypto.randomUUID(), from: 'user', text: prompt }];
    setMessages(nextMessages);
    setDraft('');
    setIsReplying(true);
    // A short local delay previews the loading animation; no API request is made.
    replyTimer.current = window.setTimeout(() => {
      const completed = [...nextMessages, { id: crypto.randomUUID(), from: 'assistant', ...chatReply(prompt, model, messages.filter((message) => message.from === 'user').length) }];
      setMessages(completed);
      const id = model.route.threadId || crypto.randomUUID();
      saveChatThread(id, model.account.id, completed);
      if (!model.route.threadId) window.location.hash = chatHref(model.account.id, id);
      setIsReplying(false);
      replyTimer.current = null;
    }, 3600);
  }
  return (
    <div className="flex min-h-[calc(100svh-10rem)] flex-col gap-10 pb-28">
      {!messages.length && <div className="flex flex-col items-center gap-2 text-center">
        <PageHeading title="Talk through your intelligence." />
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Explore {model.account.name}’s selected report week.</p>
      </div>}
      {!messages.length && <ChatSuggestions onSelect={send} />}
      <div className="flex-1" role="log" aria-label="Intelligence conversation" aria-live="polite">
        <MessageGroup spacing="default" className="gap-8">
          {messages.map((message) => <ChatMessage key={message.id} message={message} model={model} />)}
          {isReplying && <ChatReasoning />}
        </MessageGroup>
        <div ref={end} className="scroll-mb-56" />
      </div>
      <ChatComposer isReplying={isReplying} value={draft} onChange={setDraft} onSend={() => send()} />
    </div>
  );
}
