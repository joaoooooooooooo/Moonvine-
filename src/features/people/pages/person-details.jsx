import { PeopleDetailBreadcrumb } from "@/features/people/components/people-detail-breadcrumb";
import { PersonProfileEdit } from "@/features/people/components/person-profile-edit";
import { PersonSummaryFrame } from "@/features/people/components/person-summary-frame";

export function PersonDetails({ person }) {
  return (
    <section className="mx-auto w-full max-w-xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {person ? (
        <div className="flex flex-col gap-[6px]">
          <PersonSummaryFrame person={person} />
          <PersonProfileEdit key={person.id} person={person} />
        </div>
      ) : (
        <div className="space-y-6">
          <PeopleDetailBreadcrumb person={person} />
          <div className="space-y-2">
            <h1 className="max-w-[28rem] text-2xl text-foreground">
              This person is not available in the current workspace.
            </h1>
          </div>
        </div>
      )}
    </section>
  );
}
