// Synthetic saved findings for the prototype, never a live crawl.
const findings = {
  heading: {
    title: 'Missing main page headings',
    area: 'Accessibility',
    expectedImpact: '+8.4%',
    summary: 'High-priority content structure fix.',
    what: 'One or more pages do not have a clear main heading.',
    why: 'The page template may omit the heading or render visual text without semantic heading markup.',
    fix: 'Add one clear main heading that states what each page is about.',
    showAffectedPages: true,
  },
  title: {
    title: 'Duplicate title tags',
    area: 'SEO',
    expectedImpact: '+12.6%',
    summary: 'Critical content, SEO, or template fix.',
    what: 'Two or more URLs use the same HTML page title.',
    why: 'Pages may inherit a default title, reuse the same SEO field, or represent duplicate versions of the same content.',
    fix: 'Give distinct pages unique, descriptive titles. Consolidate true duplicates with a redirect or canonical URL.',
    showAffectedPages: true,
  },
  description: {
    title: 'Duplicate meta descriptions',
    area: 'SEO',
    expectedImpact: '+10.8%',
    summary: 'Critical content or SEO-template fix.',
    what: 'Two or more URLs use the same search-result description.',
    why: 'A shared template or copied SEO field supplies identical descriptions to different pages.',
    fix: 'Write a distinct description for each useful page. Consolidate or canonicalize URLs that are true duplicates.',
  },
  image: {
    title: 'Oversized images',
    area: 'Performance',
    expectedImpact: '+6.2%',
    summary: 'Performance and media-delivery fix.',
    what: 'Images are larger than the rendered page needs.',
    why: 'The source assets are exported at excessive dimensions or served without responsive variants.',
    fix: 'Resize and compress the images, then serve responsive formats for the rendered dimensions.',
  },
  links: {
    title: 'Unclear internal links',
    area: 'Best Practices',
    expectedImpact: '+4.8%',
    summary: 'Navigation and accessibility cleanup.',
    what: 'Internal links use labels that do not clearly describe their destination.',
    why: 'Generic labels are reused across templates without enough destination context.',
    fix: 'Replace generic link text with a clear description of the destination.',
    showAffectedPages: true,
  },
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

const cleanInventoryPaths = ['/projects', '/portfolio', '/case-studies', '/video', '/ai-video', '/webinar'];

export function getWebsiteInventory(domain) {
  const affectedPages = getSiteFixes(domain);
  const cleanPages = cleanInventoryPaths.map((path) => ({
    path,
    label: path,
    url: `https://${domain}${path}`,
    issues: [],
  }));
  return [...affectedPages, ...cleanPages];
}

export function getFixableWebsiteIssues(domain) {
  return Object.entries(findings).map(([id, finding]) => {
    const affectedPages = pages.filter(([, keys]) => keys.includes(id)).map(([path]) => ({
      label: path === '/' ? domain : path,
      path,
      url: `https://${domain}${path}`,
    }));
    return { id, ...finding, occurrenceCount: affectedPages.length, affectedPages };
  }).filter((issue) => issue.occurrenceCount > 0);
}

export function getSiteFixCount(domain) {
  return getSiteFixes(domain).reduce((total, page) => total + page.issues.length, 0);
}
