import { accounts } from './observatory-fixtures';
import { reportRecipients } from './report-recipients';

const organizationImages = ['/entity-profiles/studio-field.svg', '/entity-profiles/common-ground.svg', '/entity-profiles/form-matter.svg'];

export function directoryRows(type) {
  if (type === 'accounts') return accounts;
  return accounts.flatMap((account) => Array.from({ length: type === 'people' ? account.people : account.entities }, (_, index) => ({
    id: account.id + index,
    name: type === 'people'
      ? index === 0 ? 'Jordan Davis' : 'Team member ' + (index + 1)
      : index === 0 ? account.name : 'Watched organization ' + (index + 1),
    domain: account.name,
    accountId: account.id,
    accountImageSrc: account.imageSrc,
    imageSrc: type === 'people'
      ? reportRecipients[index % reportRecipients.length].imageSrc
      : index === 0 ? account.imageSrc : organizationImages[(index - 1) % organizationImages.length],
  })));
}
