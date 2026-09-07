import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReportProvider } from "@/features/Reports/context";
import { reportMock } from "@/features/Reports/report.mock";
import { AiVisibilitySection } from "./ai-visibility-section";
import { aiVisibilityMock } from "./ai-visibility.mock";

const meta = {
  title: "Reports/Sections/AI Visibility",
  component: AiVisibilitySection,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <ReportProvider value={reportMock.context}><Story /></ReportProvider>],
  args: { data: aiVisibilityMock },
} satisfies Meta<typeof AiVisibilitySection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = {
  args: { data: { ...aiVisibilityMock, test: { totalAnswers: 0, namedAnswers: 0, status: "warning" }, citations: [], questions: [] } },
};
export const Positive: Story = {
  args: { data: { ...aiVisibilityMock, test: { totalAnswers: 75, namedAnswers: 60, status: "good" } } },
};
