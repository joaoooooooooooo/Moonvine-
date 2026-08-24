import { EntitiesTable } from "@/features/entitiesTable/components/entitiesTable";

export function Entities() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="max-w-[28rem] text-2xl text-foreground">
          Track the accounts and watched entities connected to your workspace.
        </h1>
      </div>

      <EntitiesTable />
    </section>
  );
}
