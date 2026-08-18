import { ConsoleLayout } from "@/layouts/ConsoleLayout";
import { Agentation } from "agentation";

function App() {
  return (
    <>
      <ConsoleLayout />

      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

export default App;
