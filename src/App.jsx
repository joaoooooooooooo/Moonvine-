import { ReportSections } from "@/pages/ReportSections";
import { ReportDebug } from "@/features/Reports/components/reportDebug/report-debug";
import { useMemo } from "react";
import { ConsoleShell } from "@/layouts/ConsoleShell";
import { Accounts } from "@/pages/Accounts";
import { Entities } from "@/pages/Entities";
import { Observatory } from "@/pages/Observatory";
import { People } from "@/pages/People";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { BrandTools } from "@/pages/BrandTools";
import { Agentation } from "agentation";
import {
  getActiveNavItem,
  useCurrentConsolePath,
} from "@/features/console/components/app-shared";

function ConsolePagePlaceholder({ title }) {
  return (
    <section className="space-y-2">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">
        This section is ready for the next console page.
      </p>
    </section>
  );
}

function App() {
  const currentPath = useCurrentConsolePath();
  const activeItem = getActiveNavItem(currentPath);
  const isReportsPage = currentPath === "#/reports" || currentPath === "#/report-sections";
  const isBrandToolsPage = currentPath === "#/brand-tools" || currentPath.startsWith("#/brand-tools/");
  const currentPage = useMemo(() => {
    if (currentPath === "#/brand-tools" || currentPath.startsWith("#/brand-tools/")) {
      return <BrandTools />;
    }
    if (currentPath === "#/observatory") {
      return <Observatory />;
    }
    if (currentPath === "#/accounts") {
      return <Accounts />;
    }
    if (currentPath === "#/report-sections") {
      return <ReportSections />;
    }
    if (currentPath === "#/reports") {
      return <Reports />;
    }
    if (currentPath === "#/people" || currentPath.startsWith("#/people/")) {
      return <People />;
    }
    if (currentPath === "#/entities") {
      return <Entities />;
    }
    if (currentPath.startsWith("#/settings")) {
      return <Settings />;
    }

    return <ConsolePagePlaceholder title={activeItem?.title ?? "Observatory"} />;
  }, [activeItem?.title, currentPath]);

  return (
    <>
      {isReportsPage || isBrandToolsPage ? currentPage : <ConsoleShell>{currentPage}</ConsoleShell>}
      {currentPath === "#/reports" && <ReportDebug />}

      {process.env.NODE_ENV === "development" && !isBrandToolsPage && (!isReportsPage || new URLSearchParams(window.location.search).has("debug")) && <Agentation />}
    </>
  );
}

export default App;
