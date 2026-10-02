# Observatory V2 design rules

These are user-confirmed rules. Apply them to all work in this directory. Screenshots provide content and structure; adapt them to these existing V2 patterns.

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
- V2 cards use the table CardFrame surface tokens: `bg-card`, `text-card-foreground`, `shadow-xs/5`, light-mode padding clipping, and the same light/dark edge highlight. Apply these to the outer card only; keep inner borders/shadows disabled to avoid doubling the frame.
- Comparison labels reuse `components/metric-comparison.jsx`: a sentiment-colored change followed by a muted comparison period. Do not introduce a separate comparison layout for provider cards.
- Use company logos for provider identities, not generic status icons. Store logos locally with source attribution. Hover effects apply to linked cards only and change only the border, never the background.
- Tables use `components/observatory-table.jsx` (`CardFrame`, card table variant, V2 cell spacing/corners). Reuse shared Reports table content when relevant, inside the V2 table wrapper.
- AI visibility organization and source lists sit inside V2 cards with card headers. Reuse Reports `RankItem` for the entity profile (logo or initial fallback), competitor badge, proportional fill, count badge, and percentage. Show competitor badges only for entities identified as competitors in the account data, never the account itself. Percentages describe the share of counts within each list. Use `gap-2` between rows; no rank columns or table headers.
- Method summary metrics use content-sized items in a wrapping flex row with `gap-6`; do not distribute them across equal-width columns or use space-between.
- Do not add a duplicate count block beside the AI visibility heading. Method summary values use the H1 treatment, with the label displayed below the value.
- No numbered side rails or introductory taglines on AI visibility sections. Do not add a separate Provider coverage heading/description above the provider cards.
- Use the simple `SectionDivider` between sections. Do not add decorative borders to metric summaries or duplicate section separators with `border-y`.
- Chart legend markers are filled, not outlined. Use semantic color tokens, such as `bg-foreground`, instead of fixed white fills.
- Provider cards describe mentions and the comparison period rather than a generic “Complete” label. Counts must come from data; do not interpret missing data as zero.
- V2 uses synthetic fixtures. Keep fixture calculations in data/model modules and avoid presenting them as production measurements.

Before finishing, check the changed page against these rules and the existing V2 component patterns. Build verification does not substitute for a visual check when browser access is available.

