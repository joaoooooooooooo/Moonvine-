# Sources section

Render `SourcesSection` inside `ReportProvider` and pass `SourcesSectionData`.
The website description and fallback identity come from the shared company.
Other sources supply their own display details. Source IDs must be unique and stable.

The heading count includes `connected` and `watching` sources; `not-connected`
sources are excluded. The sample therefore counts six included sources, not three.

Supply `onConnectSource(sourceId)` to open your application's connection flow.
Without it, connect buttons are disabled. This section does not connect services
or optimistically change connection status; the application supplies updated data.

The section is a subsection within Intro, with a medium serif H2 and no extra
divider or page gutters. Empty data renders an empty state.
The consuming application owns loading and error handling.

Preview at `#/report-sections`, within the intro, or Reports/Sections/Sources in Storybook.
