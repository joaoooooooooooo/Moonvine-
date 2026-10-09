// Illustrative fixtures for the product demo, not live account measurements.
const words = text => text.split(' ').map(text => ({ text }))
const positive = text => ({ text, sentiment: 'success' })
const negative = text => ({ text, sentiment: 'error' })
const cite = sourceIndex => ({ text: '', cite: true, sourceIndex })

export const meetingTurns = [
  {
    prompt: 'I have a marketing meeting in 10 minutes. What should I know?',
    recap: true,
    reasoning: ['Reviewing search and social', 'Comparing competitor activity', 'Preparing your meeting brief'],
    content: [
      ...words('Three things: search brought'), positive('2,217'), ...words('clicks, up'), positive('6.8%.'), cite(0),
      ...words('Social engagement fell'), negative('12.4%.'), ...words('Harrowgate published'), negative('19'), ...words('posts to your'), negative('8.'), cite(1),
      ...words('Search is your strongest signal; social consistency is the gap.'),
    ],
    followUp: 'Which one should we act on first?',
  },
  {
    prompt: 'Which one should we act on first?',
    reasoning: ['Checking landing-page performance', 'Comparing traffic with conversions', 'Choosing the next action'],
    content: [
      ...words('Prioritize the landing pages. Engaged visits rose'), positive('14.2%,'), ...words('but conversion rate fell'), negative('9.1%.'), cite(2),
      ...words('Improve the offer and proof on your top 3 high-intent pages before buying more traffic. Track conversion rate and qualified leads to judge the result.'),
    ],
    followUp: 'Give me a quick recap I can bring to the meeting.',
  },
  {
    prompt: 'Give me a quick recap I can bring to the meeting.',
    reasoning: ['Pulling the key evidence together', 'Building your meeting recap'],
    content: words('Search is bringing more interest, but fewer visitors are converting. This week, improve the landing-page offer and proof, and establish a consistent social publishing cadence. Here?s the recap to bring to the meeting.'),
  },
]
