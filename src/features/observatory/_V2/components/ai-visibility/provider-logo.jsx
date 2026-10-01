const providerLogos = {
  ChatGPT: { src: '/provider-logos/openai.svg', monochrome: true },
  Gemini: { src: '/provider-logos/gemini-color.svg', monochrome: false },
  Perplexity: { src: '/provider-logos/perplexity.svg', monochrome: true },
};

export function ProviderLogo({ name }) {
  const logo = providerLogos[name];
  if (!logo) return null;
  return <img src={logo.src} alt="" aria-hidden="true" width={16} height={16} className={`size-4 shrink-0 object-contain${logo.monochrome ? ' dark:invert' : ''}`} />;
}
