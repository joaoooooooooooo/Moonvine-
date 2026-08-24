# Moonvine Design System

This repository contains the current Design System for Moonvine.

It is the working foundation for Moonvine's console experience, including shared UI primitives, layout patterns, navigation, data display, charts, and page-level design system examples used across the product.

## Purpose

The goal of this project is to provide a consistent system for building Moonvine interfaces with:

- Shared visual language
- Reusable UI components
- Consistent interaction patterns
- Scalable layout and navigation structure
- A strong base for product pages such as Observatory, Accounts, Reports, Entities, People, and Settings

## Current Stack

The project is currently built with:

- `React 19`
- `Vite`
- `JavaScript` and `TypeScript` in the same codebase
- `Tailwind CSS 4`
- `Base UI`
- `coss` UI primitives and patterns

## Libraries In Use

These are the main libraries and tools currently present in the project:

- `@base-ui/react` for accessible low-level UI primitives
- `coss` via the `@coss` registry for reusable UI components and patterns
- `lucide-react` for icons
- `@daypicker/react` for calendar behavior
- `@tanstack/react-table` for table architecture
- `echarts` and local `evilcharts` wrappers for charts and data visualization
- `@rive-app/react-webgl2` for Rive motion assets
- `motion` for animation
- `class-variance-authority`, `clsx`, and `tailwind-merge` for component styling utilities
- `shadcn` tooling and `components.json` registry configuration
- `Storybook` for component development and documentation
- `Vitest` for testing support
- `Oxlint` for linting
- `Agentation` for local development tooling

## UI Foundation

The UI layer in this repository is centered on reusable primitives inside [`src/components/ui`](./src/components/ui), with design system composition happening across:

- `src/components/ui`
- `src/components/shared`
- `src/features`
- `src/layouts`
- `src/pages`

This structure allows the system to support both low-level building blocks and complete product-facing views.

## Project Structure

Main areas of the repository:

- `src/components/ui` - reusable UI primitives
- `src/components/shared` - shared composed components
- `src/features` - feature-specific components, tables, settings, and console modules
- `src/pages` - route-level pages
- `src/layouts` - application shell and layout structure
- `src/styles` - global styling entry points
- `public` - static assets

## Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Other useful scripts:

```bash
npm run build
npm run lint
npm run storybook
npm run build-storybook
```

## Notes

- The repository currently mixes `.jsx`, `.tsx`, `.js`, and `.ts` files.
- The component registry is configured in [`components.json`](./components.json), including custom registries such as `@coss` and `@evilcharts`.
- This README reflects the current stack in the repository as of August 24, 2026.
