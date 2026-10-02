import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function AccountSelectLabel({ account }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-5 shrink-0">
        <AvatarImage src={account.imageSrc} alt="" />
        <AvatarFallback><img src="/report-logos/company.svg" alt="" className="size-full object-cover" /></AvatarFallback>
      </Avatar>
      <span className="truncate">{account.name}</span>
    </span>
  );
}
