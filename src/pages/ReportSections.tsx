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
import { ReportNav } from "@/features/Reports/components/nav";

const navigation = [
  { label: "Intro", value: "report-overview" },
  { label: "Around you", value: "report-market-overview" },
  { label: "AI visibility", value: "report-ai-visibility" },
  { label: "Website audit", value: "report-website-audit" },
  { label: "Next steps", value: "report-next-steps" },
  { label: "Contact", value: "report-contact" },
];

/** Assembly page for the data-driven report sections. */
export function ReportSections() {
  const [scenarioId, setScenarioId] = useState("typical");
  const report = reportScenarios.find(scenario => scenario.id === scenarioId)!.report;
  return (
    <>
    <ReportDebug value={scenarioId} onChange={setScenarioId} />
    <ReportProvider key={scenarioId} value={report.context}>
    <main className="relative h-svh overflow-x-hidden overflow-y-auto pt-16">
      <SideLineBackground contentWidth="80rem" variant="medium" />
      <ReportNav items={navigation} />
      <IntroSection data={report.intro} reportUrl={window.location.href}>
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
