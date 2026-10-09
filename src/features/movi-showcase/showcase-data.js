export const prompt = 'I have a marketing meeting in 10 minutes. Help!'
export const brief = "Search clicks are up 6.8%, but competitors are publishing more and gaining social momentum."
export const recommendation = "For the meeting: prioritize high-intent landing pages and a consistent social publishing plan."
export const reasoning = ['Reading 7 connected sources', 'Comparing the last 30 days', 'Preparing your meeting brief']
export const sources = ['Google Search Console', 'Google Analytics', 'AI visibility', 'LinkedIn', 'Instagram', 'Competitor websites', 'Earned media']
export const searchData = [260, 280, 300, 320, 360, 370, 327].map((current, index) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index], current, previous: Math.round(current / 1.068),
}))
export const comparisons = [
  ['Search clicks', '2,217', '1,840'],
  ['AI visibility', '38%', '31%'],
  ['Social posts', '8', '19'],
]
export const timing = {
  typing: 600,
  send: 600 + prompt.length * 42,
  reasoning: 600 + prompt.length * 42 + 500,
  response: 600 + prompt.length * 42 + 4100,
  word: 55,
}
timing.complete = timing.response + (brief.split(' ').length + recommendation.split(' ').length + 1) * timing.word + 400
timing.restart = timing.complete + 8000

export function phaseAt(time) {
  if (time < timing.send) return 'Typing your question'
  if (time < timing.reasoning) return 'Sending your question'
  if (time < timing.response) return 'Reading sources'
  if (time < timing.complete) return 'Streaming your meeting brief'
  return 'Brief ready'
}
