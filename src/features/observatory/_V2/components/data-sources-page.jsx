import { PageHeading } from './page-heading';

const dataSourceSections = [
  { id: 'organization', label: 'Organization' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'social-accounts', label: 'Social accounts' },
  { id: 'news-keywords', label: 'News keywords' },
  { id: 'first-party-data', label: 'First-party data' },
  { id: 'index', label: 'Index' },
  { id: 'access', label: 'Access' },
];

export function DataSourcesPage({ sectionId }) {
  const current = dataSourceSections.find((section) => section.id === sectionId) ?? dataSourceSections[0];
  return <div className="v2-page-sections"><PageHeading title={current.label} /></div>;
}
