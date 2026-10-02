// Synthetic saved findings for the prototype, never a live crawl.
const findings = {
  heading: { title: 'Missing main page heading', fix: 'Add one clear main heading that states what the page is about.' },
  title: { title: 'Duplicate page title', fix: 'Give this page a unique title that reflects its specific purpose.' },
  description: { title: 'Duplicate search-result description', fix: 'Give this page a distinct description that reflects its specific purpose.' },
  image: { title: 'Large homepage images', fix: 'Resize and compress the hero images to reduce loading time.' },
  links: { title: 'Links need descriptive labels', fix: 'Replace generic link text with a clear description of the destination.' },
};

const pages = [
  ['/blog/how-to-build-a-website-in-framer-the-full-process-step-by-step', ['description']],
  ['/blog/how-to-design-professional-pitch-deck', ['description']],
  ['/', ['image', 'title', 'description']],
  ['/why-us', ['links']],
  ['/jobs', ['heading', 'title', 'description']],
  ['/jobs/designer', ['heading', 'title', 'description']],
  ['/jobs/video-editor', ['heading', 'title', 'description']],
  ['/jobs/project-manager', ['heading', 'title', 'description']],
  ['/jobs/developer', ['heading', 'title', 'description']],
  ['/jobs/thank-you', ['heading', 'title', 'description']],
  ['/contact', ['links']],
  ['/privacy-policy', ['description']],
];

export function getSiteFixes(domain) {
  return pages.map(([path, keys]) => ({
    path,
    label: path === '/' ? domain : path,
    url: `https://${domain}${path}`,
    issues: keys.map((key) => ({ ...findings[key], severity: 'warning' })),
  }));
}

export function getSiteFixCount(domain) {
  return getSiteFixes(domain).reduce((total, page) => total + page.issues.length, 0);
}
