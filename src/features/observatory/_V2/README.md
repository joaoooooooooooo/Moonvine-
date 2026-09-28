# Observatory - live app recreation

Open **/observatory-v2#/console**. This is a standalone entry selected in `src/main.jsx`, with a local adaptation of the MVDS app shell in `components/shell/`. The old `/#/observatory-v2` URL redirects here. Prototype 1 remains unchanged.

## Constraint

Preserve the live Observatory page content and account/source flows while using the requested MVDS shell and navigation. Shell destinations stay within V2. The Marketing-Dashboard repository is a read-only reference. Local fixture values are the only data substitution; there are no production service calls.

## Source mapping

| Live source | Recreation |
| --- | --- |
| MVDS AppShell / AppSidebar / AppHeader | components/shell/: local shell, grouped sidebar, workspace menu, header, command search, and theme control |
| ConsoleHomePage | observatory-home.jsx: identity header and four stacked directory links |
| ConsoleDirectoryPage | directory-page.jsx: account/domain/signal table and search; directory destinations remain inside this standalone entry |
| ConsoleCurrentWeekPage / ClientProfileCard | account-workspace.jsx: profile/settings entry, weekly brief, Signals, Reports in their original order |
| LatestReportPromo | weekly-brief.jsx: original empty-report presentation |
| SettingsSection / TruthLensRow | signal-section.jsx: grouped vertical rows and source summaries |
| TruthLensDetailContent | source-detail.jsx: breadcrumb and full-page detail frame; no modal or workspace tabs |
| AI visibility detail | source-detail.jsx: narrative, latest checks, organizations, reference sources |
| Org profile | account-profile.jsx: editable local name and domain; browser Back and Cancel return to the account |
| Report history | report-history.jsx: existing unpublished-report state |

## Files

- `components/`: separate chrome, home, directory, account, source, report, profile, row, breadcrumb, and shared selector components.
- `components/shell/`: copied/adapted MVDS shell patterns with V2 navigation configuration and command actions.
- `hooks/use-observatory.js`: hash route state, local profile edits, theme.
- `data/observatory-fixtures.js`: synthetic accounts/source observations.
- `data/navigation.js`: directory and source navigation definitions.
- `utils/observatory-model.js`: route builders, formatting, fixture adapter.
- `assets/global.png`: copied from the clone's home identity artwork; the original is untouched.

MVDS tokens, UI primitives, and the existing theme-preference hook are shared. Shell components are local adaptations; no Prototype 1 page is imported.

## Design system

Geist typography, regular-weight page headings, semantic color tokens, and framed sections follow the manually styled MVDS prototype. Cards use their Header, Title, Description, Action, Panel, and Footer APIs. Directory tables, avatars, badges, breadcrumbs, fields, form inputs, selectors, buttons, menus, and empty states compose existing primitives. Source icons share a small Avatar-based wrapper. Primitive implementations and global styles remain unchanged.

The header uses a local copy of the prototype ThemeSwitcherDropdown (Light, Dark, System), backed by the existing saved `mvds-theme` preference. Breadcrumbs live exclusively in the header. Both appearances use the design system's semantic tokens.

The Search button and Ctrl/Cmd+K open a keyboard-navigable command palette for V2 pages, accounts, the current account's sources, and appearance. The workspace menu links to accounts and current account settings and offers system appearance. The desktop sidebar stays open, including when Ctrl/Cmd+B is pressed. A mobile-only menu button opens a drawer that closes after navigation. Prototype-only destinations without V2 pages are omitted.

## Local routes

- `/observatory-v2#/console`
- `/observatory-v2#/console/accounts`
- `/observatory-v2#/console/client/northstar/current`
- `/observatory-v2#/console/client/northstar/current?lens=insight%3Aai-visibility`
- `/observatory-v2#/console/client/northstar/current?lens=source%3Aga4`

Source selection and reporting periods are URL state and support browser Back/Forward and direct links.

## Data and coverage limits

Page content is reconstructed from the clone's source, not verified against a signed-in production session; the shell follows MVDS. It uses an agency scope, synthetic source records, and the live empty-report state. Authenticated service actions, conversations, billing, and published report playback are not wired. Source detail bodies provide representative local content and do not reproduce every production evidence widget. Profile saves last only for this browser session's mounted page.

The previously invented scenario toolbar, role preview, card dashboard, tab workspace, modal source details, JSON export, and extra watchlist flow have been removed.

## Checks

`npm.cmd run build`

`node_modules/.bin/oxlint.cmd src/features/observatory/_V2 src/main.jsx scripts/verify-observatory-v2.mjs`

With the dev server running at port 5180: `node scripts/verify-observatory-v2.mjs`. Set `PREVIEW_URL` for another origin and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if necessary.

The browser script verifies the independent entry, V2 shell navigation, command search and keyboard selection, desktop collapse, mobile drawer, stacked home layout, account/source navigation, browser Back, reporting periods, local profile edits, reports, saved theme, responsive widths, V1 isolation, and the legacy URL redirect. Screenshots go to `output/observatory-live/`.

Verified September 28, 2026: production build and focused lint passed; the browser flow passed without runtime errors. Home, account, source, and mobile screenshots were inspected. Marketing-Dashboard's Git status remains clean. Production visual parity, full screen-reader behavior, and every production account permission combination have not been verified.
