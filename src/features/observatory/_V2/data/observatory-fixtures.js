// Synthetic, deterministic fixtures. Never read production credentials or services.
export const accounts = [{
  id: "northstar",
  name: "Northstar Studio",
  domain: "northstar.example",
  initials: "NS",
  people: 8,
  entities: 12,
  multiplier: 1,
  description: "Independent strategy and design studio."
}, {
  id: "canopy",
  name: "Canopy Living",
  domain: "canopy.example",
  initials: "CL",
  people: 5,
  entities: 9,
  multiplier: 0.68,
  description: "Thoughtful products for everyday living."
}, {
  id: "meridian",
  name: "Meridian Group",
  domain: "meridian.example",
  initials: "MG",
  people: 12,
  entities: 18,
  multiplier: 1.4,
  description: "Advisory services for growing businesses."
}];

export const periods = [{
  value: "current",
  label: "This Week"
}, {
  value: "previous",
  label: "Last Week"
}];

export const lensDefinitions = [{
  id: "ai",
  sourceId: "insight:ai-visibility",
  label: "AI visibility",
  source: "AI answer census",
  metric: "Answers mentioning your brand",
  value: 68,
  unit: "%",
  delta: 8,
  sampleQuestions: 25,
  websiteCitations: 0,
  providerCoverage: [
    { name: "ChatGPT", completed: 25, planned: 25 },
    { name: "Gemini", completed: 25, planned: 25 },
    { name: "Perplexity", completed: 25, planned: 25 }
  ],
  description: "How often AI answers include your brand in relevant recommendations.",

  evidence: [
    "Brand appeared in 34 of 50 sampled answers.",
    "Category discovery questions produced the strongest visibility.",
    "ChatGPT, Gemini, and Perplexity are represented in this sample."
  ],

  rows: [["ChatGPT", 76], ["Gemini", 64], ["Perplexity", 64]]
}, {
  id: "analytics",
  sourceId: "source:ga4",
  label: "Google Analytics",
  source: "Google Analytics 4",
  metric: "Website sessions",
  value: 12480,
  delta: 12.4,
  description: "Understand who visits your website and where engagement comes from.",

  evidence: [
    "Organic search accounts for 48% of sessions.",
    "Engaged sessions increased alongside overall traffic.",
    "The services page attracted the most new visitors."
  ],

  rows: [["Organic search", 5990], ["Direct", 3744], ["Referral", 1747], ["Social", 999]]
}, {
  id: "search",
  sourceId: "source:gsc",
  label: "Google Search Console",
  source: "Google Search Console",
  metric: "Search clicks",
  value: 3260,
  delta: 6.8,
  description: "Track discovery through search queries and landing pages.",

  evidence: [
    "Branded queries remain the largest source of clicks.",
    "Non-branded discovery grew versus the preceding week.",
    "Average position improved for service-related queries."
  ],

  rows: [["Brand queries", 1826], ["Design studio", 717], ["Brand strategy", 489], ["Other queries", 228]]
}, {
  id: "social",
  sourceId: "source:social",
  label: "Social media",
  source: "Public social accounts",
  metric: "Likes + comments",
  value: 842,
  delta: -4.2,
  description: "Activity and engagement across the accounts you watch.",

  evidence: [
    "LinkedIn generated the most engagement.",
    "Eight account posts were captured this week.",
    "Engagement fell while posting frequency remained steady."
  ],

  rows: [["LinkedIn", 526], ["Instagram", 280], ["YouTube", 36]]
}, {
  id: "news",
  sourceId: "source:news",
  label: "News + media",
  source: "Media monitoring",
  metric: "Media mentions",
  value: 24,
  delta: 20,
  description: "Coverage of your account and the topics that matter to it.",

  evidence: [
    "An industry feature drove the largest wave of mentions.",
    "Six mentions include organizations on the watchlist.",
    "Repeated syndicated stories are grouped in this sample."
  ],

  rows: [["Industry coverage", 12], ["Company mentions", 8], ["Watchlist mentions", 4]]
}, {
  id: "website",
  sourceId: "source:site",
  label: "Site health",
  source: "Website audit",
  metric: "Performance score",
  value: 87,
  unit: "/100",
  delta: 3,
  description: "Technical performance, accessibility, search, and AI readiness.",

  evidence: [
    "Large images remain the main performance opportunity.",
    "Two pages need more descriptive link labels.",
    "The site is crawlable and its sitemap is available."
  ],

  rows: [["Performance", 87], ["Accessibility", 94], ["Best Practices", 89], ["SEO", 96]]
}, {
  id: "competitors",
  sourceId: "source:semrush",
  label: "Search competitors",
  source: "Search overlap",
  metric: "Shared search terms",
  value: 186,
  delta: 9.4,
  description: "Organizations appearing near your account in organic search.",

  evidence: [
    "Studio Field has the highest organic overlap.",
    "Shared terms increased in the strategy category.",
    "Search overlap indicates discovery proximity, not a confirmed business relationship."
  ],

  rows: [["Studio Field", 86], ["Form & Matter", 61], ["Common Ground", 39]]
}];

