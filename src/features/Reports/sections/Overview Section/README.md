# Overview section

The first element combines the existing NextStepsIntro artwork (Artboard 2) with
ReportHeading. Copy is supplied through OverviewSectionData, with no fetching.
It preserves the heading's default width constraints, balanced title wrapping,
and neutral badge. The main heading uses the report's serif intro variant.

Add supporting ReportSection children to this component as the overview grows.
They inherit subsection behavior: no additional bottom borders or page gutters.
Use the default serif ReportHeading for their headings. The main section
owns one bottom divider after all its content.

Preview at #/report-sections after Sources, or Reports/Sections/Overview in Storybook.

## Competitor subsections

Render inside ReportProvider. SearchCompetitors and PaidSearch resolve entityId
through shared entities. Result arrays preserve the supplied ranking/order;
the UI does not infer ranking from traffic. Values are numeric or null (unknown),
and zero is displayed as zero. Paid spend includes an ISO currency code.
capturedAt is an ISO calendar date, displayed without timezone date shifting.
The sample metrics are illustrative values transcribed from the supplied sketch.
Both subsections reuse CompetitorCard's highlights variant and have no divider.
