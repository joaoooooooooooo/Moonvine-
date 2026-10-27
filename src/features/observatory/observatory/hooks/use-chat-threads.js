import { useSyncExternalStore } from 'react';
const key = 'observatory-chat-threads';
let threads;
try { threads = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(threads)) threads = []; } catch { threads = []; }
const listeners = new Set();
function emit() { try { localStorage.setItem(key, JSON.stringify(threads)); } catch {} listeners.forEach((listener) => listener()); }
export function chatHref(accountId, threadId = 'new') { return threadId === 'new' ? '#/console' : consoleChatHref(accountId, threadId); }
export function consoleChatHref(accountId, threadId) { return `#/console?account=${encodeURIComponent(accountId)}&chat=${encodeURIComponent(threadId)}`; }
export function startChatHref(accountId, prompt) {
  return consoleChatHref(accountId, crypto.randomUUID()) + '&prompt=' + encodeURIComponent(prompt) + '&send=1';
}
export function saveChatThread(id, accountId, messages) {
  const previous = threads.find((item) => item.id === id);
  const url = new URL(window.location.hash.slice(1), window.location.origin);
  const active = url.pathname === '/console' && url.searchParams.get('chat') === id && url.searchParams.get('account') === accountId;
  const thread = { ...previous, id, accountId, title: messages.find((message) => message.from === 'user')?.text || 'New chat', messages, updatedAt: Date.now(), unread: !active };
  threads = [thread, ...threads.filter((item) => item.id !== id)]; emit();
}
export function updateChatThread(id, changes) {
  const thread = threads.find((item) => item.id === id);
  if (!thread || Object.entries(changes).every(([key, value]) => thread[key] === value)) return;
  threads = threads.map((item) => item.id === id ? { ...item, ...changes } : item);
  emit();
}
export function useChatThreads() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => threads);
}
