import { PageHeading } from './page-heading';
import { SignalsGrid } from './signals-grid';

export function FreeAccountOverview({ model }) {
  return <div className="v2-page-sections">
    <div className="max-w-[40rem]"><PageHeading title="Your intelligence, in one place." /></div>
    <SignalsGrid account={model.account} lenses={model.lenses} empty />
  </div>;
}
