export const scoreDescriptions = {
  Performance: 'How quickly the page loads and responds to user interactions.',
  Accessibility: 'How well the page passes automated accessibility checks.',
  'Best Practices': 'How well the page follows web security and development best practices.',
  SEO: 'How well the page follows basic search engine optimization practices.',
  'AI readiness': 'A Moonvine rollup of crawlability, page descriptions, robots.txt, and structured-data signals returned by the same page check.',
};

// Local sample checks, matching the Reports audit card presentation.
export function siteChecks(domain) {
  return [
    { title: 'Crawlability', status: 'good', description: 'The sampled pages can be reached by automated crawlers.' },
    { title: 'Page descriptions', status: 'warning', description: 'Some sampled pages need clearer descriptions of their content.' },
    { title: 'LLMs file', status: 'missing', description: `No llms.txt file was found at https://${domain}/llms.txt. This file can guide AI tools to useful public content.` },
    { title: 'Robots file', status: 'good', description: 'The check found robots.txt and a sitemap reference.' },
    { title: 'Visible FAQs', status: 'missing', description: 'No visible FAQ sections were detected on the 25 public pages in the sitemap sample.' },
    { title: 'Structured data', status: 'warning', description: 'Organization identity and services are incomplete in the structured data found on the sampled pages.' },
  ];
}

export function aiReadinessScore(domain) {
  const signals = siteChecks(domain).filter(({ title }) => ['Crawlability', 'Page descriptions', 'Robots file', 'Structured data'].includes(title));
  const points = { good: 100, warning: 50, missing: 0 };
  return Math.round(signals.reduce((sum, { status }) => sum + points[status], 0) / signals.length);
}
