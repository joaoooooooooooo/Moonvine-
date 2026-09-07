import type { SourcesSectionData } from "./sources-section.types";

export const sourcesSectionMock = {
  title: "Sources checked this week.",
  eyebrow: "Coverage",
  sources: [
    { id: "website", name: "Website", kind: "website", status: "connected" },
    { id: "analytics", name: "Google Analytics", kind: "integration", status: "connected", description: "Traffic and engagement", avatarFallback: "GA" },
    { id: "search-console", name: "Search Console", kind: "integration", status: "connected", description: "Search performance", avatarFallback: "SC" },
    { id: "linkedin", name: "LinkedIn", kind: "integration", status: "watching", description: "Company activity", avatarFallback: "LI" },
    { id: "instagram", name: "Instagram", kind: "integration", status: "watching", description: "Social activity", avatarFallback: "IG" },
    { id: "youtube", name: "YouTube", kind: "integration", status: "watching", description: "Channel updates", avatarFallback: "YT" },
    { id: "hubspot", name: "HubSpot", kind: "integration", status: "not-connected", description: "Contact activity", avatarFallback: "HS" },
    { id: "google-ads", name: "Google Ads", kind: "integration", status: "not-connected", description: "Campaign performance", avatarFallback: "AD" },
  ],
} satisfies SourcesSectionData;
