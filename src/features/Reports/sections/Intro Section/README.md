# Intro section

`IntroSection` composes the existing report breadcrumb, heading, metric, copy button, orbit artwork, and section wrapper. It does not fetch data. Render it inside `ReportProvider`: company identity and report label come from shared context; heading, summary, and metric come from section data.

Import the component and its contract from `index.ts`. Supply `data: IntroSectionData` and an optional absolute `reportUrl`. Mock data is exported separately from `intro-section.mock.ts` and must be replaced by the consuming application for production.

- `metric: null` hides the metric.
- `metric.comparison: null` hides the comparison.
- `description: null` hides the summary.
- Omit `reportUrl` to hide the copy button.
- Metric values are display strings; format numbers and dates before supplying them.
- Comparison sentiment is explicit: a positive result is not necessarily a numerical increase.
- The page owns loading/error handling and supplies the section once its data is ready.

Preview the section at `#/report-sections` or in Storybook under Reports/Sections/Intro. The original `#/reports` page also reuses this section.

## Section hierarchy

- `ReportSection variant="main"` owns the page gutters, vertical spacing, and bottom divider.
- A `ReportSection` nested inside another automatically becomes a subsection: no dividers or repeated page gutters. Use a parent `flex flex-col gap-12` layout to space subsections.
- `variant="subsection"` can also be set explicitly.
- `ReportHeading variant="intro"` renders an H1. Other headings default to H2; use `as="h3"` for deeper nesting. Titles default to serif; badges and descriptions use sans serif. The first section uses a 48px title; other intro headings retain their 40px size.

```tsx
<ReportSection variant="main">
  <div className="flex flex-col gap-12">
    <ReportHeading variant="intro" title="Main heading" badge={null} />
    <ReportSection>
      <ReportHeading title="Supporting section" size="medium" badge={null} />
    </ReportSection>
  </div>
</ReportSection>
```
