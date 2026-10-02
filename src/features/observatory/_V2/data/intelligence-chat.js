import { formatMetric } from '../utils/observatory-model';

export const chatSuggestions = [
  { id: 'table', label: 'Compare metrics', prompt: 'Compare our metrics in a table' },
  { id: 'links', label: 'Explore reports', prompt: 'Show links to our reports' },
  { id: 'search', label: 'Search traffic', prompt: 'Chart our search traffic' },
  { id: 'numbers', label: 'Key numbers', prompt: 'Show our key numbers' },
  { id: 'social', label: 'Social engagement', prompt: 'Chart our social engagement' },
  { id: 'ai', label: 'AI visibility', prompt: 'Show sources for our AI visibility' },
];
const formats = ['table', 'links', 'chart', 'numbers'];

// Local mock responses use the selected account fixtures, without an API.
export function chatReply(prompt, { account, lenses }, turn = 0) {
  const text = prompt.toLowerCase();
  const format = /table|compare/.test(text) ? 'table' : /link|source|report/.test(text) ? 'links' : /chart|trend|graph/.test(text) ? 'chart' : /number|metric|summary|summarize/.test(text) ? 'numbers' : formats[turn % formats.length];
  const lens = lenses.find((item) => item.id === (/social|engagement/.test(text) ? 'social' : 'search'));
  const introductions = {
    table: `Here is a comparison of ${account.name}'s key metrics for the selected report week. Each metric keeps its own unit.`,
    links: `Explore the source details behind ${account.name}'s intelligence overview.`,
    chart: `Here is the weekly pattern for ${lens.label}: ${formatMetric(lens.value)} ${lens.metric.toLowerCase()}. The daily breakdown is illustrative mock data.`,
    numbers: `Here are ${account.name}'s key numbers for the selected report week.`,
  };
  return { text: introductions[format], format, lensId: lens.id };
}
