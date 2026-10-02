import { useSyncExternalStore } from 'react';
import { reports } from '../data/reports';

// Session-only mock state: the two newest reports per account start unread.
let opened = new Set(reports.filter((report) => report.opened).map((report) => report.id));
const listeners = new Set();
const subscribe = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
const getSnapshot = () => opened;

export function markReportOpened(id) {
  if (opened.has(id)) return;
  opened = new Set(opened).add(id);
  listeners.forEach((listener) => listener());
}

export function useReportReadState(accountId) {
  const read = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    isOpened: (id) => read.has(id),
    hasUnread: reports.some((report) => (!accountId || report.accountId === accountId) && !read.has(report.id)),
  };
}
