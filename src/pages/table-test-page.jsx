import { ProjectBudgetTable } from "@/components/examples/project-budget-table";

export function TableTestPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_35%,_rgba(226,232,240,0.86)_100%)] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Test page
          </p>
          <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl">
            COSS table particle adaptation
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            This isolated page renders the adapted `p-table-6` component for
            visual testing.
          </p>
        </div>
        <ProjectBudgetTable />
      </div>
    </main>
  );
}
