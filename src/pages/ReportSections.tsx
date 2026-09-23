import { ContactSection } from "@/features/Reports/sections/Contact Section";
import { NextStepsSection } from "@/features/Reports/sections/Next Steps Section";
import { ReportFooter } from "@/features/Reports/components/reportFooter";
import { WebsiteAuditSection } from "@/features/Reports/sections/Website Audit Section";
import { SideLineBackground } from "@/components/ui/line-background";
import { IntroSection } from "@/features/Reports/sections/Intro Section";
import { SourcesSection } from "@/features/Reports/sections/Sources Section";
import { OverviewSection } from "@/features/Reports/sections/Overview Section";
import { AiVisibilitySection } from "@/features/Reports/sections/AI Visibility Section";
import { ReportProvider } from "@/features/Reports/context";
import { useState } from "react";
import { reportScenarios } from "@/features/Reports/report-scenarios";
import { ReportDebug } from "@/features/Reports/components/reportDebug/report-debug";


/** Assembly page for the data-driven report sections. */
export function ReportSections() {
  const [scenarioId, setScenarioId] = useState("typical");
  const report = reportScenarios.find(scenario => scenario.id === scenarioId)!.report;
  return (
    <>
    {new URLSearchParams(window.location.search).has("debug") && <ReportDebug value={scenarioId} onChange={setScenarioId} />}
    <ReportProvider key={scenarioId} value={report.context}>
    <main className="report-document relative min-h-svh overflow-x-clip pt-16 print:pt-0">
      <SideLineBackground contentWidth="80rem" variant="medium" />
      <IntroSection data={report.intro}>
        <SourcesSection data={report.sources} />
      </IntroSection>
      <OverviewSection data={report.overview} />
      <AiVisibilitySection data={report.aiVisibility} />
      <WebsiteAuditSection data={report.websiteAudit} />
      <NextStepsSection data={report.nextSteps} />
      <ContactSection data={report.contact} />
      <ReportFooter />
    </main>
    </ReportProvider>
    </>
  );
}
