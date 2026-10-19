import illustration from '../../assets/Background Illustration Asset.svg?raw';

// Inline the local SVG so its shapes follow the active theme tokens.
const themedIllustration = illustration
  .replaceAll('#818181', 'var(--muted-foreground)')
  .replaceAll('#191919', 'var(--card)');

export function ChatBackground() {
  return (
    <div
      aria-hidden="true"
      className="v2-chat-background pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl overflow-hidden [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: themedIllustration }}
    />
  );
}
