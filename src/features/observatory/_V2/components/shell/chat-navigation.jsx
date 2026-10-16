import { useId, useState } from 'react';
import { ChevronDown, Plus } from '@/components/ui/icons';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Tooltip, TooltipCreateHandle, TooltipPopup, TooltipProvider } from '@/components/ui/tooltip';
import { chatHref, consoleChatHref, useChatThreads } from '../../hooks/use-chat-threads';
import { ChatNavigationItem } from './chat-navigation-item';
import './chat-navigation.css';

export function ChatNavigation({ model, onNavigate, className = '' }) {
  const threads = useChatThreads();
  const listId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [tooltipHandle] = useState(() => TooltipCreateHandle());
  const chats = threads.filter((thread) => thread.accountId === model.selectedAccountId && !thread.archived)
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  const visible = chats.slice(0, 8);
  return <TooltipProvider delay={600} timeout={400}>
    <SidebarGroup className={`gap-1 ${className}`} aria-label="Recent chats">
      <SidebarMenuButton className="h-8.5 text-muted-foreground" aria-expanded={!collapsed} aria-controls={listId} onClick={() => setCollapsed((value) => !value)}>
        <span>Recent chats</span>
        <ChevronDown aria-hidden="true" className={`size-3.5 shrink-0 transition-transform motion-reduce:transition-none ${collapsed ? 'rotate-180' : ''}`} weight="fill" />
      </SidebarMenuButton>
    <SidebarMenu id={listId} hidden={collapsed} className={`gap-0.5 ${collapsed ? 'hidden' : ''}`}>
      {visible.map((thread) => <ChatNavigationItem key={thread.id} thread={thread} onNavigate={onNavigate} tooltipHandle={tooltipHandle}
        href={model.route.path.startsWith('/console') ? consoleChatHref(thread.accountId, thread.id) : chatHref(thread.accountId, thread.id)}
        archiveHref={model.route.path.startsWith('/console') ? '#/console' : chatHref(thread.accountId)}
        active={model.route.lensId === 'intelligence:chat' && model.route.threadId === thread.id} />)}
      <SidebarMenuItem>
        <SidebarMenuButton render={<a href={chatHref(model.selectedAccountId)} />} onClick={onNavigate} className="h-8 text-muted-foreground">
          <Plus aria-hidden="true" className="size-4" weight="regular" />
          <span>New chat</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
    </SidebarGroup>
    <Tooltip handle={tooltipHandle}>
      {({ payload }) => <TooltipPopup side="right" align="start" sideOffset={12} className={payload?.title ? 'chat-title-tooltip max-w-80 text-sm' : 'max-w-48'}>
        {payload?.title ? <div className="flex flex-col items-start gap-1 text-left">
          <span className="break-words">{payload.title}</span>
          {payload.date ? <time dateTime={payload.date.toISOString()} className="text-xs text-muted-foreground">{payload.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time> : <span className="text-xs text-muted-foreground">Date unavailable</span>}
        </div> : payload?.label}
      </TooltipPopup>}
    </Tooltip>
  </TooltipProvider>;
}
