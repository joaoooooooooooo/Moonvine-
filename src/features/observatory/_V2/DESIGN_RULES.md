# Editable settings design rules

These rules apply to Observatory data-source pages and other editable settings. They document the current direction without requiring every setting to use an identical layout. Reuse the shared primitives and preserve the interaction patterns below; adapt content and control types to the setting.

## Page structure

- Use `v2-page-sections` for the page stack and `PageHeading` for the page introduction.
- Page descriptions use the established section-copy measure and typography: `max-w-[36ch] text-base leading-6 text-muted-foreground`.
- Group related settings in `PanelFrame`, using `PanelFrameHeader`, `PanelFrameTitle`, and `PanelFrameContent`.
- Use the compact framed-card treatment: one visible border, `radius-md`, `bg-card`, the shared edge highlight, and a muted header row.
- A frame header may include a relevant regular-weight icon and a sentence-case title. Do not add a caret unless the whole frame navigates somewhere. Table frames are the exception: their `PanelFrameHeader` contains the table’s aligned column labels instead of a separate frame title, while non-table frames keep the standard title treatment.
- Use full-width `Separator` elements between settings. Keep horizontal padding on each setting instead of on `PanelFrameContent`, so dividers reach both frame edges.

## Editable field rows

- Keep each field visible in the frame as a read-only preview. Clicking anywhere in the field row opens its editor.
- Field rows use the shared spacing tokens, a pointer cursor, and `hover:bg-accent/50`. Keyboard focus uses the same background plus the inset ring token.
- Use a slightly larger gap between the field label and its preview control (`gap-3` in the current implementation).
- Show required fields with the shared destructive asterisk. Optional fields do not need an “Optional” label.
- Preserve the control’s visual type in its preview: inputs look like inputs, textareas look like textareas, avatars remain visible, and multi-value fields show chips.

## Inputs and textareas

- Settings inputs use the large size unless a specific layout needs another size.
- Use the `muted` `InputGroup` treatment for settings: muted background, transparent border, no resting shadow, and no resting edge highlight.
- Textareas use the equivalent muted, borderless treatment.
- Focus, invalid, disabled, and loading states still use the shared component behavior and semantic tokens.
- URL fields show the protocol as an inline-start addon. The protocol uses `text-muted-foreground`, and the input removes extra start padding so the protocol and domain read as one value.
- Use native `maxLength` and the COSS remaining-character pattern for bounded text. Current limits are 80 characters for organization names and 144 characters for organization descriptions.

## Edit dialogs

- Inline previews are not directly editable. Open a dialog based on the COSS `p-dialog-1` composition when a setting is activated.
- Dialogs use `DialogHeader`, `DialogTitle`, optional `DialogDescription`, `DialogPanel`, and `DialogFooter`.
- Do not add feature-level top padding to `DialogPanel`. The primitive already handles spacing after `DialogHeader`; extra padding creates an empty band above the editor.
- Use the frame radius token (`radius-md`) for the popup, its inner highlight, and footer corners. Clip the popup so the header, panel, and footer share the same silhouette.
- Standard settings dialogs use `sm:max-w-md` and content-driven height. Do not force a minimum height: the editor should follow the header directly and the footer should follow the editor without an empty center gap. Larger selection dialogs may use an explicit bounded height when their content needs to scroll.
- Align dialog footer actions to the left. Put Save first and Cancel second. Save is disabled until the draft differs from the saved value and the value passes synchronous validation.
- Cancel discards the draft. A successful save updates the visible preview and the workspace model.
- When a dialog opens, initialize its draft from the current saved value. Select an existing single-line value when immediate replacement is likely, such as the watched domain.

## Validation and feedback

- Use the field primitive’s invalid state. Invalid controls use destructive border and ring tokens; feedback appears directly below the control in `text-destructive-foreground`.
- Keep persistent helper text in place when validation fails and change its color to the destructive token. Do not replace it with unrelated copy.
- Domain fields reject malformed hostnames, including consecutive dots. Use “This domain isn’t valid.” for immediate format feedback.
- An asynchronous domain rejection uses “Please add a valid domain.” and keeps the dialog open so the user can correct the value or cancel.
- Save remains disabled for synchronously invalid values.

## Loading states

- Use the COSS `p-input-16` composition for checks that happen after Save: a disabled `InputGroupInput`, status text as its placeholder, and `Spinner` inside an inline-end `InputGroupAddon`.
- Use the shared `Spinner` primitive, which follows the COSS Lucide `Loader2Icon` animation.
- While checking a domain, hide the domain value and show “Checking domain…” inside the input. Keep the dialog open and prevent duplicate saves or accidental dismissal until the check finishes.

## Multi-value fields

- Use the COSS `p-combobox-9` composition for nickname-style values: `Combobox`, `ComboboxChips`, `ComboboxValue`, `ComboboxChip`, and `ComboboxChipsInput`.
- Do not recreate chips with badges or custom pill markup.
- Approved nicknames allow up to five values. Keep “Choose up to 5 nicknames.” below the field. If a sixth value is attempted, keep that text visible and change it to the destructive color.

- For topic or keyword entry, use a plain single-value input when tags should remain visually separate from typing. Enter commits the current value, clears the input, and adds a removable tag in a wrapping list below the field.
- Topic tags use the same default `ComboboxChip` treatment as Approved nicknames, including `text-sm`, the remove icon, and fixed default size. Remove the surrounding `ComboboxChips` surface visually when the tags sit below a separate input.

## Connected account tables

- Use a table when a settings group has a stable list of providers and users need to compare profile and connection status at a glance.
- Use the shared `h-12` height for interactive settings table rows. Keep this height consistent across tables even when one table has icons and another uses text only.
- Three-column settings tables use `table-fixed` with equal `w-1/3` columns. Keep the same column positions across Social accounts, Competitors, and future settings tables instead of sizing columns from their content. Render the aligned column-label grid in `PanelFrameHeader` and omit a second table header inside the content.
- When table entities have recognizable websites or platforms, reserve the same unwrapped `size-5` icon slot before the primary label. Use the platform asset when known and a reliable favicon service for domain-based entities such as competitors.
- Keep the columns direct: provider, saved profile, and status. Show a plain `-` in the profile column when a predefined provider is not connected.
- Each provider row is its own edit trigger. Preserve the settings-row hover and keyboard focus treatment across the full row.
- Competitor rows follow the same interaction: the full row opens an individual dialog for editing its watched domain, and connected competitors can be disconnected from that dialog with confirmation and Undo.
- Open a separate dialog for each provider. Use one large, muted URL input rather than a multi-value chip field, and show the provider icon inside the input.
- Validate a URL against the selected provider after Save. While checking, replace the value with the shared disabled loading input and keep the dialog open. Close only after a successful check.
- Connected providers use the success status dot. Their edit dialog includes a right-aligned, borderless “Disconnect account” action; Save and Cancel remain grouped on the left. Confirm disconnection with the shared COSS alert-dialog pattern, then offer Undo through the shared toast. Disconnected providers use a muted status dot and the copy “Not connected.” Do not place a Connect button in predefined disconnected rows.
- Keep a permanent final row for adding providers outside the predefined list. Use a dashed circular icon with a plus, leave its profile and status cells empty, and label it “Add other platform.”
- Each saved custom provider becomes its own connected row above the permanent add row. Derive a readable provider label from the hostname and use the site favicon when available.
- When a suggestion action is self-explanatory, place the primary button alone at the left edge below the setting and omit repeated heading or helper copy.

## Suggested selections

- Suggested multi-select lists use the shared controlled `CheckboxGroup` and `Checkbox` primitives. Do not recreate checkbox behavior with clickable `div` elements or visual-only checkbox state.
- Present competitor suggestions as a two-column grid inside the wider dialog. Within each suggestion card, stack the checkbox and text content vertically. Keep ordinary single-field dialogs at the standard size.
- Make the whole labeled suggestion card activate its checkbox while preserving the checkbox primitive’s keyboard and checked state behavior.
- Show the current selection count in the settings frame header instead of adding a badge inside the suggestion dialog. When a maximum is reached, keep selected options available for deselection and disable only the remaining unselected options.
- Save the selected values through the settings dialog footer and use the shared success toast with Undo.

## External data connections

- Present external sources in the standard three-column settings table with Source, Domain, and Status columns. Rows use the shared height, icon slot, hover, and keyboard behavior.
- Clicking a source opens an explanation dialog. Keep the primary Connect or Change Domain action first and Cancel second, aligned to the left.
- For mocked OAuth flows, the first dialog uses its content-driven default height and contains only the source explanation and footer actions. Do not force the standard edit-dialog minimum height when there is no editor panel. Connect closes it and opens a separate property-selection dialog.
- Property selectors use the standard square `Checkbox` treatment in a controlled single-selection list. Selecting one property clears the previous selection.
- Property selectors use a two-column grid. Each property card stacks its checkbox and content vertically.
- Give the property dialog a bounded responsive height. Let its `DialogPanel` fill the remaining height and wrap the property list in the shared `ScrollArea` so overflow activates the scrollbar and dynamic edge fades.
- Property cards stack every element vertically. Use `text-base` for the property title and domain, place the shared Globe icon before every domain, then show the metadata and ownership badge on separate lines below them.
- Keep the final action disabled until a property is selected. Once selected, include its domain in the button label, such as “Connect banana.com.”
- A successful connection updates the table status and uses the shared success toast with Undo. Do not add a separate success dialog when the toast communicates completion.

## Index settings

- Keep the stock ticker and official company source visible as standard settings field previews. Open their editors with the shared settings dialog instead of editing inline.
- Normalize ticker values to uppercase and validate their compact exchange-symbol format. Official company sources use the standard domain input treatment and validation.
- Stack the checkbox above its label and supporting copy for the Index by Moonvine selector. Save the choice immediately and provide the shared reversible success toast.

## Toasts

- Use the shared COSS toast primitive and `toastManager`; do not create page-specific toast markup.
- Toast surfaces use `--popover` and `--popover-foreground`. In the dark theme, `--popover` resolves to the established `#1d1d1d` surface.
- Semantic toasts include an icon, title, and description. Use the COSS `p-toast-2` structure.
- Successful reversible settings changes use the COSS `p-toast-4` action pattern. Include an Undo action that restores the previous value, closes the success toast, and shows an informational confirmation toast.
- Toast copy uses sentence case and describes the completed action directly.

## Primitive and token decisions

- Prefer shared primitives in `src/components/ui` over feature-local visual recreations.
- Add a reusable primitive or variant when a pattern will appear across settings. Current settings primitives include `PanelFrame` and `InputGroup`’s `muted` variant.
- Use semantic tokens for color, radius, shadow, spacing, and typography. Avoid fixed color values in components.
- COSS particles define component composition and behavior. Adapt their appearance through existing Moonvine tokens instead of rewriting their internal interaction patterns.
- Variation is allowed when the content requires a different control, density, or message. Preserve the shared surface, state, feedback, and editing behavior.
