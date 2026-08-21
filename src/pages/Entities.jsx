import { EntitiesTable } from "@/features/entitiesTable/components/entitiesTable";

export function Entities() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">Entities</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Track the accounts and watched entities connected to your workspace.
        </p>
      </div>

      <EntitiesTable />
    </section>
  );
}
