export const newsCategories = [
  { id: 'coverage', label: 'About account', title: 'Coverage this week', description: 'Stories from the Apta Agency reference collection.' },
  { id: 'mentions', label: 'Mentions', title: 'Account mentions', description: 'References within broader conversations.' },
  { id: 'competitors', label: 'Competitors', title: 'Competitor mentions', description: 'Stories matched to the reference watchlist.' },
  { id: 'related', label: 'Related reads', title: 'Related reads', description: 'The wider industry conversation.' },
];
const titles = [
  'Expertorial: Genfare—Every Tap Tells a Story: Turning Transactions into Better Transit',
  'Beyond the Fare Gates: Partnership Improves Shared Transit Spaces in Philadelphia',
  'Sen. Moreno Visits Akron Metro, Sees Federal Transit Investment in Action',
  'The Leaders We Already Have: Building Transit’s Next Generation',
  'Expertorial: Masabi—COTA Tap to Pay',
  'Onward: Reliable Same-Day WAV Options Are Now a Reality for Paratransit Riders',
  'What Major Events Can Teach Transit Leaders About Lasting Impact',
  'APTA Committee Profile: Public Transportation CEO Coordinating Council',
  'Get Involved in APTA’s Standards Program',
  '2026 CEO Spotlight: Roman Cornell, CEO of ABC Companies',
  'APTA Member Profile: Dawn M. Kruger, Parsons Corporation',
  'The Foundation Behind the Transition',
];
const photos = { 1: 'shared-transit', 7: 'committee-profile', 8: 'standards-program' };
// Saved Figma reference content; not a live account or period feed.
export function newsMediaData() {
  const articles = titles.map((title, index) => ({
    id: `coverage-${index}`, category: 'coverage', title,
    publisher: photos[index] ? 'aptapassengertransport.com' : 'Passenger Transport',
    initials: 'PT', date: `2026-10-${index < 2 ? '09' : index < 4 ? '08' : index < 9 ? '07' : '06'}`,
    image: photos[index] ? `/news-media/${photos[index]}.png` : undefined,
    avatar: photos[index] ? '/news-media/passenger-transport-avatar.png' : undefined,
    topic: index === 3 || index === 10 ? 'People and labor' : index === 6 ? 'Brand and culture' : 'General market coverage',
    matched: 'Earned coverage',
  }));
  articles.push(
    { id: 'superside-youtube', category: 'competitors', publisher: 'YouTube', initials: 'YT', date: '2026-10-09', title: 'OPERATION OSCHERSLEBEN: The Final — FIM Superside ’26 — Team #45 Rewind', matched: 'superside.com', topic: 'General market coverage' },
    { id: 'superside-fim', category: 'competitors', publisher: 'FIM', initials: 'FI', date: '2026-10-08', title: 'FIM SuperSide Episode 2 goes behind the scenes of the title decider', matched: 'superside.com', topic: 'General market coverage' },
  );
  const counts = Object.fromEntries(newsCategories.map(({ id }) => [id, articles.filter((article) => article.category === id).length]));
  const topics = ['General market coverage', 'People and labor', 'Brand and culture'].map((label) => ({ label, value: articles.filter((article) => article.topic === label).length }));
  return { articles, counts, topics, publishers: [...new Set(articles.map((article) => article.publisher))].sort() };
}
