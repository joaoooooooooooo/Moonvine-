import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ObservatoryTable } from '../observatory-table';
import { SectionHeading } from '../section-heading';
import { TableProfileAvatar } from '../table-profile-avatar';

export function WatchedHandles({ organizations }) {
  return (
    <section aria-labelledby="watched-handles" className="space-y-10">
      <SectionHeading id="watched-handles" title="Watched handles" description="Saved social profiles for the organizations you watch." />
      <ObservatoryTable label="Watched social handles">
        <TableHeader><TableRow><TableHead>Organization</TableHead><TableHead>Profiles</TableHead></TableRow></TableHeader>
        <TableBody>{organizations.map((organization) => (
          <TableRow key={organization.name}>
            <TableCell className="whitespace-normal align-top">
              <div className="flex items-center gap-3"><TableProfileAvatar src={organization.imageSrc} /><span>{organization.name}</span></div>
              <p className="mt-2 break-all text-sm text-muted-foreground">{organization.domain}</p>
            </TableCell>
            <TableCell className="whitespace-normal">
              <ul className="space-y-3">{organization.handles.map(({ platform, handle, href }) => <li key={platform} className="space-y-1">
                <p className="text-sm text-muted-foreground">{platform}</p>
                <a href={href} target="_blank" rel="noreferrer" className="break-all text-sm underline underline-offset-4">{handle}</a>
              </li>)}</ul>
            </TableCell>
          </TableRow>
        ))}</TableBody>
      </ObservatoryTable>
    </section>
  );
}
