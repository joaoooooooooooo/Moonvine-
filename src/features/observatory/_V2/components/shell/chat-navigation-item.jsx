import { useEffect, useRef, useState } from 'react';
import { Archive } from '@phosphor-icons/react';
import { ChatTeardrop, PinIcon, PinSlashIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { toastManager } from '@/components/ui/toast';
import { chatHref, updateChatThread } from '../../hooks/use-chat-threads';

function placeholderDate(index) {
  const date = new Date();
  date.setDate(date.getDate() - Math.min(index, 6));
  date.setHours(index === 1 ? 2 : 13, 0, 0, 0);
  return date;
}

export function ChatAction({ label, icon: Icon, href, onClick, pressed, tooltipHandle, weight = 'fill' }) {
  return <TooltipTrigger handle={tooltipHandle} payload={{ label }} render={<Button
    type="button"
    size="icon-sm"
    variant="ghost"
    className="size-7 shrink-0 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    render={href ? <a href={href} /> : undefined}
    aria-label={label}
    aria-pressed={href ? undefined : pressed}
    onClick={onClick}
  />}>
    <Icon aria-hidden="true" className="size-4" weight={weight} />
  </TooltipTrigger>;
}

export function ChatNavigationItem({ thread, colorIndex = 0, active, onNavigate, tooltipHandle, href = chatHref(thread.accountId, thread.id), archiveHref = chatHref(thread.accountId) }) {
  const viewport = useRef(null);
  const title = useRef(null);
  const [overflow, setOverflow] = useState(0);
  const timestamp = thread.updatedAt ?? thread.createdAt;
  const date = timestamp ? new Date(timestamp) : null;
  const validDate = date && Number.isFinite(date.getTime()) ? date : placeholderDate(colorIndex);
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
      <TooltipTrigger handle={tooltipHandle} payload={{ title: thread.title, date: validDate, pinned: Boolean(thread.pinned), unread: Boolean(thread.unread) }} render={<SidebarMenuButton data-collapsed-status={thread.unread ? 'info' : thread.pinned ? 'muted' : undefined} render={<a href={href} />} isActive={active}
        aria-current={active ? 'page' : undefined} aria-label={`${thread.title}${thread.unread ? ', unread' : ''}`}
        onClick={() => { updateChatThread(thread.id, { unread: false }); onNavigate?.(); }} className="chat-nav-link h-8 text-foreground" />}>
        <ChatTeardrop aria-hidden="true" className="chat-nav-collapsed-icon size-4.5 shrink-0 text-muted-foreground" weight="light" />
        <span ref={viewport} className="chat-nav-title" data-overflow={overflow > 0} style={{ '--chat-scroll': `${-overflow}px`, '--chat-duration': `${Math.max(4, overflow / 24)}s` }}>
          <span ref={title} className="chat-nav-title-text">{thread.title}</span>
        </span>
      </TooltipTrigger>
    <span className="chat-nav-status" aria-hidden="true">
      {thread.pinned && <PinIcon className="size-4" weight="fill" />}
      {thread.unread && <span className="size-1.5 rounded-full bg-info-foreground" />}
    </span>
    <div className="chat-nav-actions">
      <ChatAction tooltipHandle={tooltipHandle} label={thread.pinned ? 'Unpin chat' : 'Pin chat'} icon={thread.pinned ? PinSlashIcon : PinIcon} pressed={Boolean(thread.pinned)} onClick={(event) => { event.preventDefault(); event.stopPropagation(); updateChatThread(thread.id, { pinned: !thread.pinned }); event.currentTarget.blur(); }} />
      <ChatAction tooltipHandle={tooltipHandle} label="Archive chat" icon={Archive} onClick={archive} />
    </div>
  </SidebarMenuItem>;
}
