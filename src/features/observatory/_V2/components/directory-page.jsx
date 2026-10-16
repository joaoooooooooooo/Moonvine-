import { useState } from 'react';
import { CheckIcon, ChevronDown, ChevronRight, ChevronUp, CopyIcon, Plus } from '@/components/ui/icons';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableProfileAvatar } from './table-profile-avatar';
import { Tag } from '@/components/ui/tag';
import { ObservatoryInput as Input } from './observatory-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { toastManager } from '@/components/ui/toast';
import { directoryRows } from '../data/directory-rows';
import { directorySurfaces } from '../data/navigation';
import { accountHref } from '../utils/observatory-model';
import { PageHeading } from './page-heading';
import { ObservatoryTable } from './observatory-table';

function AddPersonDialog({ onAdd, trigger }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [recipient, setRecipient] = useState('no');

  function setDialogOpen(nextOpen) {
    if (nextOpen) {
      setName('');
      setEmail('');
      setRecipient('no');
    }
    setOpen(nextOpen);
  }

  return <Dialog open={open} onOpenChange={setDialogOpen}>
    <DialogTrigger render={trigger} />
    <DialogPopup className="overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add person</DialogTitle>
        <DialogDescription>Add a workspace member and choose whether they receive reports.</DialogDescription>
      </DialogHeader>
      <Form className="contents" onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim() || !email.trim()) return;
        onAdd({ name: name.trim(), email: email.trim(), recipient: recipient === 'yes' });
        setOpen(false);
      }}>
        <DialogPanel>
          <div className="space-y-5">
            <Field name="person-name">
              <FieldLabel>Name</FieldLabel>
              <Input required autoFocus value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field name="person-email">
              <FieldLabel>Email</FieldLabel>
              <Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            <Field name="person-recipient">
              <FieldLabel>Report recipient</FieldLabel>
              <Tabs value={recipient} onValueChange={setRecipient}>
                <TabsList><TabsTab value="yes">Yes</TabsTab><TabsTab value="no">No</TabsTab></TabsList>
              </Tabs>
            </Field>
          </div>
        </DialogPanel>
        <DialogFooter className="sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
          <Button type="submit" disabled={!name.trim() || !email.trim()}>Add person</Button>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
        </DialogFooter>
      </Form>
    </DialogPopup>
  </Dialog>;
}

export function DirectoryPage({ type, workspaces }) {
  const [query, setQuery] = useState('');
  const [ascending, setAscending] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [recipients, setRecipients] = useState({});
  const [addedPeople, setAddedPeople] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const pageSize = 10;
  const SortIcon = ascending ? ChevronUp : ChevronDown;
  const surface = directorySurfaces.find((item) => item.id === type);
  const baseRows = directoryRows(type, workspaces);
  const rows = type === 'people' ? [...addedPeople, ...baseRows] : baseRows;
  const filtered = rows.filter((row) => `${row.name} ${row.email ?? ''} ${row.domain}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name) * (ascending ? 1 : -1));

  function addPerson(person) {
    const workspace = workspaces[0];
    setAddedPeople((current) => [{ ...person, id: `person-${Date.now()}`, domain: workspace?.name ?? 'Workspace', accountId: workspace?.id, accountImageSrc: workspace?.imageSrc, imageSrc: '' }, ...current]);
    toastManager.add({ description: `${person.name} has been added to this workspace.`, title: 'Person added', type: 'success' });
  }

  async function copyRecipientLink(row) {
    const recipientLink = `${window.location.origin}${window.location.pathname}#/reports/${encodeURIComponent(row.id)}`;
    try {
      await navigator.clipboard.writeText(recipientLink);
      setCopiedId(row.id);
      window.setTimeout(() => setCopiedId((current) => current === row.id ? null : current), 2000);
      toastManager.add({ description: `The recipient link for ${row.name} is ready to share.`, title: 'Recipient link copied', type: 'success' });
    } catch {
      toastManager.add({ description: 'Copy the recipient link again.', title: 'Could not copy link', type: 'error' });
    }
  }

  function openPerson(row) {
    window.location.hash = `#/console/people/${encodeURIComponent(row.id)}`;
  }

  return (
    <div className="v2-page-sections">
      <PageHeading title={surface.detail} />
      <ObservatoryTable label={surface.label} totalRows={rows.length} pagination={{ total: filtered.length, pageIndex, pageSize, onPageChange: setPageIndex }} toolbar={
        <div className="flex flex-wrap items-center gap-3">
          {type === 'people'
            ? <AddPersonDialog onAdd={addPerson} trigger={<Button type="button"><Plus aria-hidden="true" />Add Person</Button>} />
            : <Button type="button" variant="default"><Plus aria-hidden="true" />{type === 'accounts' ? 'Add Workspace' : 'Add Competitor'}</Button>}
          {rows.length >= 15 && <div className="w-full max-w-sm"><Input type="search" aria-label={'Search ' + surface.label.toLowerCase()} placeholder={'Search ' + surface.label.toLowerCase()} value={query} onChange={(event) => { setQuery(event.target.value); setPageIndex(0); }} /></div>}
        </div>
      }>
        <TableHeader>
          <TableRow>
            <TableHead aria-sort={ascending ? 'ascending' : 'descending'}><button type="button" className="flex h-full w-full cursor-pointer select-none items-center justify-start gap-2 rounded-sm text-start focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setAscending(!ascending); setPageIndex(0); }}>{type === 'accounts' ? 'Workspace' : 'Name'}<SortIcon aria-hidden="true" className="size-4 shrink-0 opacity-80" /></button></TableHead>
            {type === 'people' && <TableHead className="hidden sm:table-cell">Email</TableHead>}
            {type !== 'people' && <TableHead className="hidden sm:table-cell">{type === 'accounts' ? 'Domain' : 'Workspace'}</TableHead>}
            {type === 'people' && <TableHead className="hidden w-32 lg:table-cell">Tags</TableHead>}
            {type === 'people' && <TableHead>Recipient</TableHead>}
            {type === 'accounts' && <TableHead className="hidden sm:table-cell">Signal</TableHead>}
            <TableHead className="w-14"><span className="sr-only">{type === 'people' ? 'Copy recipient link' : 'Open workspace'}</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((row) => (
            <TableRow key={row.id} className={`h-12 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ring${type === 'people' ? ' cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring' : ''}`}
              tabIndex={type === 'people' ? 0 : undefined} aria-label={type === 'people' ? `Open ${row.name}` : undefined}
              onClick={(event) => { if (type === 'people' && !event.target.closest('button,[role=tablist]')) openPerson(row); }}
              onKeyDown={(event) => {
                if (type === 'people' && event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  openPerson(row);
                }
              }}>
              <TableCell className="whitespace-normal">
                <div className="flex min-w-0 items-center gap-2.5">
                  <TableProfileAvatar src={row.imageSrc} person={type === 'people'} />
                  <div className="min-w-0 overflow-hidden">
                    {type === 'accounts' ? <a href={accountHref(row.id)} className="relative z-10 block truncate font-medium leading-5 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">{row.name}</a> : <span className="block truncate leading-5">{row.name}</span>}
                    <span className="mt-1 block truncate text-xs leading-5 text-muted-foreground sm:hidden">{row.domain}</span>
                  </div>
                </div>
              </TableCell>
              {type === 'people' && <TableCell className="hidden truncate text-muted-foreground sm:table-cell">{row.email}</TableCell>}
              {type !== 'people' && <TableCell className="hidden text-muted-foreground sm:table-cell">{type === 'accounts' ? row.domain : <div className="flex items-center gap-3"><TableProfileAvatar src={row.accountImageSrc} /><span>{row.domain}</span></div>}</TableCell>}
              {type === 'people' && <TableCell className="hidden lg:table-cell"><Tag>Account user</Tag></TableCell>}
              {type === 'people' && <TableCell>
                <Tabs className="gap-0" size="sm" value={recipients[row.id] ?? (row.recipient ? 'yes' : 'no')} onValueChange={(value) => setRecipients((current) => ({ ...current, [row.id]: value }))}>
                  <TabsList><TabsTab value="yes">Yes</TabsTab><TabsTab value="no">No</TabsTab></TabsList>
                </Tabs>
              </TableCell>}
              {type === 'accounts' && <TableCell className="hidden sm:table-cell"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-info-foreground" />Sources available</span></TableCell>}
              <TableCell>{type === 'people'
                ? (recipients[row.id] ?? (row.recipient ? 'yes' : 'no')) === 'yes' ? <Button type="button" aria-label={copiedId === row.id ? 'Recipient link copied' : `Copy recipient link for ${row.name}`} size="icon" variant="ghost" onClick={() => copyRecipientLink(row)}>{copiedId === row.id ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}</Button> : null
                : <a href={accountHref(row.accountId || row.id)} className="inline-flex items-center justify-center text-muted-foreground outline-none after:absolute after:inset-0" aria-label={'Open ' + row.name + ' workspace'}><ChevronRight aria-hidden="true" className="size-4" /></a>}
              </TableCell>
            </TableRow>
          ))}
          {!filtered.length && <TableRow><TableCell colSpan={type === 'accounts' ? 4 : type === 'people' ? 5 : 3}>
            <Empty><EmptyHeader><EmptyTitle className="text-base font-medium">No matching {surface.label.toLowerCase()}.</EmptyTitle></EmptyHeader><EmptyContent><Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear search</Button></EmptyContent></Empty>
          </TableCell></TableRow>}
        </TableBody>
      </ObservatoryTable>
    </div>
  );
}
