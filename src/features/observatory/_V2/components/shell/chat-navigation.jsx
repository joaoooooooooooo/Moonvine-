import { SquarePen } from 'lucide-react';
import { SidebarGroup, SidebarMenuButton } from '@/components/ui/sidebar';
import { AccountSelectLabel } from '../account-select-label';
import { chatHref, useChatThreads } from '../../hooks/use-chat-threads';

export function ChatNavigation({ model, onNavigate }) {
  const threads = useChatThreads();
  return <SidebarGroup className="gap-3">
    {model.accounts.map((account) => <details key={account.id} open className="group/chat-account">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent [&::-webkit-details-marker]:hidden">
        <AccountSelectLabel account={account} />
      </summary>
      <div className="ml-7 mt-1 space-y-1">
        <SidebarMenuButton render={<a href={chatHref(account.id)} />} onClick={onNavigate} isActive={model.account.id === account.id && !model.route.threadId}>
          <SquarePen aria-hidden="true" /><span>New chat</span>
        </SidebarMenuButton>
        {threads.filter((thread) => thread.accountId === account.id).map((thread) => <SidebarMenuButton key={thread.id} render={<a href={chatHref(account.id, thread.id)} />} onClick={onNavigate} isActive={model.route.threadId === thread.id} title={thread.title}>
          <span>{thread.title}</span>
        </SidebarMenuButton>)}
      </div>
    </details>)}
  </SidebarGroup>;
}
