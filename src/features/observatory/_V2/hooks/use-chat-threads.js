import { useSyncExternalStore } from 'react';
const key = 'observatory-chat-threads';
let threads;
try { threads = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(threads)) threads = []; } catch { threads = []; }
const listeners = new Set();
function emit() { try { localStorage.setItem(key, JSON.stringify(threads)); } catch {} listeners.forEach((listener) => listener()); }
export function chatHref(accountId, threadId = 'new') { return `#/chat/${encodeURIComponent(accountId)}/${encodeURIComponent(threadId)}`; }
export function saveChatThread(id, accountId, messages) {
  const thread = { id, accountId, title: messages.find((message) => message.from === 'user')?.text.slice(0, 60) || 'New chat', messages };
  threads = [thread, ...threads.filter((item) => item.id !== id)]; emit();
}
export function useChatThreads() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => threads);
}
