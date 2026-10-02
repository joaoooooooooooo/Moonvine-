import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ObservatoryTable } from '../observatory-table';
import { SectionHeading } from '../section-heading';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function SocialHandles({ handles, account }) {
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  return (
    <section aria-labelledby="social-handles" className="space-y-10">
      <SectionHeading id="social-handles" title="Your social handles" description="Saved social profiles for this account." />
      <ObservatoryTable label="Your social handles">
        <TableHeader><TableRow><TableHead>Platform</TableHead><TableHead>Profile</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{handles.map(({ name, imageSrc, handle }) => {
          const connected = Boolean(handle) || connectedPlatforms.includes(name);
          return (
          <TableRow key={name}>
            <TableCell><span className={`flex flex-wrap items-center gap-2 sm:gap-3 ${connected ? '' : 'opacity-50'}`}><img src={imageSrc} alt="" className="size-6 shrink-0 rounded-full bg-white object-contain p-0.5" />{name}</span></TableCell>
            <TableCell className="whitespace-normal break-all text-foreground"><span className={connected ? '' : 'opacity-50'}>{handle ?? (connected ? `@${account.id}` : '-')}</span></TableCell>
            <TableCell>
              {connected ? <span className="inline-flex h-8 items-center gap-2 text-sm sm:h-7" role="status">
                <span aria-hidden="true" className="relative size-[7px] shrink-0 rounded-full bg-success-foreground before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-success-foreground before:opacity-75 motion-reduce:before:animate-none" />Connected
              </span> : <Button size="sm" variant="secondary" aria-label={`Connect ${name}`} onClick={() => setConnectedPlatforms((current) => [...current, name])}>Connect</Button>}
            </TableCell>
          </TableRow>
        );})}</TableBody>
      </ObservatoryTable>
    </section>
  );
}
