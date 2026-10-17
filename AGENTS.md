# Global design rules

- Chart and table view controls use COSS underline tabs (`p-tabs-2`): selected labels are foreground, inactive labels muted. Use `ResponsiveChartTabs` and its borderless muted COSS select fallback (`p-select-22`) when options cannot fit horizontally. Preserve keyboard navigation.
- Source-management actions use the default button variant.
- Chart total labels use foreground, and metric comparisons use `text-sm/normal` (14px) with tabular numerals.
- Percentage table cells pair their numeric value with a proportional visual bar on a consistent 0–100% scale.
- Country distributions use `flag-icons` flags with 3px corner radii and neutral bars, not categorical colors. Use a globe for Other/unknown locations; never invent a flag.
- Leave a 16px gap between chart plots and weekday axis labels.
- Underline tabs have no hover background and no bottom padding. Headers containing underline tabs also have zero bottom padding so the indicator meets the header divider.
- Chart headers with tabs and their tab lists use zero vertical padding. Tab labels supply balanced `py-5` with auto height, keeping headings and labels vertically centered and the underline flush with the divider.
- Chart, table, and frame header titles default to 14px (`text-sm/normal`). Table body items also remain 14px.
- Percentage and country-distribution bar fills use full-opacity `foreground`. Country flags use 12px sizing with 3px corner radii.

- Body text must use `text-wrap: pretty`; headings must use `text-wrap: balance` throughout the application, Reports, and shared UI. The defaults live in `src/styles/index.css`. Preserve this rule when adding components; do not override body text with balanced wrapping or headings with pretty wrapping.
- Keep intentional single-line controls, truncation, and preformatted code behavior intact.
- Input fields must use the borderless variant.
- All table item text, including headers, must be `14px`.
- All numbers in tables and charts must use tabular numerals (`font-variant-numeric: tabular-nums` / `tabular-nums`), including values, totals, percentages, comparisons, axis ticks, legends, and tooltips. Preserve this treatment during number animations. For canvas-rendered charts, explicitly use a font/rendering configuration with equal-width digits; do not assume inherited CSS applies to canvas text.
- Do not use double-frame elements; a surface must not be wrapped in another redundant frame.
- Chart legend and category markers must be filled squares with exactly `2px` corner radii.
- Different chart categories use the shared distinct chart colors (`--chart-1` through `--chart-5`), with stable category-to-color mappings. Do not replace the palette with shades of a single color.
- Animated chart numbers count up or down in place with tabular numerals. Do not translate, roll, or fade digits. Breakdown segments retain their category order across period changes and animate horizontal size only.
- Follow scoped design rules where present, including `src/features/observatory/_V2/AGENTS.md`.
- Chart, frame, and table header titles and icons use `foreground` at full opacity. Reporting dates and inactive tabs use `muted-foreground`. Muted header backgrounds remain unchanged.
- Chart period and metric controls belong in the chart header. Place the icon before the title, the reporting month immediately after the title, and controls at the inline end; use the shared responsive select fallback when tabs cannot fit.
- Summary metric labels appear below their values. Category names in chart summary footers include their matching square color marker.
