# Report data and sections

The assembly page is `src/pages/ReportSections.tsx` at `#/report-sections`.
It supplies `reportMock` through `ReportProvider`; no database connection is required.

`ReportData` separates shared `context` from section-specific `intro` content.
Add future section payloads to this contract as sections are extracted.

## Shared context

- Store company and competitor identities once in `entities`, keyed by stable IDs.
- `companyId` identifies the subject; `competitorIds` identifies comparisons.
- Section records should reference an `entityId` rather than duplicate identity fields.
- `period` and `previousPeriod` contain ISO calendar dates; sample dates are illustrative.
- `reportLabel` is display copy; the data supplier must keep it consistent with the period.
- `locale` is available for number/date formatting.
- `ReportProvider` validates referenced identities and never fetches or modifies data.

Sections use `useReportContext`, `useReportCompany`, or `useReportCompetitors`.
Reusable cards remain prop-driven and do not depend on context.

```tsx
<ReportProvider value={report.context}>
  <IntroSection data={report.intro} reportUrl={reportUrl} />
</ReportProvider>
```

The current intro consumes shared identity and report label. Older sections in
`Reports.jsx` still use their original sample data until individually migrated.
Narrative strings remain section data: changing identity does not rewrite prose.

The consuming app owns fetching, loading/error handling, and formatting. Replace
the mock report with validated application data; no UI database logic is needed.
