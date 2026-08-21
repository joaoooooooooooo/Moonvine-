import { PeopleTable } from "@/features/people/components/peopleTable";

export function PeopleList() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">People</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Review the people connected to your accounts, companies, and report
          delivery.
        </p>
      </div>

      <PeopleTable />
    </section>
  );
}
