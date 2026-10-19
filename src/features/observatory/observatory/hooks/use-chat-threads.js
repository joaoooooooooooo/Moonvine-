import { useSyncExternalStore } from 'react';
const key = 'observatory-chat-threads';
let threads;
try { threads = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(threads)) threads = []; } catch { threads = []; }
const listeners = new Set();
function emit() { try { localStorage.setItem(key, JSON.stringify(threads)); } catch {} listeners.forEach((listener) => listener()); }
export function chatHref(accountId, threadId = 'new') { return `#/chat/${encodeURIComponent(accountId)}/${encodeURIComponent(threadId)}`; }
export function consoleChatHref(accountId, threadId) { return `#/console?account=${encodeURIComponent(accountId)}&chat=${encodeURIComponent(threadId)}`; }
export function saveChatThread(id, accountId, messages) {
  const previous = threads.find((item) => item.id === id);
  const active = window.location.hash.split('?')[0] === chatHref(accountId, id) || window.location.hash === consoleChatHref(accountId, id);
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
