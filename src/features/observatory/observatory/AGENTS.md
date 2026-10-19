# Observatory V2 design rules

These are user-confirmed rules. Apply them to all work in this directory. Screenshots provide content and structure; adapt them to these existing V2 patterns.

- Editable settings and data-source pages follow `DESIGN_RULES.md`. Treat those rules as the source of truth for settings frames, field previews, dialogs, validation, loading states, combobox chips, and toasts.

- Reuse existing components and keep page sections in separate files. Do not copy a reference's visual conventions when they conflict with V2.
- Major page sections use the shared `v2-page-sections` stack with 64px spacing. Keep the internal heading/content gap at 40px and heading/description gap at 8px.
- Page content and header breadcrumbs use centered `max-w-4xl` containers. Intelligence uses its own `/intelligence/client/:id/current` routes and `Intelligence > Overview` or `Intelligence > source` breadcrumbs. The account/week selector stays in the header beside the breadcrumbs.
- Page and section headings use `max-w-[32rem]`, matching `components/page-heading.jsx`. Do not let a section heading span the whole content width.
- All page and section descriptions use `max-w-[36ch]`, matching the AI intro, with an 8px heading/description gap. Use a 40px heading/content gap for major sections.
- Across source pages, descriptions beneath headings use `text-base`, including the intro, section descriptions, next-step descriptions, and process descriptions. Reuse `SectionHeading` for section typography and the 8px description gap.
- Source pages reuse the V2 card and ranked-row patterns: social accounts have provider logos; search competitors have entity profiles and competitor badges; query and media-category rows use proportional fills with counts. Keep presentation metadata in data modules and source sections in separate component files.
- Use sentence case. No `uppercase`, all-caps labels, or uppercase eyebrow styling. Product names and acronyms such as AI retain their normal spelling.
- Global wrapping is mandatory: body text uses `text-wrap: pretty`, headings use `text-wrap: balance` (defined in `src/styles/index.css` and the root `AGENTS.md`).
- Supporting metric labels use `text-sm/normal`. Do not shrink them to `text-xs` without an existing component precedent or explicit request.
- Cards follow `components/signal-card.jsx`: `FrameCard`/`FrameCardContent`, `v2-signals-grid` styling, and `v2-card-tagline` where a card header is needed. This supplies one visible border and the V2 radius. Avoid nested Frame/FramePanel stacks around card grids.
- Every `v2-card-tagline` has a bottom border using `var(--border)`, like table headers.
- Chart, frame, and table header titles and icons use `foreground`. Reporting dates and inactive tabs use `muted-foreground`.
- Put chart controls in the header, with the icon before the title and reporting month immediately beside it. Put summary metric labels below values and matching category markers beside footer category names.
- Analytic frames use the Media Mentions structure: a full-width `v2-card-tagline` as the first content row, followed by a full-width body. The body and its visualizations must fill the available card width; keep primary values in the body instead of the header.
- Expandable data tables use `ObservatoryCollapsibleTable`, which composes the shared `ObservatoryTable` frame and table primitives. Define columns through its column API and supply detail rendering; do not recreate table layouts with CSS grids.
- Table headers and cells align text to the start unless the content has an established directional convention. All numeric table content inherits tabular numerals from the shared `Table` primitive. Render `-` in muted text for every empty table cell; never leave a visible table cell blank. Expected-fix impact uses this placeholder when an audit already has a good status.
- Use the table component's natural column layout for mixed-content expandable tables. Do not hand-size every column. Expanded parent rows remove their bottom divider so the detail row reads as the same item. Expanded descriptions use `max-w-[48ch] text-sm/normal` muted body copy.
- Nested issue lists inside expanded table details use `text-sm/normal` for both the issue title and fix copy. The issue title uses medium weight; the fix uses muted foreground.
- Fixable website issues are grouped by issue type rather than by page. Their expandable detail renderer is schema driven: explanation fields are shared, while affected-page lists and actions are optional per issue. Do not assume every expanded row has the same sections.
- Expandable tables place the disclosure caret inside the final data cell; do not create an empty caret-only column. Fixable website issue rows show Issue, Area, Expected impact, and Occurrences, with affected-page links led by the regular file icon.
- Website score cards pair the shared last-week comparison at the inline start with the 14px score at the inline end above the progress line.
- Badges are borderless across the design system. Status badges inside tables use the large badge size.
- V2 cards use the table CardFrame surface tokens: `bg-card`, `text-card-foreground`, `shadow-xs/5`, light-mode padding clipping, and the same light/dark edge highlight. Apply these to the outer card only; keep inner borders/shadows disabled to avoid doubling the frame.
- Comparison labels reuse `components/metric-comparison.jsx`: a sentiment-colored change followed by a muted comparison period. Do not introduce a separate comparison layout for provider cards.
- Use company logos for provider identities, not generic status icons. Store logos locally with source attribution. Hover effects apply to linked cards only and change only the border, never the background.
- Tables use `components/observatory-table.jsx` (`CardFrame`, card table variant, V2 cell spacing/corners). Reuse shared Reports table content when relevant, inside the V2 table wrapper.
- AI visibility organization and source lists sit inside V2 cards with card headers. Reuse Reports `RankItem` for the entity profile (logo or initial fallback), competitor badge, proportional fill, count badge, and percentage. Show competitor badges only for entities identified as competitors in the account data, never the account itself. Percentages describe the share of counts within each list. Use `gap-2` between rows; no rank columns or table headers.
- Method summary metrics use content-sized items in a wrapping flex row with `gap-6`; do not distribute them across equal-width columns or use space-between.
- Do not add a duplicate count block beside the AI visibility heading. Method summary values use the H1 treatment, with the label displayed below the value.
- No numbered side rails or introductory taglines on AI visibility sections. Do not add a separate Provider coverage heading/description above the provider cards.
- Use the simple `SectionDivider` between sections. Do not add decorative borders to metric summaries or duplicate section separators with `border-y`.
- Chart legend and category markers are filled squares with exactly `2px` corner radii. Use distinct shared chart tokens (`--chart-1` through `--chart-5`) for categories, keeping colors stable across periods; never use a monochromatic category palette.
- Chart values count up/down in place using tabular numerals, without digit translation, rolling, or fading. Breakdown segments keep their category order and change horizontal size only across periods.
- All chart numbers must use tabular numerals, including summary metrics, animated values, percentages, comparisons, axis ticks, legend values, and tooltips. Use `tabular-nums` for DOM/SVG text and an equal-width-digit font/rendering configuration for canvas text, following the global design rule.
- Provider cards describe mentions and the comparison period rather than a generic “Complete” label. Counts must come from data; do not interpret missing data as zero.
- V2 uses synthetic fixtures. Keep fixture calculations in data/model modules and avoid presenting them as production measurements.

Before finishing, check the changed page against these rules and the existing V2 component patterns. Build verification does not substitute for a visual check when browser access is available.

