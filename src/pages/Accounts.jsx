import { AccountTable } from "@/features/accountTable/components/accountTable";

export function Accounts() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">Accounts</h1>
        <p className="max-w-2xl text-muted-foreground text-sm">
          Review active customer accounts, ownership, regional coverage, and revenue health.
        </p>
      </div>

      <AccountTable />
    </section>
  );
}
