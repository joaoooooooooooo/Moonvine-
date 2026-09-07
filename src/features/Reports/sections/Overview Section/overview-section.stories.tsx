import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverviewSection } from "./overview-section";
import { overviewSectionMock } from "./overview-section.mock";
import { ReportProvider } from "@/features/Reports/context";
import { reportMock } from "@/features/Reports/report.mock";

const meta = {
  title: "Reports/Sections/Overview",
  component: OverviewSection,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <ReportProvider value={reportMock.context}><Story /></ReportProvider>],
  args: { data: overviewSectionMock },
} satisfies Meta<typeof OverviewSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { data: { ...overviewSectionMock, searchCompetitors: [], paidSearch: [] } } };
