# Brand tools

Open `#/brand-tools` for the searchable coss command index, or
`#/brand-tools/citation` for the citation editor. The tool catalog lives in
`src/pages/BrandTools.jsx`.

Both routes are standalone pages, outside the dashboard shell and navigation.
The index shows only the command box, using the same shared surface, input,
group labels, and compact rows as the existing search command. Brand tools use
the dark theme; leaving the studio restores the previous dashboard theme.

The citation editor uses the existing Moonvine orbit and four stepper Rive
artboards. Text, orientation, animation, type sizes, and duration are saved to
the browser under `moonvine.citation.v1`. No server or upload is required.

Asset placement includes size (25–200%) and horizontal/vertical pixel offsets.
Defaults are 92% size, −46 px horizontal offset, and −154 px vertical offset.
Each animation/orientation pair retains its own adjustments. Reset placement
restores only that pair. The renderer uses measured, fixed artwork bounds to
calculate a uniform scale and position for each source, compensating for the
artboards' different amounts of empty space. Size changes scale around the
shared visual center; positive offsets move right/down. The same transform is
used for previews, PNGs, and videos, with no frame-by-frame auto-resizing.

Preview and exports share the same canvas renderer:

- Post theme: Light or Dark, saved with the draft. Background, text, and artwork
  switch together, including paused frames. The studio's interface stays dark.

- Portrait: 1080 × 1350 px; landscape: 1350 × 1080 px.
- Images: PNG of the current preview frame.
- Video: 30 fps, MP4 when supported by MediaRecorder, otherwise WebM.
- Recording runs in real time. Keep the tab visible; Cancel discards recording.
- Long citations shrink to fit. Content that still exceeds the layout blocks export.

Figma references: file `UtOdvypbSnAsX2qCHhrtN3`, nodes `1:8` and `1:23`.
Artwork placement and canvas colors follow these references. The controls use
the application’s existing coss components and theme tokens. The reference uses
Nib Pro Regular; only Nib Pro Semibold is currently available in this project,
so that is used in both preview and export.

Browser integration verification: with Vite running at port 5173, run
`node tmp/verify-brand-tools.cjs`. It checks keyboard search, persistence,
formats, real PNG/video downloads, text validation, mobile overflow, and cleanup.

The second tool is **Post template**, at `#/brand-tools/post`. It uses the
Moonvine logo, an optional editable tagline, and a heading. The same sidebar,
theme tabs, formats, sliders, and PNG export are available. Its draft is
saved independently under `moonvine.post.v1`.

The bottom-right selector contains 18 report features: three distribution
charts, social interactions, citation rankings, questions, search competitors,
paid search, website audit, scores, checks, issues, recommendations, social
watch, news, sources, AI answer metrics, and the complete AI answer summary
(status, sentence, and both counts). These reuse the actual report components.
The sidebar's Report scenario selector uses the same five scenarios as the
report page and saves the selection with the draft; existing drafts start with
`typical`, including its social/news artwork. Scenario changes update every
feature's company, metrics, tables, and cards. Empty datasets have explicit
empty states. These are sample scenarios, not live report connections.
Real entity identities come from `report-entities.ts`, with matching websites
and locally stored logos. Each scenario chooses its own company, competitor
roster, and publication: Apta Agency (typical), Superside (growth), Curio Digital
(decline), Instrument (busy), and Hlabs (empty). The metrics remain illustrative;
real organization names do not turn the scenario values into measured results.
Each feature/format pair has independent size and horizontal/vertical offsets,
starting at the same 92%, -46 px, -154 px defaults as citation assets.

Report components render in an isolated, fixed-width iframe so their theme and
desktop layout stay independent of the editor viewport. After fonts, images,
and chart introductions settle, html-to-image captures the component at 2x.
Text edits and placement updates then composite immediately without recapturing.
Posts are static images: the canvas redraws only when content or settings
change, and PNG is the only export. The canvas uses the selected theme's resolved
`--background` token from the report surface. Across the bottom 28% of the post,
opaque artwork pixels blend directly to that exact background RGB. This avoids
premultiplied-alpha rounding bands and keeps matching background pixels identical
throughout the fade. Heading and logo render afterward. Shorter AI summaries
have a narrower default visual width.
Citation retains its separate animation and video controls.

`node tmp/verify-post.cjs` checks the command selector, all feature PNG exports,
theme and format changes, independent placements, draft persistence,
mobile overflow, and cleanup when returning to Citation.
`node tmp/verify-post-scenarios.cjs` checks the summary across all five scenarios,
empty datasets, scenario persistence, static PNG exports, themes, and formats.
