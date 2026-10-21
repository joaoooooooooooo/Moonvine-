import { useState } from 'react';
import { CopyIcon, Link2, SendIcon, ShieldCheckIcon, UserPenIcon } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PanelFrame, PanelFrameContent, PanelFrameHeader, PanelFrameTitle } from '@/components/ui/panel-frame';
import { Tag } from '@/components/ui/tag';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { toastManager } from '@/components/ui/toast';
import { findDirectoryPerson } from '../data/directory-rows';
import { ObservatoryInput as Input } from './observatory-input';

const emptyActivity = [
  ['Deliveries', '0'],
  ['Personal views', '0'],
  ['Access links', '0'],
  ['Shared link views', '0'],
];

export function PersonDetailPage({ personId, workspaces, onSetupAction, peopleModel }) {
  const person = peopleModel.addedPeople.find((item) => item.id === personId) ?? findDirectoryPerson(personId, workspaces);
  const workspace = workspaces.find((item) => item.id === person?.accountId);
  const initialProfile = peopleModel.personProfiles[personId] ?? { name: person?.name ?? '', email: person?.email ?? '', title: '', company: workspace?.name ?? '', linkedin: '', website: '' };
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const changed = Object.keys(profile).some((key) => profile[key] !== savedProfile[key]);

  if (!person) return <div className="space-y-3"><h1 className="text-xl font-semibold">Person not found</h1><a className="underline" href="#/console/people">Return to People</a></div>;

  async function copyAccessLink() {
    const link = `${window.location.origin}${window.location.pathname}#/access/${encodeURIComponent(person.id)}`;
    try {
      await navigator.clipboard.writeText(link);
      toastManager.add({ title: 'Access link copied', description: `The access link for ${person.name} is ready to share.`, type: 'success' });
    } catch {
      toastManager.add({ title: 'Could not copy link', description: 'Copy the access link again.', type: 'error' });
    }
  }

  function saveProfile(event) {
    event.preventDefault();
    setSavedProfile(profile);
    peopleModel.setPersonProfiles((current) => ({ ...current, [personId]: profile }));
    onSetupAction?.('profile', person.accountId);
    toastManager.add({ title: 'Profile updated', description: `${profile.name}'s profile was saved.`, type: 'success' });
  }

  return <div className="v2-page-sections !gap-6">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar className="size-12 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
          <AvatarImage alt="" src={person.imageSrc} />
          <AvatarFallback>{person.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl font-medium tracking-tight">{person.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{person.email}</p>
          <p className="mt-1 text-sm text-muted-foreground">{workspace?.name}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={copyAccessLink}><CopyIcon aria-hidden="true" />Copy access link</Button>
        <Button type="button" variant="secondary" onClick={() => toastManager.add({ title: 'Access email sent', description: `An access email was sent to ${person.email}.`, type: 'success' })}><SendIcon aria-hidden="true" />Send access email</Button>
      </div>
    </div>

    <PanelFrame>
      <PanelFrameHeader><UserPenIcon aria-hidden="true" className="size-4" /><PanelFrameTitle render={<h2 />}>Profile</PanelFrameTitle></PanelFrameHeader>
      <PanelFrameContent>
        <form className="grid gap-3 p-5 sm:grid-cols-2" onSubmit={saveProfile}>
          {[
            ['name', 'Name', 'text'], ['email', 'Email', 'email'], ['title', 'Title', 'text'], ['company', 'Company', 'text'], ['linkedin', 'LinkedIn', 'url'], ['website', 'Website', 'url'],
          ].map(([key, label, type]) => <label key={key} className="grid gap-2 font-medium text-sm">
            <span>{label}</span>
            <Input size="lg" type={type} value={profile[key]} placeholder={key === 'linkedin' ? 'https://linkedin.com/in/…' : key === 'website' ? 'https://…' : undefined} onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))} />
          </label>)}
          <div className="sm:col-span-2"><Button type="submit" disabled={!changed || !profile.name.trim() || !profile.email.trim()}>Save</Button></div>
        </form>
      </PanelFrameContent>
    </PanelFrame>

    <PanelFrame>
      <PanelFrameHeader><ShieldCheckIcon aria-hidden="true" className="size-4" /><PanelFrameTitle render={<h2 />}>Accounts and access</PanelFrameTitle></PanelFrameHeader>
      <PanelFrameContent>
        <Table>
          <TableBody>
            <TableRow className="h-14">
              <TableCell className="w-1/3 font-medium"><span className="flex items-center gap-2"><ShieldCheckIcon aria-hidden="true" className="size-4 text-muted-foreground" />Sign-in</span></TableCell>
              <TableCell className="text-muted-foreground">{person.name} can sign in to Moonvine.</TableCell>
            </TableRow>
            <TableRow className="h-14">
              <TableCell className="w-1/3 font-medium"><span className="flex items-center gap-2"><UserPenIcon aria-hidden="true" className="size-4 text-muted-foreground" />Account permissions</span></TableCell>
              <TableCell className="text-muted-foreground">Can manage watched accounts.</TableCell>
            </TableRow>
            <TableRow className="h-14">
              <TableCell className="w-1/3 font-medium">{workspace?.name}</TableCell>
              <TableCell><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-muted-foreground">Can sign in and view this watched account.</span><div className="flex gap-2"><Tag>Watched account</Tag><Tag>Owner</Tag></div></div></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PanelFrameContent>
    </PanelFrame>

    <PanelFrame>
      <PanelFrameHeader><Link2 aria-hidden="true" className="size-4" /><PanelFrameTitle render={<h2 />}>Activity</PanelFrameTitle></PanelFrameHeader>
      <PanelFrameContent className="gap-5 p-5">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">{emptyActivity.map(([label, value]) => <div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-medium">{value}</p></div>)}</div>
        <div><p className="font-medium text-sm">Latest activity: none yet.</p><p className="mt-1 max-w-[36ch] text-sm text-muted-foreground">Activity appears after this person uses an access link, signs in, or opens a shared report.</p></div>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}
