import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

export function TableProfileAvatar({ src, person = false }) {
  return (
    <Avatar className="size-6">
      <AvatarImage src={src} alt="" />
      <AvatarFallback>{person ? <UserRound aria-hidden="true" className="size-3" /> : <img src="/report-logos/company.svg" alt="" className="size-full object-cover" />}</AvatarFallback>
    </Avatar>
  );
}
