import { Select, SelectItem, SelectPopup, SelectValue, SelectTrigger } from "@/components/ui/select";
import { reportScenarios } from "../../report-scenarios";
import { RiveStrokeDebug } from "@/components/rive/rive-stroke-debug";
export function ReportDebug({ value, onChange }: { value?: string; onChange?: (id: string) => void }) {
  const current = reportScenarios.find(scenario => scenario.id === value);
  return <details className="print:hidden fixed bottom-4 right-4 z-40 w-72 max-w-[calc(100vw-2rem)] rounded-xl border bg-background p-3 shadow-lg">
    <summary className="cursor-pointer text-sm font-medium">Report debug</summary>
    <div className="mt-3 flex flex-col gap-3">
      {current && onChange && <>
      <label id="report-scenario-label" className="text-sm">Mock scenario</label>
      <Select items={reportScenarios.map(({ id, label }) => ({ value: id, label }))} value={value} onValueChange={next => { if (next) onChange(next); }}>
        <SelectTrigger aria-labelledby="report-scenario-label" className="w-full"><SelectValue /></SelectTrigger>
        <SelectPopup>{reportScenarios.map(scenario => <SelectItem key={scenario.id} value={scenario.id}>{scenario.label}</SelectItem>)}</SelectPopup>
      </Select>
      <p className="text-xs text-muted-foreground" aria-live="polite">{current.report.context.competitorIds.length} competitors ? {current.report.websiteAudit.issues.length} fix cards ? {current.report.aiVisibility.questions.length} questions</p>
      <p className="text-xs text-muted-foreground">Mock data only. Changing scenarios resets filters and pagination.</p>
      <div className="border-t" />
      </>}
      <RiveStrokeDebug />
    </div>
  </details>;
}
