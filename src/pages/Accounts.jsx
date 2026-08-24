import { AccountTable } from "@/features/accountTable/components/accountTable";

export function Accounts() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="max-w-[28rem] text-2xl text-foreground">
          Review active customer accounts, ownership, regional coverage, and revenue health.
        </h1>
      </div>

      <AccountTable />
    </section>
  );
}
