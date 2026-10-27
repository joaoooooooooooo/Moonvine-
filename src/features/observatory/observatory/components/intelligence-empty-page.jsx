import { Button } from '@/components/ui/button';
import { PageHeading } from './page-heading';

export function IntelligenceEmptyPage({ connections = false, setup = false }) {
  return (
    <div className="space-y-2">
      <PageHeading title={setup ? 'Your intelligence starts here' : connections ? 'Connection status' : 'Investor intelligence'} />
      <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">
        {setup ? 'Connect your sources to start collecting intelligence for this workspace.' : connections ? 'Connection status is not available for this workspace yet.' : 'No investor intelligence is available for this workspace yet.'}
      </p>
      {setup && <Button render={<a href="#/console/data-sources/domains" />}>Set up sources</Button>}
    </div>
  );
}

