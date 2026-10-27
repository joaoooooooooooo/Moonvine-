import { PersonDetailPage } from './person-detail-page';

// The shell currently uses a demo identity; keep it independent of workspace people.
const currentUser = { id: 'current-user', name: 'Apta', email: '' };

export function YourAccountPage({ model, workspace }) {
  return <PersonDetailPage
    personId={currentUser.id}
    pageTitle="Your Account"
    accountPerson={{ ...currentUser, accountId: workspace.id }}
    workspaces={model.accounts}
    onSetupAction={model.recordSetupAction}
    peopleModel={model}
  />;
}
