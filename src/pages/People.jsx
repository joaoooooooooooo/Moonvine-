import { PeopleTable } from "@/features/peopleTable/components/peopleTable";

export function People() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">People</h1>
        <p className="max-w-2xl text-muted-foreground text-sm">
          Review the people connected to your accounts, companies, and report delivery.
        </p>
      </div>

      <PeopleTable />
    </section>
  );
}
