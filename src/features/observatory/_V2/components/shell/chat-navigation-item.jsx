import { useEffect, useRef, useState } from 'react';
import { Archive } from '@phosphor-icons/react';
import { PinIcon } from '@/components/ui/icons';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { toastManager } from '@/components/ui/toast';
import { chatHref, updateChatThread } from '../../hooks/use-chat-threads';

export function ChatAction({ label, icon: Icon, href, onClick, pressed, tooltipHandle, weight = 'fill' }) {
  const className = 'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const props = { className, 'aria-label': label, onClick };
  return <TooltipTrigger handle={tooltipHandle} payload={{ label }} render={href ? <a {...props} href={href} /> : <button {...props} type="button" aria-pressed={pressed} />}>
    <Icon aria-hidden="true" className="size-3.5" weight={weight} />
  </TooltipTrigger>;
}

export function ChatNavigationItem({ thread, active, onNavigate, tooltipHandle, href = chatHref(thread.accountId, thread.id), archiveHref = chatHref(thread.accountId) }) {
  const viewport = useRef(null);
  const title = useRef(null);
  const [overflow, setOverflow] = useState(0);
  const timestamp = thread.updatedAt ?? thread.createdAt;
  const date = timestamp ? new Date(timestamp) : null;
  const validDate = date && Number.isFinite(date.getTime()) ? date : null;
  useEffect(() => {
    const measure = () => {
      const clipped = title.current.scrollWidth - viewport.current.clientWidth;
      // Move the final characters clear of the fade before the ticker returns.
      setOverflow(clipped > 0 ? clipped + 20 : 0);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    observer.observe(title.current);
    return () => observer.disconnect();
  }, [thread.title]);

  function archive() {
    updateChatThread(thread.id, { archived: true });
    const id = toastManager.add({ title: 'Chat archived', type: 'info', actionProps: { children: 'Undo', onClick: () => {
      updateChatThread(thread.id, { archived: false });
      toastManager.close(id);
    } } });
    if (active) window.location.hash = archiveHref;
  }

  return <SidebarMenuItem className="chat-nav-row" data-active={active} data-status={Boolean(thread.pinned || thread.unread)}>
      <TooltipTrigger handle={tooltipHandle} payload={{ title: thread.title, date: validDate }} render={<SidebarMenuButton render={<a href={href} />} isActive={active}
        aria-current={active ? 'page' : undefined} aria-label={`${thread.title}${thread.unread ? ', unread' : ''}`}
        onClick={() => { updateChatThread(thread.id, { unread: false }); onNavigate?.(); }} className="chat-nav-link h-8 text-foreground" />}>
        <span ref={viewport} className="chat-nav-title" data-overflow={overflow > 0} style={{ '--chat-scroll': `${-overflow}px`, '--chat-duration': `${Math.max(4, overflow / 24)}s` }}>
          <span ref={title} className="chat-nav-title-text">{thread.title}</span>
        </span>
      </TooltipTrigger>
    <span className="chat-nav-status" aria-hidden="true">
      {thread.pinned && <PinIcon className="size-3" weight="fill" />}
      {thread.unread && <span className="size-1.5 rounded-full bg-info-foreground" />}
    </span>
    <div className="chat-nav-actions">
      <ChatAction tooltipHandle={tooltipHandle} label={thread.pinned ? 'Unpin chat' : 'Pin chat'} icon={PinIcon} pressed={Boolean(thread.pinned)} onClick={() => updateChatThread(thread.id, { pinned: !thread.pinned })} />
      <ChatAction tooltipHandle={tooltipHandle} label="Archive chat" icon={Archive} onClick={archive} />
    </div>
  </SidebarMenuItem>;
}
