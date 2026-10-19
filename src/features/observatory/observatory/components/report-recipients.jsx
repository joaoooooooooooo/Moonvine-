import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from '@/components/ui/icons';

export function ReportRecipients({ recipients }) {
  return (
    <div className="relative z-10 flex w-fit -space-x-1.5" aria-label={`Sent to ${recipients.map(({ name }) => name).join(', ')}`}>
      {recipients.map(({ id, name, imageSrc }) => (
        <Avatar key={id} className="size-6 ring-2 ring-card" title={name}>
          <AvatarImage alt={name} src={imageSrc} />
          <AvatarFallback><UserRound aria-hidden="true" className="size-3" /></AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
