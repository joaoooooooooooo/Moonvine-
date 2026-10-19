import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function SourceIcon({ icon: Icon, className }) {
  return (
    <Avatar className={className} aria-hidden="true">
      <AvatarFallback><Icon className="size-4" strokeWidth={1.5} /></AvatarFallback>
    </Avatar>
  );
}
