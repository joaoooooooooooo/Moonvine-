# Moonvine website v2

This homepage uses the same website frame for every section. Content and demos are separate from that frame so later pages can reuse it.

## Reusable primitives

`components/website-primitives.jsx` exports:

- `WebsiteShell`: wordmark, navigation, theme control, side line background, footer, and the scroll-aware call to action.
- `WebsiteSection`: full-width divider and the shared centered content container.
- `SectionIntro`: eyebrow, serif heading, and supporting copy.
- `DemoSurface`: framed media with a small caption.

`components/website-primitives.css` holds the 1280px container, side rails, serif face, section padding, dividers, header, and footer. `website.css` holds the homepage layouts and motion.

The sections in `sections/` contain the reference's content beats: hero and delivery demos; the audit topic accordion; connections, process, pricing, and editorial cards. The hero adapts `Moonvine Hero Animation v3` as a 19-second ready → ask → read → answer → reset loop, using the existing Observatory chat message components, composer input and button, badges, and frame cards. `WIREFRAME_MODE` in `components/website-primitives.jsx` keeps the other visual assets, charts, report previews, and editorial covers as neutral gray blocks. Set it to `false` when those visuals are ready. The underlying demo data is sample data.

## Preview

From `MVDS`, run `npm run dev`, then open `/website`. The homepage is a React route in `src/main.jsx`; Vercel rewrites that path to the app entry. `npm run build` includes this page.

The reference's trial prices and editorial covers are included for design review. The trial button currently goes to the existing Moonvine sign-in page; connect it to the actual sign-up flow and confirm the commercial terms before publishing.

