import { accounts } from '../data/observatory-fixtures';
import { buildLenses } from '../utils/observatory-model';
import { AccountWorkspace } from './account-workspace';
import { SourceDetail } from './source-detail';
import { ReportHistory } from './report-history';
import { NewsMediaPage } from './news-media/news-media-page';
import { PageHeading } from './page-heading';
import { SignalsGrid } from './signals-grid';

export function IntelligencePreview({ model }) {
  const account = { ...accounts.find((item) => item.scenario === 'configured'), name: model.account.name, imageSrc: model.account.imageSrc, description: 'Your weekly intelligence, in one place.' };
  const lenses = buildLenses(account, model.route.period);
  const lens = lenses.find((item) => item.sourceId === model.route.lensId || (model.route.lensId === 'source:ga4-2' && item.id === 'analytics'));
  const preview = { ...model, account, lenses, lens };
  if (lens) return <SourceDetail model={preview} />;
  if (model.route.lensId === 'report:history') return <ReportHistory account={account} />;
  if (model.route.lensId === 'source:news-media') return <NewsMediaPage account={account} period={model.route.period} />;
  if (model.route.lensId === 'insight:investor') return <div className="v2-page-sections"><PageHeading title="Follow the signals shaping your market." /><SignalsGrid account={account} lenses={lenses} /></div>;
  return <AccountWorkspace model={preview} />;
}
