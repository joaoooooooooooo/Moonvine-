import { answerOrganizations, referenceSources } from './ai-visibility-content';
import { AiVisibilitySection } from './ai-visibility-section';
import { RankedSourcesList } from './ranked-sources-list';
import '../signals-grid.css';

export function AiVisibilitySources({ account, competitorNames }) {
  return (
    <AiVisibilitySection
      id="ai-visibility-sources"
      title="These sources shaped the answers instead."
      description="This shows the organizations and reference sources that appeared most often in the sampled answers."
    >
      <div className="v2-signals-grid grid items-stretch gap-3 lg:grid-cols-2">
        <RankedSourcesList title="Organizations in the answers" items={answerOrganizations} accountName={account.name} competitorNames={competitorNames} />
        <RankedSourcesList title="Reference sources used most" items={referenceSources} />
      </div>
    </AiVisibilitySection>
  );
}
