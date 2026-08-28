import { useMemo } from "react";
import { ConsoleShell } from "@/layouts/ConsoleShell";
import { Accounts } from "@/pages/Accounts";
import { Entities } from "@/pages/Entities";
import { Observatory } from "@/pages/Observatory";
import { People } from "@/pages/People";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
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
  const isReportsPage = currentPath === "#/reports";
  const currentPage = useMemo(() => {
    if (currentPath === "#/observatory") {
      return <Observatory />;
    }
    if (currentPath === "#/accounts") {
      return <Accounts />;
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
      {isReportsPage ? currentPage : <ConsoleShell>{currentPage}</ConsoleShell>}

      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

export default App;
