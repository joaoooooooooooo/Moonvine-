import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSidebar } from '@/components/ui/sidebar';

const visibleLimit = 5;

function WorkspaceLabel({ workspace }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={workspace.imageSrc} alt="" />
        <AvatarFallback>{workspace.initials}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col text-left">
        <span className="truncate font-medium">{workspace.name}</span>
        <span className="truncate text-xs text-muted-foreground">{workspace.domain}</span>
      </span>
    </span>
  );
}

export function WorkspaceSwitcher({ model }) {
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
        window.location.hash = `/console/client/${encodeURIComponent(id)}/current`;
        setOpen(false);
        setOpenMobile(false);
      }}
    >
      <SelectTrigger aria-label="Switch workspace" className="h-auto min-w-0 border-transparent bg-transparent py-1.5 shadow-none before:hidden dark:bg-transparent">
        <SelectValue>{(id) => {
          const workspace = model.accounts.find((item) => item.id === id);
          return workspace ? <WorkspaceLabel workspace={workspace} /> : null;
        }}</SelectValue>
      </SelectTrigger>
      <SelectPopup
        className="space-y-1"
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
