# Report debug scenarios

Open Report debug at the bottom right of /#/report-sections. Five deterministic fixtures cover a typical week, strong growth with one fix, decline, ten competitors, and an empty report. This is a presentation sandbox; it does not connect to a database or save changes.

report-scenarios.ts owns fixture assembly. ReportProvider supplies the selected entity registry and competitorIds. Source cards, search rows, social posts, citation rankings, distribution charts, and article publishers resolve entity IDs through that registry. A publisher can appear beside competitors without receiving a competitor badge.

Scenario changes remount the report so pagination, selected filters, chart selection, scroll position and Rive state restart. The debug panel stays mounted. Existing /#/reports keeps its original fixtures.

The intro supports negative, positive, neutral and absent comparisons. Fixtures include a missing intro metric, empty lists, zero mentions, variable card counts and long competitor names. Distribution totals add to 100; question mentions add to the named-answer total.

Replace fixture data with ReportData at integration. Use stable IDs and numeric metrics; do not copy company names into every component. Optional source.entityId links a connected or watched source to a report entity; article source.entityId links a publisher to the same registry. Keep competitor membership in context.competitorIds.
