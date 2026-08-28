---
name: doonvine
description: Translate selected Figma components into this MVDS codebase using Figma MCP. Use when creating or updating primitives, components, or design tokens from a Figma selection in this project.
---

# Doonvine

Doonvine translates selected Figma components into the existing codebase using Figma MCP.

Figma and the codebase share the same design system foundation based on COSS UI.

The codebase is the source of truth for implementation patterns. Figma is the source of truth for the intended component design and configuration.

## Commands

Doonvine supports these operations:

- `create-primitive` - Create a new UI primitive from the Figma selection.
- `create-component` - Create a new component from the Figma selection.
- `update-primitive` - Update an existing UI primitive from the Figma selection.
- `update-component` - Update an existing component from the Figma selection.
- `add-token` - Add a Figma token to the codebase.

If Doonvine is invoked without an operation, ask the user which operation they want.

Do not begin implementation until the operation is known.

## Project landmarks

Inspect the repo before coding. In this project, the highest-value locations are:

- `src/components/ui` for protected UI primitives and their export patterns
- `src/features/*/components` and `src/components/**` for composed application components
- `src/styles/index.css` for CSS variables, theme tokens, typography, radius, semantic colors, and animation tokens
- nearby barrels or feature indexes when the requested component must be exported from an existing surface

Prefer matching the established folder, file, prop, and export shape already used nearby.

## Shared rules

### Inspect before implementing

Never guess existing implementation patterns.

Before making changes, inspect the relevant:

- existing components
- UI primitives
- CSS variables
- design tokens
- variant patterns
- props
- naming conventions
- exports
- folder conventions

Follow existing codebase patterns rather than introducing new ones.

### Figma

Use Figma MCP to inspect the selected component before changing code.

Understand its:

- hierarchy
- components
- variants
- variables
- properties
- states
- nested instances
- layout
- styling

Represent Figma variables and configurable component properties in code when the existing codebase patterns support them.

When the task requires Figma MCP access, load the environment's Figma usage skill first and follow its prerequisites before calling Figma tools.

### Tokens

Reuse existing project tokens whenever an equivalent exists.

Do not replace existing tokens with raw Figma values.

If a required token does not exist, do not silently create one. Tell the user that the token is missing.

Use `add-token` to introduce new tokens.

When evaluating tokens, inspect `src/styles/index.css` first, then any directly relevant component styles or utilities that already wrap those variables.

### UI primitives are protected

Existing UI primitives must not be modified unless the active command is `update-primitive`.

When using `update-primitive`, modify only the primitive explicitly requested.

Existing primitives may and should be imported and composed by other components.

Never recreate an existing primitive locally.

### Scope

Only change files required by the active operation.

Do not:

- refactor unrelated code
- modify unrelated primitives
- modify unrelated tokens
- restructure unrelated folders
- clean up unrelated files

### Ambiguity

Inspect the codebase instead of asking the user about implementation details that can be discovered.

Ask the user when a decision cannot be safely determined, including:

- missing operation
- missing destination for a new component
- missing design token
- conflicting Figma and codebase behavior

Do not guess.

## Operation guidance

### `create-primitive`

Create a new primitive only after confirming the requested primitive does not already exist in `src/components/ui`.

Match nearby primitive conventions for:

- file naming
- slot structure
- variant handling
- primitive re-exports
- class composition
- prop typing

Prefer composing existing COSS or Base UI primitives over inventing custom behavior.

### `create-component`

Create new components outside protected primitive files unless the request explicitly calls for a primitive.

Inspect nearby feature and shared components to determine the correct destination, naming, and export surface before writing code.

Compose existing primitives whenever possible.

### `update-primitive`

Confirm the exact primitive file first, then limit edits to that primitive and any directly required export or token wiring.

Preserve existing public API unless the Figma change and surrounding code clearly require a coordinated API update.

### `update-component`

Inspect the existing component implementation and the primitives it depends on before editing.

Keep the change local to the requested component unless a directly required dependency or export must also change.

### `add-token`

Add a token only when the user explicitly chose `add-token` or when another operation is blocked because a required token is missing and the user then approves adding it.

Place the token where the existing token system expects it, following the naming and semantic patterns already in `src/styles/index.css`.
