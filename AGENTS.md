# Global design rules

- Body text must use `text-wrap: pretty`; headings must use `text-wrap: balance` throughout the application, Reports, and shared UI. The defaults live in `src/styles/index.css`. Preserve this rule when adding components; do not override body text with balanced wrapping or headings with pretty wrapping.
- Keep intentional single-line controls, truncation, and preformatted code behavior intact.
- Follow scoped design rules where present, including `src/features/observatory/_V2/AGENTS.md`.
