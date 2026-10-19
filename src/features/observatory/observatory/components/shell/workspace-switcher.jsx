import { SidebarControlTooltip } from './sidebar-control-tooltip';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSidebar } from '@/components/ui/sidebar';

const visibleLimit = 5;

function workspaceRoute(workspaceId) {
  const url = new URL(window.location.hash.slice(1) || '/console', window.location.origin);
  const path = url.pathname;
  if (path === '/console') {
    url.searchParams.delete('chat');
    url.searchParams.delete('account');
  }
  if (path.startsWith('/chat/')) {
    url.pathname = `/chat/${encodeURIComponent(workspaceId)}/new`;
  } else if (/^\/intelligence\/client\/[^/]+\//.test(path)) {
    url.pathname = path.replace(/^\/(intelligence\/client|chat)\/[^/]+\//, `/$1/${encodeURIComponent(workspaceId)}/`);
  } else if (path === '/console/reports') {
    url.searchParams.set('account', workspaceId);
  }
  return url.pathname + url.search;
}

function WorkspaceLabel({ workspace }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-5 shrink-0 rounded-[4px]">
        <AvatarImage src={workspace.imageSrc} alt="" />
        <AvatarFallback className="rounded-[6px]">{workspace.initials}</AvatarFallback>
      </Avatar>
      <span data-slot="workspace-name" className="truncate font-medium">{workspace.name}</span>
    </span>
  );
}

export function WorkspaceSwitcher({ model }) {
  const popupAnchorRef = useRef(null);
  const { setOpenMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const selected = model.accounts.find((item) => item.id === model.selectedAccountId) ?? model.accounts[0];
  const firstFive = model.accounts.slice(0, visibleLimit);
  const visible = selected && !firstFive.some((item) => item.id === selected.id)
    ? [...firstFive.slice(0, visibleLimit - 1), selected]
    : firstFive;

  return (
    <Select
      items={visible.map((workspace) => ({ label: workspace.name, value: workspace.id }))}
      value={selected?.id ?? null}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(id) => {
        if (!id) return;
        model.selectWorkspace(id);
        window.location.hash = workspaceRoute(id);
        setOpen(false);
        setOpenMobile(false);
      }}
    >
      <div ref={popupAnchorRef} className="w-full min-w-0">
        <SidebarControlTooltip label={`Switch workspace: ${selected?.name ?? 'Workspace'}`}><SelectTrigger aria-label="Switch workspace" className="h-auto min-w-0 origin-center border-transparent bg-transparent shadow-none before:hidden transition-transform duration-[190ms] ease-out active:duration-0 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:bg-transparent dark:hover:bg-sidebar-accent [&_[data-slot=select-icon]>svg]:me-0">
          <SelectValue>{(id) => {
            const workspace = model.accounts.find((item) => item.id === id);
            return workspace ? <WorkspaceLabel workspace={workspace} /> : null;
          }}</SelectValue>
        </SelectTrigger></SidebarControlTooltip>
      </div>
      <SelectPopup
        anchor={popupAnchorRef}
        footer={model.accounts.length > visibleLimit && (
          <div className="px-1 pb-1">
            <Button variant="ghost" className="w-full justify-start" onClick={() => {
              setOpen(false);
              setOpenMobile(false);
              window.location.hash = '/console/accounts';
            }}>See all workspaces</Button>
          </div>
        )}
      >
        {visible.map((workspace) => (
          <SelectItem key={workspace.id} value={workspace.id} className="py-1.5">
            <WorkspaceLabel workspace={workspace} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
