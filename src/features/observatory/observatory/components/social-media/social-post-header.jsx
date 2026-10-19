import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { socialPlatforms } from '../../data/social-media';

export function SocialPostHeader({ name, avatarSrc, platform }) {
  const platformImage = socialPlatforms.find(({ name: label }) => label === platform)?.imageSrc;
  return (
    <div className="v2-card-tagline m-0! flex w-full! items-center gap-3 rounded-b-none">
      <div className="flex shrink-0 -space-x-1.5">
        <Avatar className="size-6 ring-2 ring-card"><AvatarImage src={avatarSrc} alt={`${name} avatar`} /></Avatar>
        {platformImage && <Avatar className="size-6 ring-2 ring-card"><AvatarImage src={platformImage} alt={platform} /></Avatar>}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm/normal font-normal">{name}</p>
      </div>
    </div>
  );
}
