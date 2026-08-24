import { PeopleTable } from "@/features/people/components/peopleTable";

export function PeopleList() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="max-w-[28rem] text-2xl text-foreground">
          Review the people connected to your accounts, companies, and report
          delivery.
        </h1>
      </div>

      <PeopleTable />
    </section>
  );
}
