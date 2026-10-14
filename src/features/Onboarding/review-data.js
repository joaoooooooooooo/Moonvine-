// Sample data for the onboarding prototype; no website analysis is performed.
export const initialCompetitors = [
  ['Profound', 'tryprofound.com'],
  ['AirOps', 'airops.com'],
  ['Peec AI', 'peec.ai'],
  ['Scrunch AI', 'scrunchai.com'],
  ['Otterly AI', 'otterly.ai'],
].map(([name, domain], index) => ({ id: `competitor-${index}`, name, domain }))

export const promptTopics = [
  { value: 'visibility', label: 'AI visibility' },
  { value: 'measurement', label: 'Measurement' },
  { value: 'strategy', label: 'Content strategy' },
  { value: 'comparison', label: 'Tool comparison' },
  { value: 'reporting', label: 'Reporting' },
]

const questions = [
  ['How can I find out whether AI assistants mention my brand?', 'visibility'],
  ['What helps a brand appear in AI-generated answers?', 'visibility'],
  ['How do I track brand mentions in ChatGPT?', 'visibility'],
  ['How can I improve my visibility in AI search?', 'visibility'],
  ['How do AI assistants choose which brands to recommend?', 'visibility'],
  ['Which metrics should I use to measure AI search visibility?', 'measurement'],
  ['How can I measure my share of voice in AI answers?', 'measurement'],
  ['How do I track citations across AI search engines?', 'measurement'],
  ['How can I compare my AI visibility with competitors?', 'measurement'],
  ['How often should I monitor AI search results?', 'measurement'],
  ['What content is most likely to be cited by AI assistants?', 'strategy'],
  ['How can I identify content gaps in AI search?', 'strategy'],
  ['How should I choose prompts to track for my brand?', 'strategy'],
  ['How can I turn AI search insights into a content plan?', 'strategy'],
  ['How does answer engine optimization differ from SEO?', 'strategy'],
  ['What are the best tools for monitoring AI search visibility?', 'comparison'],
  ['Which AI visibility tools are suitable for a small team?', 'comparison'],
  ['What should I look for in an AI search analytics platform?', 'comparison'],
  ['Which platforms track both brand mentions and citations?', 'comparison'],
  ['How do I evaluate AI visibility monitoring tools?', 'comparison'],
  ['What should an AI visibility report include?', 'reporting'],
  ['How do I report changes in AI share of voice?', 'reporting'],
  ['How can I explain AI search performance to my team?', 'reporting'],
  ['How do I track AI visibility trends over time?', 'reporting'],
  ['How can I connect AI search insights to marketing priorities?', 'reporting'],
]

export const initialPrompts = questions.map(([text, topic], index) => ({ id: `prompt-${index}`, text, topic }))
