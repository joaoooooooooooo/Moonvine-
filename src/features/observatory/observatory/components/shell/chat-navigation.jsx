import { useState } from 'react';
import { ChatCircleText, PinIcon, Plus } from '@/components/ui/icons';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Tooltip, TooltipCreateHandle, TooltipPopup } from '@/components/ui/tooltip';
import { chatHref, consoleChatHref, useChatThreads } from '../../hooks/use-chat-threads';
import { ChatNavigationItem } from './chat-navigation-item';
import { Badge } from '@/components/ui/badge';
import './chat-navigation.css';

export function ChatNavigation({ model, onNavigate, className = '' }) {
  const threads = useChatThreads();
  const [tooltipHandle] = useState(() => TooltipCreateHandle());
  const chats = threads.filter((thread) => thread.accountId === model.selectedAccountId && !thread.archived)
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  const isHome = model.route.path === '/console' && !model.route.threadId;
  const visible = chats.slice(0, isHome ? 7 : 8);
  function formatChatDate(date) {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysAgo = Math.round((startToday - startDate) / 86400000);
    const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: date.getMinutes() ? '2-digit' : undefined, hour12: true });
    if (daysAgo === 0) return `Today ${time}`;
    if (daysAgo === 1) return `Yesterday ${time}`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return <>
    <SidebarGroup className={`gap-1 ${className}`} aria-label="Recent chats">
      <SidebarMenuButton tooltip="Recent chats" className="h-8.5 text-muted-foreground" render={<a href={chatHref(model.selectedAccountId)} aria-label="Recent chats" />} onClick={onNavigate}>
        <ChatCircleText aria-hidden="true" className="chat-nav-collapsed-icon size-4 shrink-0" weight="fill" />
        <span>Recent chats</span>
      </SidebarMenuButton>
    <SidebarMenu className="gap-1">
      {visible.map((thread, index) => <ChatNavigationItem key={thread.id} thread={thread} colorIndex={index} onNavigate={onNavigate} tooltipHandle={tooltipHandle}
        href={model.route.path.startsWith('/console') ? consoleChatHref(thread.accountId, thread.id) : chatHref(thread.accountId, thread.id)}
        archiveHref={model.route.path.startsWith('/console') ? '#/console' : chatHref(thread.accountId)}
        active={model.route.lensId === 'intelligence:chat' && model.route.threadId === thread.id} />)}
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="New chat" render={<a href={chatHref(model.selectedAccountId)} aria-label="New chat" />} onClick={onNavigate} className="h-8 text-muted-foreground">
          <Plus aria-hidden="true" className="size-4" weight="regular" />
          <span>New chat</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
    </SidebarGroup>
    <Tooltip handle={tooltipHandle}>
      {({ payload }) => <TooltipPopup side="right" align="start" sideOffset={12} className={payload?.title ? 'chat-title-tooltip max-w-80 text-sm' : 'max-w-48'}>
        {payload?.title ? <div className="flex flex-col items-start gap-1 text-left">
          {payload.pinned && <PinIcon aria-hidden="true" className="size-4 text-muted-foreground" weight="fill" />}
          <span className="break-words">{payload.title}</span>
          {payload.unread && <span className="flex flex-wrap gap-1">
            {payload.unread && <Badge variant="info" size="lg">Unread</Badge>}
          </span>}
          {payload.date && <time dateTime={payload.date.toISOString()} className="text-xs text-muted-foreground">{formatChatDate(payload.date)}</time>}
        </div> : payload?.label}
      </TooltipPopup>}
    </Tooltip>
  </>;
}
