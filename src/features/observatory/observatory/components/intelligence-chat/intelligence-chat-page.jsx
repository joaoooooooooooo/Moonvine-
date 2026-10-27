import { useEffect, useRef, useState } from 'react';
import { MessageGroup } from '@/components/agents/message';
import { ChatSuggestions } from './chat-suggestions';
import { PageHeading } from '../page-heading';
import { ChatMessage } from './chat-message';
import { ChatComposer } from './chat-composer';
import { consoleChatHref, saveChatThread, updateChatThread, useChatThreads } from '../../hooks/use-chat-threads';
import { ChatReasoning } from './chat-reasoning';
import { chatReply } from '../../data/intelligence-chat';
import '../signals-grid.css';

export function IntelligenceChatPage({ model }) {
  const threads = useChatThreads();
  const [messages, setMessages] = useState(() => threads.find((thread) => thread.id === model.route.threadId && thread.accountId === model.account.id)?.messages || []);
  const [draft, setDraft] = useState(() => model.route.prompt || '');
  const [isReplying, setIsReplying] = useState(false);
  const replyTimer = useRef(null);
  const [pendingReply, setPendingReply] = useState(null);
  const autoSent = useRef(false);
  const end = useRef(null);
  useEffect(() => {
    if (!pendingReply) return;
    const { prompt, nextMessages, turn, context } = pendingReply;
    replyTimer.current = window.setTimeout(() => {
      const completed = [...nextMessages, { id: crypto.randomUUID(), from: 'assistant', ...chatReply(prompt, context, turn) }];
      setMessages(completed);
      const id = context.route.threadId || crypto.randomUUID();
      saveChatThread(id, context.account.id, completed);
      if (!context.route.threadId) window.location.hash = consoleChatHref(context.account.id, id);
      setIsReplying(false);
      setPendingReply(null);
      replyTimer.current = null;
    }, 3600);
    return () => { window.clearTimeout(replyTimer.current); replyTimer.current = null; };
  }, [pendingReply]);
  useEffect(() => { if (model.route.threadId) updateChatThread(model.route.threadId, { unread: false }); }, [model.route.threadId]);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length]);
  useEffect(() => {
    if (!autoSent.current && model.route.autoSend && model.route.prompt) {
      autoSent.current = true;
      window.history.replaceState(null, '', consoleChatHref(model.account.id, model.route.threadId));
      send(model.route.prompt);
    }
  }, [model.route.autoSend, model.route.prompt]);

  function send(text = draft) {
    const prompt = text.trim();
    if (!prompt || replyTimer.current !== null) return;
    const nextMessages = [...messages, { id: crypto.randomUUID(), from: 'user', text: prompt }];
    if (model.route.threadId) saveChatThread(model.route.threadId, model.account.id, nextMessages);
    setMessages(nextMessages);
    setDraft('');
    setIsReplying(true);
    setPendingReply({ prompt, nextMessages, turn: messages.filter((message) => message.from === 'user').length, context: model });
  }
  return (
    <div className="mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-5xl flex-col items-center gap-10 pb-28" data-chat-started={messages.length > 0 || isReplying}>
      {!messages.length && <div className="flex flex-col items-center gap-2 text-center">
        <PageHeading title="Talk through your intelligence." />
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Explore {model.account.name}’s selected report week.</p>
      </div>}
      {!messages.length && <ChatSuggestions onSelect={send} />}
      <div className="flex w-full flex-1" role="log" aria-label="Intelligence conversation" aria-live="polite">
        <MessageGroup spacing="default" className="gap-8">
          {messages.map((message) => <ChatMessage key={message.id} message={message} model={model} />)}
          {isReplying && <ChatReasoning />}
        </MessageGroup>
        <div ref={end} className="scroll-mb-56" />
      </div>
      <ChatComposer wide isReplying={isReplying} value={draft} onChange={setDraft} onSend={() => send()} />
    </div>
  );
}
