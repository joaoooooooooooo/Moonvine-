import { useEffect, useId, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogClose, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxValue } from '@/components/ui/combobox';
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Building2, Globe, Layers2Icon, Newspaper, Plus, Search, Sparkles } from '@/components/ui/icons';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { PanelFrame, PanelFrameContent, PanelFrameHeader, PanelFrameTitle } from '@/components/ui/panel-frame';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toastManager } from '@/components/ui/toast-manager';
import { PageHeading } from './page-heading';

const NAME_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 144;

const dataSourceSections = [
  { id: 'organization', label: 'Organization' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'social-accounts', label: 'Social accounts' },
  { id: 'news-keywords', label: 'News keywords' },
  { id: 'prompts', label: 'Prompts' },
  { id: 'first-party-data', label: 'First-party data' },
  { id: 'index', label: 'Index' },
  { id: 'access', label: 'Access' },
];

function normalizeDomain(value) {
  return value.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

function isValidDomain(value) {
  return /^(?=.{1,253}$)(?!-)(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}$/i.test(value);
}

function checkDomain(domain) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(isValidDomain(domain) && !domain.toLowerCase().endsWith('.invalid')), 900);
  });
}

function isValidSocialUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname.includes('.'));
  } catch {
    return false;
  }
}

const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', domains: ['instagram.com'], image: '/report-logos/instagram.png' },
  { id: 'linkedin', label: 'LinkedIn', domains: ['linkedin.com'], image: '/report-logos/linkedin.png' },
  { id: 'tiktok', label: 'TikTok', domains: ['tiktok.com'], image: '/report-logos/tiktok.svg' },
  { id: 'facebook', label: 'Facebook', domains: ['facebook.com'], image: '/report-logos/facebook.svg' },
  { id: 'youtube', label: 'YouTube', domains: ['youtube.com', 'youtu.be'], image: '/report-logos/youtube.png' },
  { id: 'x', label: 'X', domains: ['x.com', 'twitter.com'] },
];

const otherSocialPlatform = { id: 'other', label: 'Other social account', domains: [], custom: true };

function getSocialPlatform(value) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, '');
    return socialPlatforms.find((platform) => platform.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)));
  } catch {
    return undefined;
  }
}

function getSocialProfile(value) {
  try {
    const parts = new URL(value).pathname.split('/').filter(Boolean);
    const profile = parts.at(-1);
    return profile ? `@${profile}` : 'Connected';
  } catch {
    return 'Connected';
  }
}

function getFavicon(value) {
  try {
    const hostname = new URL(value).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
  } catch {
    return undefined;
  }
}

function getSocialSiteName(value) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, '');
    const name = hostname.split('.')[0];
    return name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : 'Other social account';
  } catch {
    return 'Other social account';
  }
}

function SocialPlatformIcon({ account, platform }) {
  if (platform.custom) {
    const favicon = account ? getFavicon(account) : undefined;
    return favicon
      ? <span className="flex size-5 items-center justify-center rounded-full border border-border bg-background"><img alt="" className="size-3.5 rounded-sm object-contain" src={favicon} /></span>
      : <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/60"><Plus className="size-3" /></span>;
  }
  if (platform.image) return <img alt="" className="size-5 object-contain" src={platform.image} />;
  return <span className="flex size-5 items-center justify-center rounded-full border text-xs">X</span>;
}

function checkSocialAccount(value, platform) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(isValidSocialUrl(value) && (platform.custom || getSocialPlatform(value)?.id === platform.id)), 900);
  });
}

function EditDialog({ busy = false, children, deleteAction, description, dirty, onOpenChange, onSave, open, popupClassName = '', title, trigger, valid = true }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger render={trigger} />
    <DialogPopup closeProps={{ disabled: busy }} className={`overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md ${popupClassName}`}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
      </DialogHeader>
      <Form className="contents" onSubmit={async (event) => {
        event.preventDefault();
        if (!dirty || !valid || busy) return;
        const shouldClose = await onSave();
        if (shouldClose !== false) onOpenChange(false);
      }}>
        <DialogPanel>{children}</DialogPanel>
        <DialogFooter className="mt-auto sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
          <Button disabled={!dirty || !valid || busy} type="submit">Save</Button>
          <DialogClose render={<Button disabled={busy} variant="ghost" />}>Cancel</DialogClose>
          {deleteAction ? <div className="sm:ms-auto">{deleteAction}</div> : null}
        </DialogFooter>
      </Form>
    </DialogPopup>
  </Dialog>;
}

function TriggerLabel({ children, required = false }) {
  return <FieldLabel>
    {children}
    {required ? <span className="text-destructive" aria-hidden="true">*</span> : null}
  </FieldLabel>;
}

function OrganizationDataSourcePage({ workspace, onSave }) {
  const photoInputId = useId();
  const photoInputRef = useRef(null);
  const domainInputRef = useRef(null);
  const [name, setName] = useState(workspace?.name ?? 'Apta Agency');
  const [domain, setDomain] = useState(() => normalizeDomain(workspace?.domain ?? 'apta.agency'));
  const [imageSrc, setImageSrc] = useState(workspace?.imageSrc ?? '');
  const [nicknames, setNicknames] = useState(() => workspace?.nicknames ?? [workspace?.name ?? 'Apta Agency'].filter(Boolean));
  const [description, setDescription] = useState(workspace?.description ?? '');
  const [openDialog, setOpenDialog] = useState(null);
  const [draftName, setDraftName] = useState(name);
  const [draftDomain, setDraftDomain] = useState(domain);
  const [draftImageSrc, setDraftImageSrc] = useState(imageSrc);
  const [draftNickname, setDraftNickname] = useState('');
  const [draftNicknames, setDraftNicknames] = useState(nicknames);
  const [draftDescription, setDraftDescription] = useState(description);
  const [nicknameError, setNicknameError] = useState('');
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainCheckError, setDomainCheckError] = useState('');
  const nicknameItems = nicknames.map((item) => ({ label: item, value: item }));
  const draftNicknameItems = draftNicknames.map((item) => ({ label: item, value: item }));

  useEffect(() => {
    const nextName = workspace?.name ?? 'Apta Agency';
    const nextDomain = normalizeDomain(workspace?.domain ?? 'apta.agency');
    const nextImageSrc = workspace?.imageSrc ?? '';
    const nextNicknames = workspace?.nicknames ?? [nextName].filter(Boolean);
    const nextDescription = workspace?.description ?? '';
    setName(nextName);
    setDomain(nextDomain);
    setImageSrc(nextImageSrc);
    setNicknames(nextNicknames);
    setDescription(nextDescription);
    setOpenDialog(null);
  }, [workspace?.description, workspace?.domain, workspace?.id, workspace?.imageSrc, workspace?.name, workspace?.nicknames]);

  function saveProfile(updates) {
    const next = { name, domain, imageSrc, nicknames, description, ...updates };
    setName(next.name);
    setDomain(next.domain);
    setImageSrc(next.imageSrc);
    setNicknames(next.nicknames);
    setDescription(next.description);
    onSave?.(workspace?.id, next);
    // Domain changes have their own notification with an Undo action.
    const field = Object.keys(updates).find((key) => key !== 'domain');
    const labels = { name: 'Organization name', imageSrc: 'Profile picture', nicknames: 'Nicknames', description: 'Description' };
    if (field) toastManager.add({ title: `${labels[field] ?? 'Organization'} updated`, type: 'success' });
  }

  function setDialog(field, open) {
    if (open) {
      setDraftName(name);
      setDraftDomain(domain);
      setDraftImageSrc(imageSrc);
      setDraftNickname('');
      setDraftNicknames(nicknames);
      setDraftDescription(description);
      setNicknameError('');
      setDomainChecking(false);
      setDomainCheckError('');
    }
    setOpenDialog(open ? field : null);
  }

  function addDraftNickname() {
    const value = draftNickname.trim();
    if (!value || draftNicknames.some((item) => item.toLowerCase() === value.toLowerCase())) return;
    if (draftNicknames.length >= 5) {
      setNicknameError('You can add up to 5 nicknames.');
      return;
    }
    setDraftNicknames((items) => [...items, value]);
    setDraftNickname('');
    setNicknameError('');
  }

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraftImageSrc(URL.createObjectURL(file));
  }

  async function saveDomain() {
    const nextDomain = normalizeDomain(draftDomain.trim());
    setDomainChecking(true);
    setDomainCheckError('');
    try {
      const valid = await checkDomain(nextDomain);
      if (!valid) {
        setDomainCheckError('Please add a valid domain.');
        return false;
      }
      const previousDomain = domain;
      saveProfile({ domain: nextDomain });
      const toastId = toastManager.add({
        actionProps: {
          children: 'Undo',
          onClick: () => {
            setDomain(previousDomain);
            setDraftDomain(previousDomain);
            onSave?.(workspace?.id, { domain: previousDomain });
            toastManager.close(toastId);
            toastManager.add({
              description: 'The previous domain has been restored.',
              title: 'Domain change undone',
              type: 'info',
            });
          },
        },
        description: 'Your domain has been updated.',
        timeout: 5000,
        title: 'Domain updated',
        type: 'success',
      });
      return true;
    } finally {
      setDomainChecking(false);
    }
  }

  return <div className="v2-page-sections">
    <PageHeading title="Manage your organization details." />
    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader>
        <Building2 aria-hidden="true" className="size-4 shrink-0" />
        <PanelFrameTitle render={<h2 />}>Watched Organization Details</PanelFrameTitle>
      </PanelFrameHeader>
      <PanelFrameContent>
        <EditDialog title="Profile picture" description="PNG, JPG, or WebP." open={openDialog === 'photo'}
          onOpenChange={(open) => setDialog('photo', open)} dirty={draftImageSrc !== imageSrc}
          onSave={() => saveProfile({ imageSrc: draftImageSrc })}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="organization-photo-preview" role="button" tabIndex={0}>
            <TriggerLabel>Profile picture</TriggerLabel>
            <div className="flex items-center gap-4">
              <Avatar className="size-9 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
                <AvatarImage src={imageSrc} alt="" />
                <AvatarFallback>{workspace?.initials ?? name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="inline-flex h-9 items-center rounded-lg bg-secondary px-[calc(--spacing(3)-1px)] font-medium text-secondary-foreground text-sm sm:h-8">Change picture</span>
            </div>
          </Field>}>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
              <AvatarImage src={draftImageSrc} alt="" />
              <AvatarFallback>{workspace?.initials ?? name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <input ref={photoInputRef} id={photoInputId} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectPhoto} />
            <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>Choose picture</Button>
          </div>
        </EditDialog>

        <Separator />

        <EditDialog title="Organization name" description="The name used across reports and your workspace." open={openDialog === 'name'}
          onOpenChange={(open) => setDialog('name', open)} dirty={draftName.trim() !== name}
          onSave={() => saveProfile({ name: draftName.trim() })}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="organization-name-preview" role="button" tabIndex={0}>
            <TriggerLabel required>Organization name</TriggerLabel>
            <InputGroup variant="muted" className="pointer-events-none">
              <InputGroupInput readOnly size="lg" aria-label="Organization name" value={name} />
            </InputGroup>
          </Field>}>
          <Field name="organization-name">
            <InputGroup variant="muted">
              <InputGroupInput required maxLength={NAME_MAX_LENGTH} size="lg" aria-label="Organization name" name="organization-name" autoComplete="organization" value={draftName} onChange={(event) => setDraftName(event.target.value)} />
            </InputGroup>
            <FieldDescription><span className="tabular-nums">{NAME_MAX_LENGTH - draftName.length}</span> characters left</FieldDescription>
          </Field>
        </EditDialog>

        <Separator />

        <EditDialog title="Watched domain" description="The primary website Moonvine watches for this organization." open={openDialog === 'domain'}
          onOpenChange={(open) => { if (!domainChecking) setDialog('domain', open); }} dirty={normalizeDomain(draftDomain.trim()) !== domain}
          busy={domainChecking}
          valid={isValidDomain(normalizeDomain(draftDomain.trim()))}
          onSave={saveDomain}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="watched-domain-preview" role="button" tabIndex={0}>
            <TriggerLabel required>Watched domain</TriggerLabel>
            <InputGroup variant="muted" className="pointer-events-none">
              <InputGroupAddon className="text-muted-foreground">https://</InputGroupAddon>
              <InputGroupInput readOnly size="lg" aria-label="Watched domain" value={domain} className="*:[input]:ps-0!" />
            </InputGroup>
          </Field>}>
          <Field invalid={Boolean(domainCheckError) || !isValidDomain(normalizeDomain(draftDomain.trim()))} name="watched-domain">
            {domainChecking ? <InputGroup variant="muted">
              <InputGroupInput disabled size="lg" aria-label="Checking domain" placeholder="Checking domain…" type="search" />
              <InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon>
            </InputGroup> : <InputGroup variant="muted">
              <InputGroupAddon className="text-muted-foreground">https://</InputGroupAddon>
              <InputGroupInput ref={domainInputRef} autoFocus required pattern="(?=.{1,253}$)(?!-)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}" aria-invalid={(Boolean(domainCheckError) || !isValidDomain(normalizeDomain(draftDomain.trim()))) || undefined} size="lg" aria-label="Watched domain" name="watched-domain" inputMode="url" autoComplete="url" value={draftDomain} className="*:[input]:ps-0!"
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => { setDraftDomain(normalizeDomain(event.target.value)); setDomainCheckError(''); }} />
            </InputGroup>}
            {domainCheckError ? <FieldDescription className="text-destructive-foreground">{domainCheckError}</FieldDescription>
              : !isValidDomain(normalizeDomain(draftDomain.trim())) ? <FieldDescription className="text-destructive-foreground">This domain isn&apos;t valid.</FieldDescription>
                : null}
          </Field>
        </EditDialog>

        <Separator />

        <EditDialog title="Approved nicknames" description="Add names Moonvine should recognize in reports." open={openDialog === 'nicknames'}
          onOpenChange={(open) => setDialog('nicknames', open)} dirty={JSON.stringify(draftNicknames) !== JSON.stringify(nicknames)}
          onSave={() => saveProfile({ nicknames: draftNicknames })}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="approved-nicknames-preview" role="button" tabIndex={0}>
            <TriggerLabel>Approved nicknames</TriggerLabel>
            <Combobox disabled items={nicknameItems} multiple value={nicknameItems}>
              <ComboboxChips className="pointer-events-none border-transparent bg-muted shadow-none has-disabled:opacity-100 before:hidden dark:bg-muted">
                <ComboboxValue>
                  {(value) => <>
                    {value?.map((item) => <ComboboxChip aria-label={item.label} key={item.value}>{item.label}</ComboboxChip>)}
                    <ComboboxChipsInput readOnly size="lg" aria-label="Approved nicknames" placeholder={value.length > 0 ? undefined : 'No approved nicknames'} />
                  </>}
                </ComboboxValue>
              </ComboboxChips>
            </Combobox>
          </Field>}>
          <Field invalid={Boolean(nicknameError)} name="nickname">
            <Combobox items={draftNicknameItems} multiple value={draftNicknameItems}
              onValueChange={(items) => { setDraftNicknames(items.map((item) => item.value)); setNicknameError(''); }}>
              <ComboboxChips aria-invalid={Boolean(nicknameError)} className="border-transparent bg-muted shadow-none before:hidden dark:bg-muted">
                <ComboboxValue>
                  {(value) => <>
                    {value?.map((item) => <ComboboxChip aria-label={item.label} key={item.value}>{item.label}</ComboboxChip>)}
                    <ComboboxChipsInput size="lg" name="nickname" aria-label="Add an approved nickname"
                      placeholder={value.length > 0 ? undefined : 'e.g., NYT for The New York Times'} value={draftNickname}
                      onChange={(event) => { setDraftNickname(event.target.value); setNicknameError(''); }} onKeyDown={(event) => {
                        if (event.key === 'Enter') { event.preventDefault(); addDraftNickname(); }
                      }} />
                  </>}
                </ComboboxValue>
              </ComboboxChips>
            </Combobox>
            <FieldDescription className={nicknameError ? 'text-destructive-foreground' : undefined}>Choose up to 5 nicknames.</FieldDescription>
          </Field>
        </EditDialog>

        <Separator />

        <EditDialog title="Organization description" description="Describe what your organization does." open={openDialog === 'description'}
          onOpenChange={(open) => setDialog('description', open)} dirty={draftDescription !== description}
          onSave={() => saveProfile({ description: draftDescription })}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="organization-description-preview" role="button" tabIndex={0}>
            <TriggerLabel>Organization description</TriggerLabel>
            <Textarea readOnly size="lg" aria-label="Organization description" value={description} placeholder="Describe your organization" className="pointer-events-none border-transparent bg-muted shadow-none before:hidden dark:bg-muted" />
          </Field>}>
          <Field name="organization-description">
            <Textarea size="lg" aria-label="Organization description" name="organization-description" maxLength={DESCRIPTION_MAX_LENGTH}
              placeholder="Describe your organization" value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)}
              className="border-transparent bg-muted shadow-none before:hidden dark:bg-muted" />
            <FieldDescription><span className="tabular-nums">{DESCRIPTION_MAX_LENGTH - draftDescription.length}</span> characters left</FieldDescription>
          </Field>
        </EditDialog>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

function SocialAccountsDataSourcePage({ workspace, onSave }) {
  const defaultAccounts = workspace?.socialAccounts ?? ['https://www.linkedin.com/company/aptaagency'];
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [activePlatformId, setActivePlatformId] = useState(null);
  const [draftAccount, setDraftAccount] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountChecking, setAccountChecking] = useState(false);

  useEffect(() => {
    const nextAccounts = workspace?.socialAccounts ?? ['https://www.linkedin.com/company/aptaagency'];
    setAccounts(nextAccounts);
    setActivePlatformId(null);
    setDraftAccount('');
    setAccountError('');
    setAccountChecking(false);
  }, [workspace?.id, workspace?.socialAccounts]);

  const suggestedAccounts = [
    `https://www.linkedin.com/company/${workspace?.id ?? 'aptaagency'}`,
    `https://www.instagram.com/${workspace?.id ?? 'aptaagency'}`,
  ];
  const allSuggestionsSelected = suggestedAccounts.every((item) => accounts.includes(item));
  const customAccounts = accounts.filter((item) => !getSocialPlatform(item));

  function saveAccounts(nextAccounts, platformLabel = 'Social accounts', notification) {
    const previousAccounts = accounts;
    setAccounts(nextAccounts);
    onSave?.(workspace?.id, { socialAccounts: nextAccounts });
    const toastId = toastManager.add({
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setAccounts(previousAccounts);
          onSave?.(workspace?.id, { socialAccounts: previousAccounts });
          toastManager.close(toastId);
          toastManager.add({ description: 'The previous accounts have been restored.', title: 'Account change undone', type: 'info' });
        },
      },
      description: notification?.description ?? `${platformLabel} has been updated.`,
      timeout: 5000,
      title: notification?.title ?? 'Social accounts updated',
      type: 'success',
    });
  }

  async function saveAccount(platform, previousAccount) {
    const value = draftAccount.trim();
    setAccountChecking(true);
    setAccountError('');
    const valid = await checkSocialAccount(value, platform);
    setAccountChecking(false);
    if (!valid) {
      setAccountError(`Please add a valid ${platform.label} link.`);
      return false;
    }
    const nextAccounts = platform.custom
      ? previousAccount ? accounts.map((item) => item === previousAccount ? value : item) : [...accounts, value]
      : [...accounts.filter((item) => getSocialPlatform(item)?.id !== platform.id), value];
    saveAccounts(nextAccounts, platform.label);
    return true;
  }

  function setDialogOpen(platform, account, dialogId, nextOpen) {
    if (nextOpen) {
      setDraftAccount(account ?? '');
      setAccountError('');
      setAccountChecking(false);
    }
    setActivePlatformId(nextOpen ? dialogId : null);
  }

  function addSuggestions() {
    const nextAccounts = [...new Set([...accounts, ...suggestedAccounts])];
    if (nextAccounts.length !== accounts.length) saveAccounts(nextAccounts);
  }

  function disconnectAccount(account, platformLabel) {
    saveAccounts(accounts.filter((item) => item !== account), platformLabel, {
      description: `${platformLabel} has been disconnected.`,
      title: 'Account disconnected',
    });
  }

  function renderAccountRow(platform, account, dialogId, addRow = false) {
    return <EditDialog key={dialogId} title={addRow ? 'Connect another social account' : platform.label}
      description={addRow ? 'Add a profile link from another social platform.' : `Add the ${platform.label} profile or company page Moonvine should track.`}
      open={activePlatformId === dialogId} onOpenChange={(nextOpen) => setDialogOpen(platform, account, dialogId, nextOpen)}
      dirty={draftAccount.trim() !== (account ?? '')} busy={accountChecking}
      valid={isValidSocialUrl(draftAccount.trim()) && !accountError} onSave={() => saveAccount(platform, account)}
      deleteAction={account ? <AlertDialog>
        <AlertDialogTrigger render={<Button type="button" variant="ghost" className="text-destructive-foreground hover:bg-destructive/8" />}>Disconnect account</AlertDialogTrigger>
        <AlertDialogPopup className="overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {platform.label}?</AlertDialogTitle>
            <AlertDialogDescription>Moonvine will stop tracking this account. You can reconnect it later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
            <AlertDialogClose render={<Button variant="destructive" onClick={() => {
              disconnectAccount(account, platform.label);
              setActivePlatformId(null);
            }} />}>Disconnect account</AlertDialogClose>
            <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog> : null}
      trigger={<TableRow className={`h-12 cursor-pointer outline-none transition-colors hover:!bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${!account ? 'text-muted-foreground' : ''}`} role="button" tabIndex={0} aria-label={`${account ? 'Edit' : 'Add'} ${platform.label} account`}>
        <TableCell className="ps-5"><span className="flex items-center gap-2.5 font-medium"><SocialPlatformIcon account={account} platform={platform} />{platform.label}</span></TableCell>
        <TableCell>{account ? getSocialProfile(account) : addRow ? null : '-'}</TableCell>
        <TableCell className="pe-5">{addRow
          ? null
          : <span className="inline-flex items-center gap-2"><span aria-hidden="true" className={account ? 'size-2 rounded-full bg-success-foreground' : 'size-2 rounded-full bg-muted-foreground/40'} />{account ? 'Connected' : 'Not connected'}</span>}
        </TableCell>
      </TableRow>}>
      <Field invalid={Boolean(accountError) || (Boolean(draftAccount) && !isValidSocialUrl(draftAccount.trim()))} name={`${dialogId}-account-url`}>
        {accountChecking ? <InputGroup variant="muted">
          <InputGroupAddon><span className="flex size-5 items-center justify-center"><SocialPlatformIcon account={account} platform={platform} /></span></InputGroupAddon>
          <InputGroupInput disabled size="lg" aria-label={`Checking ${platform.label} account`} placeholder="Checking account…" type="search" />
          <InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon>
        </InputGroup> : <InputGroup variant="muted">
          <InputGroupAddon><span className="flex size-5 items-center justify-center"><SocialPlatformIcon account={account} platform={platform} /></span></InputGroupAddon>
          <InputGroupInput autoFocus size="lg" name={`${dialogId}-account-url`} aria-label={`${platform.label} account URL`}
            placeholder={platform.custom ? 'https://dribbble.com/your-profile' : `https://${platform.domains[0]}/your-profile`} inputMode="url" autoComplete="url" value={draftAccount}
            onFocus={(event) => { if (account) event.currentTarget.select(); }}
            onChange={(event) => { setDraftAccount(event.target.value); setAccountError(''); }} />
        </InputGroup>}
        {accountError ? <FieldDescription className="text-destructive-foreground">{accountError}</FieldDescription>
          : draftAccount && !isValidSocialUrl(draftAccount.trim()) ? <FieldDescription className="text-destructive-foreground">This link isn&apos;t valid.</FieldDescription> : null}
      </Field>
    </EditDialog>;
  }

  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="Social accounts" />
      <p className="text-muted-foreground text-sm">Saved to this account.</p>
    </div>
    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader className="!min-h-10 grid grid-cols-3 gap-0 px-0 py-0 font-medium text-sm">
        <span className="flex h-10 items-center ps-5">Platform</span>
        <span className="flex h-10 items-center px-2.5">Profile</span>
        <span className="flex h-10 items-center pe-5 ps-2.5">Status</span>
      </PanelFrameHeader>
      <PanelFrameContent className="min-w-0 overflow-hidden">
        <Table className="min-w-0 table-fixed overflow-hidden">
          <TableBody>{socialPlatforms.map((platform) => {
            const account = accounts.find((item) => getSocialPlatform(item)?.id === platform.id);
            return renderAccountRow(platform, account, platform.id);
          })}
          {customAccounts.map((account, index) => renderAccountRow({ ...otherSocialPlatform, label: getSocialSiteName(account) }, account, `other-${index}`))}
          {renderAccountRow({ ...otherSocialPlatform, label: 'Add other platform' }, null, 'other-add', true)}</TableBody>
        </Table>
        <Separator />
        <div className="flex justify-start p-5">
          <Button type="button" disabled={allSuggestionsSelected} onClick={addSuggestions}>Suggest accounts<Sparkles aria-hidden="true" weight="fill" /></Button>
        </div>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

function NewsKeywordsDataSourcePage({ workspace, onSave }) {
  const defaultTopics = workspace?.newsKeywords ?? ['Apta Agency', 'creative video production', 'AI video production'];
  const [topics, setTopics] = useState(defaultTopics);
  const [draftTopics, setDraftTopics] = useState(defaultTopics);
  const [draftTopic, setDraftTopic] = useState('');
  const [open, setOpen] = useState(false);
  const suggestedTopics = ['brand design', 'creative agency', 'video marketing'];
  const allSuggestionsSelected = suggestedTopics.every((topic) => topics.includes(topic));

  useEffect(() => {
    const nextTopics = workspace?.newsKeywords ?? ['Apta Agency', 'creative video production', 'AI video production'];
    setTopics(nextTopics);
    setDraftTopics(nextTopics);
    setDraftTopic('');
    setOpen(false);
  }, [workspace?.id, workspace?.newsKeywords]);

  function addDraftTopic() {
    const value = draftTopic.trim();
    if (!value || draftTopics.some((topic) => topic.toLowerCase() === value.toLowerCase())) return;
    setDraftTopics((current) => [...current, value]);
    setDraftTopic('');
  }

  function saveTopics(nextTopics) {
    const previousTopics = topics;
    setTopics(nextTopics);
    setDraftTopics(nextTopics);
    onSave?.(workspace?.id, { newsKeywords: nextTopics });
    const toastId = toastManager.add({
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setTopics(previousTopics);
          setDraftTopics(previousTopics);
          onSave?.(workspace?.id, { newsKeywords: previousTopics });
          toastManager.close(toastId);
          toastManager.add({ description: 'The previous topics have been restored.', title: 'Topic change undone', type: 'info' });
        },
      },
      description: 'Your news watchlist has been updated.',
      timeout: 5000,
      title: 'News topics updated',
      type: 'success',
    });
  }

  function setDialogOpen(nextOpen) {
    if (nextOpen) {
      setDraftTopics(topics);
      setDraftTopic('');
    }
    setOpen(nextOpen);
  }

  function suggestTopics() {
    const nextTopics = [...new Set([...topics, ...suggestedTopics])];
    if (nextTopics.length !== topics.length) saveTopics(nextTopics);
  }

  function topicTags(values, editable = false) {
    const items = values.map((topic) => ({ label: topic, value: topic }));
    return <Combobox disabled={!editable} items={items} multiple value={items}
      onValueChange={editable ? (nextItems) => setDraftTopics(nextItems.map((item) => item.value)) : undefined}>
      <ComboboxChips className="!min-h-0 !w-auto !rounded-none !border-0 !bg-transparent !p-0 !shadow-none !ring-0 has-disabled:opacity-100 before:!hidden dark:!bg-transparent">
        <ComboboxValue>{(value) => <>
          {value?.map((item) => <ComboboxChip aria-label={item.label} key={item.value}>{item.label}</ComboboxChip>)}
        </>}</ComboboxValue>
        <ComboboxChipsInput readOnly size="lg" aria-hidden="true" tabIndex={-1} className="hidden" />
      </ComboboxChips>
    </Combobox>;
  }

  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="News watchlist" />
      <p className="max-w-7xl text-base leading-6 text-muted-foreground">Moonvine starts with approved account names, saved competitors, and targeted business moves. Keep only the terms that make the weekly read more useful.</p>
    </div>
    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader>
        <Newspaper aria-hidden="true" className="size-4 shrink-0" />
        <PanelFrameTitle render={<h2 />}>Topics</PanelFrameTitle>
      </PanelFrameHeader>
      <PanelFrameContent>
        <EditDialog title="News topics" description="Moonvine uses these terms to separate useful news from noise." open={open}
          onOpenChange={setDialogOpen} dirty={JSON.stringify(draftTopics) !== JSON.stringify(topics)}
          onSave={() => saveTopics(draftTopics)}
          trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="news-topics-preview" role="button" tabIndex={0}>
            <TriggerLabel>Topics</TriggerLabel>
            <InputGroup variant="muted" className="pointer-events-none">
              <InputGroupInput readOnly size="lg" aria-label="Add a news topic" placeholder="Brand or topic phrase" />
            </InputGroup>
            {topics.length ? topicTags(topics) : <p className="text-muted-foreground text-sm">No news topics</p>}
          </Field>}>
          <Field name="news-topic">
            <InputGroup variant="muted">
              <InputGroupInput autoFocus size="lg" name="news-topic" aria-label="News topic" placeholder="Brand or topic phrase" value={draftTopic}
                onChange={(event) => setDraftTopic(event.target.value)} onKeyDown={(event) => {
                  if (event.key === 'Enter') { event.preventDefault(); addDraftTopic(); }
                }} />
            </InputGroup>
            {draftTopics.length ? topicTags(draftTopics, true) : null}
            <FieldDescription>Press Enter to add a topic.</FieldDescription>
          </Field>
        </EditDialog>
        <Separator />
        <div className="flex justify-start p-5">
          <Button type="button" disabled={allSuggestionsSelected} onClick={suggestTopics}>Suggest news topics<Sparkles aria-hidden="true" weight="fill" /></Button>
        </div>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

const competitorSuggestions = [
  { id: 'curio-digital', name: 'Curio Digital', domain: 'curiodigital.io', reason: 'Direct category competitor' },
  { id: 'hlabs', name: 'HLabs', domain: 'hlabs.co.uk', reason: 'Direct category competitor' },
  { id: 'superside', name: 'Superside', domain: 'superside.com', reason: 'Direct category competitor' },
  { id: 'virago-development', name: 'Virago Development', domain: 'viragodevelopment.com', reason: 'Possible organization competitor' },
  { id: 'north-street-creative', name: 'North Street Creative', domain: 'northstreetcreative.com', reason: 'Possible organization competitor' },
  { id: 'kunstenaarsmateriaal', name: 'Kunstenaarsmateriaal', domain: 'kunstenaarsmateriaal.nl', reason: 'Possible organization competitor' },
  { id: 'xrezlab', name: 'Xrezlab', domain: 'xrezlab.org', reason: 'Possible organization competitor' },
  { id: 'artandscienceagency', name: 'Artandscienceagency', domain: 'artandscienceagency.com', reason: 'Possible organization competitor' },
];

function CompetitorsDataSourcePage({ workspace, onSave }) {
  const defaultCompetitors = workspace?.competitors ?? competitorSuggestions.slice(0, 3);
  const [competitors, setCompetitors] = useState(defaultCompetitors);
  const [availableCompetitors, setAvailableCompetitors] = useState(() => [...defaultCompetitors, ...competitorSuggestions.filter((item) => !defaultCompetitors.some((selected) => selected.id === item.id))]);
  const [draftCompetitors, setDraftCompetitors] = useState(defaultCompetitors);
  const [open, setOpen] = useState(false);
  const [activeCompetitorId, setActiveCompetitorId] = useState(null);
  const [draftCompetitorDomain, setDraftCompetitorDomain] = useState('');
  const [competitorChecking, setCompetitorChecking] = useState(false);
  const [competitorError, setCompetitorError] = useState('');

  useEffect(() => {
    const nextCompetitors = workspace?.competitors ?? competitorSuggestions.slice(0, 3);
    setCompetitors(nextCompetitors);
    setAvailableCompetitors([...nextCompetitors, ...competitorSuggestions.filter((item) => !nextCompetitors.some((selected) => selected.id === item.id))]);
    setAvailableCompetitors((current) => [...nextCompetitors, ...current.filter((item) => !nextCompetitors.some((selected) => selected.id === item.id))]);
    setDraftCompetitors(nextCompetitors);
    setOpen(false);
    setActiveCompetitorId(null);
    setDraftCompetitorDomain('');
    setCompetitorChecking(false);
    setCompetitorError('');
  }, [workspace?.competitors, workspace?.id]);

  function saveCompetitors(nextCompetitors, notification) {
    const previousCompetitors = competitors;
    setCompetitors(nextCompetitors);
    setDraftCompetitors(nextCompetitors);
    onSave?.(workspace?.id, { competitors: nextCompetitors });
    const toastId = toastManager.add({
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setCompetitors(previousCompetitors);
          setDraftCompetitors(previousCompetitors);
          onSave?.(workspace?.id, { competitors: previousCompetitors });
          toastManager.close(toastId);
          toastManager.add({ description: 'The previous competitors have been restored.', title: 'Competitor change undone', type: 'info' });
        },
      },
      description: notification?.description ?? 'Your tracked competitors have been updated.',
      timeout: 5000,
      title: notification?.title ?? 'Competitors updated',
      type: 'success',
    });
  }

  function setDialogOpen(nextOpen) {
    if (nextOpen) setDraftCompetitors(competitors);
    setOpen(nextOpen);
  }

  function setCompetitorDialogOpen(competitor, nextOpen) {
    if (nextOpen) {
      setDraftCompetitorDomain(competitor.domain);
      setCompetitorChecking(false);
      setCompetitorError('');
    }
    setActiveCompetitorId(nextOpen ? competitor.id : null);
  }

  async function saveCompetitorDomain(competitor) {
    const domain = normalizeDomain(draftCompetitorDomain.trim());
    setCompetitorChecking(true);
    setCompetitorError('');
    const valid = await checkDomain(domain);
    setCompetitorChecking(false);
    if (!valid) {
      setCompetitorError('Please add a valid domain.');
      return false;
    }
    saveCompetitors(competitors.map((item) => item.id === competitor.id ? { ...item, domain } : item), {
      description: `${competitor.name} has been updated.`,
      title: 'Competitor updated',
    });
    return true;
  }

  function disconnectCompetitor(competitor) {
    saveCompetitors(competitors.filter((item) => item.id !== competitor.id), {
      description: `${competitor.name} is no longer being watched.`,
      title: 'Competitor disconnected',
    });
    setActiveCompetitorId(null);
  }

  function toggleWatching(competitor) {
    const watching = competitors.some((item) => item.id === competitor.id);
    if (!watching && competitors.length >= 3) return;
    saveCompetitors(watching ? competitors.filter((item) => item.id !== competitor.id) : [...competitors, competitor], {
      description: `${competitor.name} is ${watching ? 'no longer being watched' : 'now being watched'}.`,
      title: watching ? 'Competitor unwatched' : 'Competitor watched',
    });
  }

  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="Competitors" />
      <p className="max-w-7xl text-base leading-6 text-muted-foreground">Choose up to three organizations that customers would genuinely compare with you.</p>
    </div>
    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader className="!min-h-10 grid grid-cols-3 gap-0 px-0 py-0 font-medium text-sm">
        <span className="flex h-10 items-center gap-2 ps-5">Competitor <span className="text-muted-foreground tabular-nums">{competitors.length}/3 watching</span></span>
        <span className="flex h-10 items-center px-2.5">Website</span>
        <span className="flex h-10 items-center pe-5 ps-2.5">Status</span>
      </PanelFrameHeader>
      <PanelFrameContent className="min-w-0 overflow-hidden">
        <Table className="min-w-0 table-fixed overflow-hidden">
          <colgroup><col className="w-1/3" /><col className="w-1/3" /><col className="w-1/3" /></colgroup>
          <TableBody>{availableCompetitors.map((competitor) => <EditDialog key={competitor.id} title={competitor.name} description="Update the website Moonvine watches for this competitor."
            open={activeCompetitorId === competitor.id} onOpenChange={(nextOpen) => { if (!competitorChecking) setCompetitorDialogOpen(competitor, nextOpen); }}
            dirty={normalizeDomain(draftCompetitorDomain.trim()) !== competitor.domain} busy={competitorChecking}
            valid={isValidDomain(normalizeDomain(draftCompetitorDomain.trim())) && !competitorError} onSave={() => saveCompetitorDomain(competitor)}
            deleteAction={<AlertDialog>
              <AlertDialogTrigger render={<Button type="button" variant="ghost" className="text-destructive-foreground hover:bg-destructive/8" />}>Stop watching</AlertDialogTrigger>
              <AlertDialogPopup className="overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Stop watching {competitor.name}?</AlertDialogTitle>
                  <AlertDialogDescription>Moonvine will stop tracking this competitor. You can add it again later.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
                  <AlertDialogClose render={<Button variant="destructive" onClick={() => disconnectCompetitor(competitor)} />}>Stop watching</AlertDialogClose>
                  <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>}
            trigger={<TableRow className="h-12 cursor-pointer outline-none transition-colors hover:!bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" role="button" tabIndex={0} aria-label={`Edit ${competitor.name}`}>
              <TableCell className="w-1/3 min-w-0 ps-5 font-medium"><span className="flex min-w-0 items-center gap-2.5">
                <img alt="" className="size-5 shrink-0 rounded-sm object-contain" src={getFavicon(`https://${competitor.domain}`)} />
                <span className="min-w-0 truncate">{competitor.name}</span>
              </span></TableCell>
              <TableCell className="w-1/3 min-w-0 text-muted-foreground"><span className="block truncate">{competitor.domain}</span></TableCell>
              <TableCell className="w-1/3 min-w-0 pe-5"><span className="inline-flex items-center gap-2 whitespace-nowrap" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}><Checkbox checked={competitors.some((item) => item.id === competitor.id)} disabled={!competitors.some((item) => item.id === competitor.id) && competitors.length >= 3} onCheckedChange={() => toggleWatching(competitor)} aria-label={`${competitors.some((item) => item.id === competitor.id) ? 'Stop watching' : 'Watch'} ${competitor.name}`} />{competitors.some((item) => item.id === competitor.id) ? 'Watching' : 'Not watching'}</span></TableCell>
            </TableRow>}>
            <Field invalid={Boolean(competitorError) || !isValidDomain(normalizeDomain(draftCompetitorDomain.trim()))} name={`${competitor.id}-domain`}>
              {competitorChecking ? <InputGroup variant="muted">
                <InputGroupInput disabled size="lg" aria-label="Checking competitor domain" placeholder="Checking domain…" type="search" />
                <InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon>
              </InputGroup> : <InputGroup variant="muted">
                <InputGroupAddon className="text-muted-foreground">https://</InputGroupAddon>
                <InputGroupInput autoFocus required size="lg" aria-label={`${competitor.name} website`} inputMode="url" autoComplete="url" value={draftCompetitorDomain} className="*:[input]:ps-0!"
                  onFocus={(event) => event.currentTarget.select()} onChange={(event) => { setDraftCompetitorDomain(normalizeDomain(event.target.value)); setCompetitorError(''); }} />
              </InputGroup>}
              {competitorError ? <FieldDescription className="text-destructive-foreground">{competitorError}</FieldDescription>
                : !isValidDomain(normalizeDomain(draftCompetitorDomain.trim())) ? <FieldDescription className="text-destructive-foreground">This domain isn&apos;t valid.</FieldDescription> : null}
            </Field>
          </EditDialog>)}</TableBody>
        </Table>
        <Separator />
        <div className="flex justify-start p-5">
          <EditDialog title="Suggest competitors" description="Select up to three organizations a customer would genuinely compare with you." open={open}
            onOpenChange={setDialogOpen} dirty={JSON.stringify(draftCompetitors) !== JSON.stringify(competitors)}
            onSave={() => saveCompetitors(draftCompetitors)} popupClassName="sm:min-h-[40rem] sm:max-w-2xl"
            trigger={<Button type="button">Suggest competitors<Sparkles aria-hidden="true" weight="fill" /></Button>}>
            <div>
              <CheckboxGroup value={draftCompetitors.map((competitor) => competitor.id)} onValueChange={(ids) => {
                if (ids.length <= 3) setDraftCompetitors(ids.map((id) => competitorSuggestions.find((competitor) => competitor.id === id)).filter(Boolean));
              }} className="grid w-full grid-cols-2 gap-2">
                {competitorSuggestions.map((competitor) => {
                  const selected = draftCompetitors.some((item) => item.id === competitor.id);
                  const disabled = !selected && draftCompetitors.length >= 3;
                  return <label key={competitor.id} className={`flex w-full min-w-0 flex-col items-start gap-3 rounded-md bg-muted p-3 text-left transition-colors has-[[data-checked]]:bg-accent/70 ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-accent/70'}`}>
                    <Checkbox value={competitor.id} disabled={disabled} />
                    <span className="min-w-0 space-y-1">
                      <span className="block truncate font-medium text-sm text-foreground">{competitor.name}</span>
                      <span className="block truncate text-muted-foreground text-xs">{competitor.domain}</span>
                      <span className="block truncate text-muted-foreground text-xs">{competitor.reason}</span>
                    </span>
                  </label>;
                })}
              </CheckboxGroup>
            </div>
          </EditDialog>
        </div>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

const firstPartySources = [
  { id: 'analytics', label: 'Google Analytics', propertyLabel: 'GA4 property', image: '/orbit-logos/googleanalytics.svg', description: 'Use this if you control the Analytics property for this domain.' },
  { id: 'searchConsole', label: 'Google Search Console', propertyLabel: 'Search Console property', image: '/orbit-logos/googlesearchconsole.svg', description: 'Use this if you control the Search Console property for this domain.' },
];

function FirstPartyConnectionDialog({ connection, onConnect, source, trigger, workspace }) {
  const [introOpen, setIntroOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const workspaceDomain = normalizeDomain(workspace?.domain ?? 'apta.agency');
  const properties = source.id === 'analytics' ? [
    { id: 'workspace', name: workspace?.name ?? 'Apta Agency', domain: workspaceDomain, detail: 'Property ID: 541158462 · America/Sao_Paulo', role: 'Owner' },
    { id: 'banana', name: 'Banana', domain: 'banana.com', detail: 'Property ID: 284204498 · America/Chicago', role: 'Owner' },
    { id: 'apple', name: 'Apple', domain: 'apple.io', detail: 'Property ID: 284182798 · America/Chicago', role: 'Owner' },
    { id: 'northstar', name: 'Northstar', domain: 'northstar.example', detail: 'Property ID: 392042117 · America/New_York', role: 'Owner' },
    { id: 'orchard', name: 'Orchard', domain: 'orchard.studio', detail: 'Property ID: 489201275 · Europe/London', role: 'Editor' },
    { id: 'moonbase', name: 'Moonbase', domain: 'moonbase.design', detail: 'Property ID: 612094387 · America/Los_Angeles', role: 'Owner' },
  ] : [
    { id: 'workspace', name: workspaceDomain, domain: workspaceDomain, detail: `sc-domain:${workspaceDomain}`, role: 'Owner' },
    { id: 'banana', name: 'Banana', domain: 'banana.com', detail: 'sc-domain:banana.com', role: 'Owner' },
    { id: 'apple', name: 'Apple', domain: 'apple.io', detail: 'URL prefix', role: 'Owner' },
    { id: 'northstar', name: 'Northstar', domain: 'northstar.example', detail: 'sc-domain:northstar.example', role: 'Owner' },
    { id: 'orchard', name: 'Orchard', domain: 'orchard.studio', detail: 'sc-domain:orchard.studio', role: 'Full user' },
    { id: 'moonbase', name: 'Moonbase', domain: 'moonbase.design', detail: 'URL prefix', role: 'Owner' },
  ];
  const visibleProperties = properties.filter((property) => `${property.name} ${property.domain}`.toLowerCase().includes(search.toLowerCase()));
  const selectedProperty = properties.find((property) => property.id === selectedId);

  function openSelector() {
    setIntroOpen(false);
    setSearch('');
    setSelectedId(connection?.id ?? '');
    window.setTimeout(() => setSelectorOpen(true), 0);
  }

  return <>
    <Dialog open={introOpen} onOpenChange={setIntroOpen}>
      <DialogTrigger render={trigger} />
      <DialogPopup className="overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <img alt="" className="size-5 object-contain" src={source.image} />
            <DialogTitle>{source.label}</DialogTitle>
          </div>
          <DialogDescription>{source.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-auto sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
          <Button type="button" onClick={openSelector}>{connection ? 'Change Domain' : 'Connect'}</Button>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>

    <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
      <DialogPopup className="h-[min(40rem,calc(100dvh-2rem))] overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <img alt="" className="size-5 object-contain" src={source.image} />
            <DialogTitle>Select {source.propertyLabel}</DialogTitle>
          </div>
          <DialogDescription>Choose the {source.propertyLabel} to use for this organization.</DialogDescription>
        </DialogHeader>
        <DialogPanel scrollFade={false} className="flex min-h-0 flex-1 flex-col">
          <div className="mb-4 shrink-0">
            <InputGroup variant="muted">
              <InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
              <InputGroupInput autoFocus size="lg" aria-label={`Search ${source.propertyLabel}`} placeholder="Search properties…" value={search} onChange={(event) => setSearch(event.target.value)} />
            </InputGroup>
          </div>
          <ScrollArea className="min-h-0 flex-1" overscrollContain scrollbarGutter scrollFade>
            <div className="grid grid-cols-2 gap-3 pe-1">
              {visibleProperties.map((property) => <label key={property.id} className="flex min-w-0 cursor-pointer flex-col items-start gap-3 rounded-md bg-muted p-4 transition-colors has-[[data-checked]]:bg-accent/70 hover:bg-accent/70">
                <Checkbox checked={selectedId === property.id} onCheckedChange={(checked) => setSelectedId(checked ? property.id : '')} className="mt-1" />
                <span className="flex min-w-0 max-w-full flex-col gap-2">
                  <span className="block truncate font-medium text-base">{property.name}</span>
                  <span className="flex min-w-0 items-center gap-2 text-base text-muted-foreground">
                    <Globe aria-hidden="true" className="size-4 shrink-0" />
                    <span className="truncate">{property.domain}</span>
                  </span>
                  <span className="flex flex-col items-start gap-2">
                    <span className="text-muted-foreground text-sm">{property.detail}</span>
                    <Badge variant="secondary">{property.role}</Badge>
                  </span>
                </span>
              </label>)}
            </div>
          </ScrollArea>
        </DialogPanel>
        <DialogFooter className="mt-auto sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]">
          <Button type="button" disabled={!selectedProperty} onClick={() => { onConnect(selectedProperty); setSelectorOpen(false); }}>{selectedProperty ? `Connect ${selectedProperty.domain}` : 'Connect website'}</Button>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  </>;
}

function FirstPartyDataSourcePage({ workspace, onSave }) {
  const defaultConnections = workspace?.firstPartyConnections ?? {
    analytics: { id: 'workspace', name: workspace?.name ?? 'Apta Agency', domain: normalizeDomain(workspace?.domain ?? 'apta.agency') },
    searchConsole: null,
  };
  const [connections, setConnections] = useState(defaultConnections);

  useEffect(() => {
    setConnections(workspace?.firstPartyConnections ?? {
      analytics: { id: 'workspace', name: workspace?.name ?? 'Apta Agency', domain: normalizeDomain(workspace?.domain ?? 'apta.agency') },
      searchConsole: null,
    });
  }, [workspace?.domain, workspace?.firstPartyConnections, workspace?.id, workspace?.name]);

  function connectSource(source, property) {
    const previousConnections = connections;
    const nextConnections = { ...connections, [source.id]: property };
    setConnections(nextConnections);
    onSave?.(workspace?.id, { firstPartyConnections: nextConnections });
    const toastId = toastManager.add({
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setConnections(previousConnections);
          onSave?.(workspace?.id, { firstPartyConnections: previousConnections });
          toastManager.close(toastId);
          toastManager.add({ description: 'The previous connection has been restored.', title: 'Connection undone', type: 'info' });
        },
      },
      description: `${property.domain} is now connected to ${source.label}.`,
      timeout: 5000,
      title: 'Website connected',
      type: 'success',
    });
  }

  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="First-party data" />
      <p className="max-w-7xl text-base leading-6 text-muted-foreground">Connect the data you control for this organization.</p>
    </div>
    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader className="!min-h-10 grid grid-cols-3 gap-0 px-0 py-0 font-medium text-sm">
        <span className="flex h-10 items-center ps-5">Source</span>
        <span className="flex h-10 items-center px-2.5">Domain</span>
        <span className="flex h-10 items-center pe-5 ps-2.5">Status</span>
      </PanelFrameHeader>
      <PanelFrameContent>
        <Table className="table-fixed"><TableBody>{firstPartySources.map((source) => {
          const connection = connections[source.id];
          return <FirstPartyConnectionDialog key={source.id} source={source} connection={connection} workspace={workspace} onConnect={(property) => connectSource(source, property)}
            trigger={<TableRow className={`h-12 cursor-pointer outline-none transition-colors hover:!bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${connection ? '' : 'text-muted-foreground'}`} role="button" tabIndex={0} aria-label={`${connection ? 'Change' : 'Connect'} ${source.label}`}>
              <TableCell className="ps-5"><span className="flex items-center gap-2.5 font-medium"><img alt="" className="size-5 shrink-0 object-contain" src={source.image} />{source.label}</span></TableCell>
              <TableCell>{connection?.domain ?? '-'}</TableCell>
              <TableCell className="pe-5"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className={connection ? 'size-2 rounded-full bg-success-foreground' : 'size-2 rounded-full bg-muted-foreground/40'} />{connection ? 'Connected' : 'Not connected'}</span></TableCell>
            </TableRow>} />;
        })}</TableBody></Table>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

function IndexDataSourcePage({ workspace, onSave }) {
  const [ticker, setTicker] = useState(workspace?.stockTicker ?? '');
  const [officialSource, setOfficialSource] = useState(() => normalizeDomain(workspace?.officialCompanySource ?? workspace?.domain ?? 'apta.agency'));
  const [enabled, setEnabled] = useState(Boolean(workspace?.moonvineIndexEnabled));
  const [openDialog, setOpenDialog] = useState(null);
  const [draftTicker, setDraftTicker] = useState(ticker);
  const [draftSource, setDraftSource] = useState(officialSource);

  useEffect(() => {
    setTicker(workspace?.stockTicker ?? '');
    setOfficialSource(normalizeDomain(workspace?.officialCompanySource ?? workspace?.domain ?? 'apta.agency'));
    setEnabled(Boolean(workspace?.moonvineIndexEnabled));
    setOpenDialog(null);
  }, [workspace?.domain, workspace?.id, workspace?.moonvineIndexEnabled, workspace?.officialCompanySource, workspace?.stockTicker]);

  function setDialog(field, open) {
    if (open) {
      setDraftTicker(ticker);
      setDraftSource(officialSource);
    }
    setOpenDialog(open ? field : null);
  }

  function saveSetting(updates, toastCopy) {
    const previous = { stockTicker: ticker, officialCompanySource: officialSource, moonvineIndexEnabled: enabled };
    const next = { ...previous, ...updates };
    setTicker(next.stockTicker);
    setOfficialSource(next.officialCompanySource);
    setEnabled(next.moonvineIndexEnabled);
    onSave?.(workspace?.id, next);
    const toastId = toastManager.add({
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setTicker(previous.stockTicker);
          setOfficialSource(previous.officialCompanySource);
          setEnabled(previous.moonvineIndexEnabled);
          onSave?.(workspace?.id, previous);
          toastManager.close(toastId);
          toastManager.add({ description: 'The previous Index settings have been restored.', title: 'Change undone', type: 'info' });
        },
      },
      description: toastCopy,
      timeout: 5000,
      title: 'Index settings updated',
      type: 'success',
    });
  }

  const normalizedDraftSource = normalizeDomain(draftSource.trim());
  const tickerValid = !draftTicker.trim() || /^[A-Z][A-Z0-9.-]{0,9}$/.test(draftTicker.trim().toUpperCase());
  const sourceValid = isValidDomain(normalizedDraftSource);

  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="Your public-company intelligence layer" />
      <p className="max-w-7xl text-base leading-6 text-muted-foreground">Moonvine could not verify a public-company match. Confirm the ticker and official company source if this is a public parent or holding company.</p>
    </div>

    <PanelFrame className="w-full max-w-7xl">
      <PanelFrameHeader>
        <Layers2Icon aria-hidden="true" className="size-4 shrink-0" />
        <PanelFrameTitle render={<h2 />}>Index by Moonvine</PanelFrameTitle>
      </PanelFrameHeader>
      <PanelFrameContent>
        <div className="grid md:grid-cols-2 md:divide-x md:divide-border/64">
          <EditDialog title="Stock ticker" description="The public-market ticker Moonvine should use for this organization." open={openDialog === 'ticker'}
            onOpenChange={(open) => setDialog('ticker', open)} dirty={draftTicker.trim().toUpperCase() !== ticker} valid={tickerValid}
            onSave={() => saveSetting({ stockTicker: draftTicker.trim().toUpperCase() }, 'The stock ticker has been updated.')}
            trigger={<Field className="cursor-pointer gap-3 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" name="stock-ticker-preview" role="button" tabIndex={0}>
              <TriggerLabel>Stock ticker</TriggerLabel>
              <InputGroup variant="muted" className="pointer-events-none">
                <InputGroupInput readOnly size="lg" aria-label="Stock ticker" placeholder="For example: SBUX" value={ticker} />
              </InputGroup>
            </Field>}>
            <Field invalid={!tickerValid} name="stock-ticker">
              <InputGroup variant="muted">
                <InputGroupInput autoFocus maxLength={10} size="lg" aria-label="Stock ticker" placeholder="For example: SBUX" value={draftTicker} onChange={(event) => setDraftTicker(event.target.value.toUpperCase())} />
              </InputGroup>
              <FieldDescription>{tickerValid ? 'Use the ticker listed on the company’s primary exchange.' : 'Enter a valid stock ticker.'}</FieldDescription>
            </Field>
          </EditDialog>

          <EditDialog title="Official company source" description="The official website Moonvine should use to verify this public company." open={openDialog === 'source'}
            onOpenChange={(open) => setDialog('source', open)} dirty={normalizedDraftSource !== officialSource} valid={sourceValid}
            onSave={() => saveSetting({ officialCompanySource: normalizedDraftSource }, 'The official company source has been updated.')}
            trigger={<Field className="cursor-pointer gap-3 border-t border-border/64 p-5 outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:border-t-0" name="official-source-preview" role="button" tabIndex={0}>
              <TriggerLabel required>Official company source</TriggerLabel>
              <InputGroup variant="muted" className="pointer-events-none">
                <InputGroupAddon className="text-muted-foreground">https://</InputGroupAddon>
                <InputGroupInput readOnly size="lg" aria-label="Official company source" value={officialSource} className="*:[input]:ps-0!" />
              </InputGroup>
            </Field>}>
            <Field invalid={!sourceValid} name="official-company-source">
              <InputGroup variant="muted">
                <InputGroupAddon className="text-muted-foreground">https://</InputGroupAddon>
                <InputGroupInput autoFocus required size="lg" aria-label="Official company source" value={draftSource} className="*:[input]:ps-0!" onChange={(event) => setDraftSource(event.target.value)} />
              </InputGroup>
              <FieldDescription>{sourceValid ? 'Use the organization’s official public website.' : 'Enter a valid domain.'}</FieldDescription>
            </Field>
          </EditDialog>
        </div>

        <Separator />

        <label className="flex cursor-pointer flex-col items-start gap-3 p-5 transition-colors hover:bg-accent/50">
          <Checkbox checked={enabled} onCheckedChange={(checked) => {
            const nextEnabled = Boolean(checked);
            setEnabled(nextEnabled);
            onSave?.(workspace?.id, { moonvineIndexEnabled: nextEnabled });
            toastManager.add({ title: nextEnabled ? 'Index enabled' : 'Index disabled', type: 'success' });
          }} />
          <span className="space-y-1">
            <span className="block font-medium text-sm">Enable Index by Moonvine</span>
            <span className="block max-w-7xl text-muted-foreground text-sm">Index becomes the complete public-company workspace for this organization.</span>
          </span>
        </label>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}

export function DataSourcesPage({ sectionId, workspace, onSaveWorkspace }) {
  const current = dataSourceSections.find((section) => section.id === sectionId) ?? dataSourceSections[0];
  if (current.id === 'organization') return <OrganizationDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  if (current.id === 'competitors') return <CompetitorsDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  if (current.id === 'social-accounts') return <SocialAccountsDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  if (current.id === 'news-keywords') return <NewsKeywordsDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  if (current.id === 'first-party-data') return <FirstPartyDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  if (current.id === 'index') return <IndexDataSourcePage workspace={workspace} onSave={onSaveWorkspace} />;
  return <div className="v2-page-sections"><PageHeading title={current.label} /></div>;
}
