import { PageHeading } from './page-heading';

export function IntelligenceEmptyPage({ connections = false }) {
  return (
    <div className="space-y-2">
      <PageHeading title={connections ? 'Connection status' : 'Investor intelligence'} />
      <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">
        {connections ? 'Connection status is not available for this account yet.' : 'No investor intelligence is available for this account yet.'}
      </p>
    </div>
  );
}

