import { accountHref } from '../../utils/observatory-model';

// Keep this order aligned with the Product Tour frames in Figma (left to right).
export const tourSteps = [
  { id: 'account', title: 'Managing your account', description: 'Find your account settings, billing, and support in one place.', targets: ['account', 'account-menu'], route: () => '#/console', align: 'end' },
  { id: 'workspace', title: 'Switching workspaces', description: 'Choose a workspace to see its data, insights, and reports.', targets: ['workspace', 'workspace-menu'], route: () => '#/console' },
  { id: 'sources', title: 'Connecting data sources', description: 'Add your organization, competitors, and data sources to shape your insights.', targets: ['sources'], route: () => '#/console/data-sources/organization' },
  { id: 'intelligence', title: 'Viewing your insights and fixes', description: 'Open Intelligence to explore performance, opportunities, and fixes for your website.', targets: ['intelligence'], route: () => '#/console' },
  { id: 'details', title: 'Exploring your performance', description: 'Move between sources to explore your results and see what needs attention.', targets: ['intelligence-navigation'], route: (id) => accountHref(id) },
  { id: 'reports', title: 'Reading your reports', description: 'Review your weekly reports to see what changed and what to do next.', targets: ['reports'], route: (id) => `#/console/reports?account=${encodeURIComponent(id)}` },
  { id: 'chat', title: 'Asking about your business', description: 'Ask a question about your company to explore your data and decide what to do next.', targets: ['chat'], route: () => '#/console', align: 'center' },
];
