import { ReportProvider } from "@/features/Reports/context";
import { reportMock } from "@/features/Reports/report.mock";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntroSection } from "./intro-section";
import { introSectionMock } from "./intro-section.mock";

const meta = {
  title: "Reports/Sections/Intro",
  component: IntroSection,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <ReportProvider value={reportMock.context}><Story /></ReportProvider>],
  args: { data: introSectionMock },
} satisfies Meta<typeof IntroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutMetric: Story = {
  args: { data: { ...introSectionMock, metric: null } },
};
export const WithoutComparison: Story = {
  args: { data: { ...introSectionMock, metric: { ...introSectionMock.metric, comparison: null } } },
};
export const NegativeComparison: Story = {
  args: { data: { ...introSectionMock, metric: { ...introSectionMock.metric, comparison: { label: "- 12%", text: "Vs Last Week", sentiment: "negative" } } } },
};
