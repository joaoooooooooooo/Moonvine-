# Website Audit Section

Accepts WebsiteAuditData; no database access. The report provider supplies the company website and locale. Mock scores reproduce the supplied examples and should be replaced with real metric labels and values at integration.

Artboard 3 uses the shared in-view trigger. AuditSummary renders four score cards followed by four site checks (four columns on desktop). AuditIssues renders the complete 11-item legacy fix list with copy actions. Nested sections have no divider; the main section owns the bottom divider.

Crawl totals and sitewide recommendations are separate: a high-priority sitewide recommendation is not counted in the crawl total. The robots recommendation is preserved from the legacy sample even though the summary detects a robots file; integration should provide consistent findings.
