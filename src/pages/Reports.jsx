import { ReportsTable } from "@/features/reportsTable/components/reportsTable";

export function Reports() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">Reports</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Review scheduled report runs by company, month, week, and report type.
        </p>
      </div>

      <ReportsTable />
    </section>
  );
}
