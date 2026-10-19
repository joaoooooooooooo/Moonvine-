import { editorialPosts } from '@/features/Reports/report-editorial';
import { reportWeeks } from './report-weeks';

export const socialPlatforms = [
  { name: 'Instagram', imageSrc: '/report-logos/instagram.png' },
  { name: 'LinkedIn', imageSrc: '/report-logos/linkedin.png' },
  { name: 'TikTok', imageSrc: '/report-logos/tiktok.svg' },
  { name: 'Facebook', imageSrc: '/report-logos/facebook.svg' },
  { name: 'YouTube', imageSrc: '/report-logos/youtube.png' },
  { name: 'X', imageSrc: '/report-logos/x.svg' },
];

export const watchedSocialAccounts = [
  { name: 'Curio Digital', domain: 'curiodigital.io', imageSrc: '/report-logos/curio.jpg', handles: [{ platform: 'LinkedIn', handle: '@curiodigital', href: 'https://www.linkedin.com/company/curiodigital/' }] },
  { name: 'Superside', domain: 'superside.com', imageSrc: '/report-logos/superside.jpg', handles: [{ platform: 'LinkedIn', handle: '@superside', href: 'https://www.linkedin.com/company/superside/' }] },
  { name: 'H Labs', domain: 'hlabs.co.uk', imageSrc: '/report-logos/hlabs.png', handles: [
    { platform: 'Instagram', handle: '@hlabs.co.uk', href: 'https://www.instagram.com/hlabs.co.uk/' },
    { platform: 'LinkedIn', handle: '@hanspringett', href: 'https://www.linkedin.com/in/hanspringett/' },
  ] },
];

// Saved source examples and illustrative engagement for the weekly V2 mockup.
export function socialMediaData(account, period) {
  const offset = reportWeeks.find((week) => week.value === period)?.offset ?? 0;
  const saved = editorialPosts.filter((post) => post.entityId === 'competitor-0');
  const ordered = [...saved.slice(offset % saved.length), ...saved.slice(0, offset % saved.length)];
  return {
    posts: ordered.map((post) => ({ ...post, ownership: 'watched', name: 'Superside', avatarSrc: '/report-logos/superside.jpg' })),
    handles: socialPlatforms.map((platform) => ({ ...platform, handle: platform.name === 'LinkedIn' ? `@${account.id}` : null })),
  };
}
