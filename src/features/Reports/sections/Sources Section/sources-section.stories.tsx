import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReportProvider } from "@/features/Reports/context";
import { reportMock } from "@/features/Reports/report.mock";
import { SourcesSection } from "./sources-section";
import { sourcesSectionMock } from "./sources-section.mock";

const meta = {
  title: "Reports/Sections/Sources",
  component: SourcesSection,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <ReportProvider value={reportMock.context}><Story /></ReportProvider>],
  args: { data: sourcesSectionMock },
} satisfies Meta<typeof SourcesSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { data: { ...sourcesSectionMock, sources: [] } } };
export const AllConnected: Story = {
  args: { data: { ...sourcesSectionMock, sources: sourcesSectionMock.sources.map((source) => ({ ...source, status: "connected" as const })) } },
};
