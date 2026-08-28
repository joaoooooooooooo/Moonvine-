# Reports Components Overview

Updated: August 28, 2026

## Summary

This update adds a new dedicated Reports page experience and the reusable components needed to support it. The work includes new report-specific content blocks, a new ECharts-based line chart, and a few shared UI primitives that can be reused in other areas of the product.

## What changed

### 1. New Reports page

Modified:

- `src/pages/Reports.jsx`
- `src/App.jsx`

What it adds:

- A dedicated full-page Reports layout rather than rendering inside the standard console shell.
- A structured page flow with multiple sections for the weekly summary, signal lists, charted performance, and surrounding market activity.
- A top-right theme switcher and a copy-link action for sharing the report view.
- Page-level overflow handling so the report behaves like a standalone scrollable experience.

PM note:

- This is the main feature surface introduced in the change set.

### 2. New report-specific components

Created under `src/features/Reports/components`.

#### `ReportHeading`

- Reusable heading block for report sections.
- Supports title, description, optional badge, left/right alignment, and optional follow-up action content.
- Used to keep section intros visually consistent across the page.

#### `ReportSection`

- Reusable section wrapper for spacing, full-width dividers, and vertical frame lines.
- Creates a consistent editorial layout across all report sections.

#### `Metric1`

- Reusable metric summary component for large KPI callouts.
- Supports prefix/suffix values, comparison badges, comparison copy, alignment, and size variants.
- Used both as a hero metric and in the chart summary area.

#### `StatusListCard` and `StatusListItem`

- Card pattern for summarizing report signals in a stacked list.
- Supports multiple status treatments including informational, warning, success, default, and disabled states.
- Designed for quick scanning of signal coverage and connection status.

#### `SocialCard`

- Card pattern for external or contextual signals such as competitor, news, and watch-list items.
- Supports thumbnails, icons, optional badges, and a link-style action indicator.
- Used to present "what happened around you" content in a visual grid.

#### `ReportsMultiSeriesLineChart`

- Report-specific chart composition for weekly trend comparisons.
- Combines a KPI summary, legend, and two-series line chart in one reusable block.
- Current example compares "This week" vs "Last week" for shipped orders.

#### `ReportsCalendar`

- Existing calendar component was reorganized into the new `Reports` feature folder.
- Continues to support scheduled report viewing by month, week, and report type.
- No meaningful behavioral rewrite was introduced in the moved file based on the current diff.

## Shared components added or updated

### 3. New shared UI building blocks

Created:

- `src/components/ui/frame-card.tsx`
- `src/components/shared/copy-button/*`

Modified:

- `src/components/ui/badge.tsx`

What they add:

- `FrameCard` introduces a reusable framed card treatment with separate top/content regions and optional filled styling.
- `CopyButton` adds a reusable copy-to-clipboard action with temporary "Copied" feedback.
- `Badge` was expanded to better support the new report states and visual treatments, including transparent/backgroundless usage.

PM note:

- These are not report-only. They create reusable patterns for future features.

## Charting work

### 4. New ECharts line-chart implementation

Created:

- `src/components/evilcharts/charts/echarts-line-chart.tsx`
- `src/components/evilcharts/blocks/shipments-echarts-line-chart.tsx`

What it adds:

- A new composable line-chart system built on ECharts.
- Support for grid, axes, tooltip, legends, active dots, multiple line styles, and loading states.
- A shipments-focused example block that packages the chart with summary metrics and legend treatment.

PM note:

- This is the main infrastructure addition behind the chart section on the Reports page.
- It appears designed for reuse beyond this specific report screen.

## Styling and typography support

### 5. Global typography fix

Modified:

- `src/styles/index.css`

What it changes:

- Geist font usage was made explicit at the root, body, and form-control levels.
- Headings remain intentionally mapped to the heading font token.

PM note:

- This was a supporting fix to make the chosen typeface render consistently across the full report experience.

## High-level impact

- Introduces a presentable standalone Reports page.
- Establishes reusable report layout primitives instead of one-off page code.
- Adds a richer charting foundation for future data storytelling.
- Expands shared UI inventory with reusable cards, badges, and copy actions.
- Improves consistency of typography across the experience.

## Suggested PM framing

This release introduces the first full version of the new Reports experience. It includes a dedicated report page, reusable content blocks for metrics and signal summaries, a new ECharts-based trend chart, and shared UI foundations that can support future reporting and analytics surfaces.
