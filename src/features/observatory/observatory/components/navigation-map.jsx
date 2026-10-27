const pageDescriptions = {
  '/console': 'Start a conversation with your AI and return to recent chats.',
  '/console/reports': 'Read published reports and weekly updates.',
  '/console/bookmarks': 'Find saved posts and organize them into workspaces.',
  '/console/your-account': 'Manage your profile and account details.',
  '/console/accounts': 'Create, manage, and switch between workspaces.',
  '/console/people': 'Manage the people in your workspaces.',
  '/console/data-sources/access': 'Manage workspace permissions and report access.',
  '/console/data-sources/domains': 'Manage the domains and organizations you track.',
  '/console/data-sources/social-accounts': 'Choose social accounts to follow.',
  '/console/data-sources/news-keywords': 'Choose the topics and keywords to monitor in the news.',
  '/console/data-sources/competitors': 'Choose competitors to track.',
  '/console/data-sources/prompts': 'Choose the questions used to measure AI visibility.',
  '/console/data-sources/first-party-data': 'Connect Google Analytics and Google Search Console.',
  '/console/data-sources/index': 'Manage the pages included in your website index.',
};
const lensDescriptions = {
  'insight:ai-visibility': 'See how often AI answers mention your brand and which sources they use.',
  'insight:investor': 'Review company and market signals for investment research.',
  'source:ga4': 'Review website traffic, visitor behavior, and engagement.',
  'source:ga4-2': 'Review website traffic, visitor behavior, and engagement.',
  'source:gsc': 'Review search queries, clicks, and your visibility on Google.',
  'source:social': 'Review posts and engagement across the social accounts you follow.',
  'source:news': 'Review media mentions of your brand and the topics you track.',
  'source:news-media': 'Browse news coverage and competitor mentions.',
  'source:site': 'Review website performance, accessibility, and issues to fix.',
  'source:semrush': 'Compare organizations competing with you in search.',
  'report:history': 'Read published reports and weekly updates.',
  'intelligence:chat': 'Continue this conversation with your AI.',
  'account:summary': 'Manage your organization profile.',
  'account:connections': 'Review the sources connected to your workspace.',
};
export function NavigationMap({ route }) {
  const description = lensDescriptions[route.lensId] ?? pageDescriptions[route.path]
    ?? (route.path.startsWith('/intelligence/') ? 'Review the latest changes across your intelligence sources.'
      : route.path.startsWith('/console/people/') ? 'Review this person, their workspaces, and their access.'
      : route.path.startsWith('/console/bookmarks/') ? 'Browse the posts saved in this bookmark workspace.'
      : 'Review and manage this part of your workspace.');
  return <p data-navigation-map className="text-base leading-6 text-foreground">{description}</p>;
}

// Keep clicks in this environment without changing the app's normal link targets.
export function keepMapNavigation(event) {
  const href = event.target.closest?.('a[href]')?.getAttribute('href');
  if (!href?.startsWith('#/') || href.startsWith('#/console/map')) return;
  event.preventDefault();
  const destination = '#/console/map?page=' + encodeURIComponent(href.slice(1));
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1) window.open(destination, '_blank', 'noopener');
  else window.location.hash = destination;
}
