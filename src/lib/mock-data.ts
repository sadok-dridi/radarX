export const overviewStats = [
  { label: "High-confidence leads", value: "18", detail: "+4 in the last 24h" },
  { label: "Active sources", value: "31", detail: "7 evergreen, 16 validated" },
  { label: "Runs today", value: "42", detail: "1 warning, 0 hard failures" },
  { label: "Pending reviews", value: "9", detail: "3 marked urgent" },
];

export const opportunities = [
  {
    id: "lead-r-devops-1",
    title: "Need an automation engineer to reduce manual reporting",
    source: "r/smallbusiness",
    platform: "Reddit",
    score: 84,
    confidence: 91,
    status: "qualified",
    action: "telegram",
    publishedAt: "2 hours ago",
    location: "Remote / US-friendly",
    canonicalUrl: "https://reddit.com/r/smallbusiness",
    summary:
      "Founder describes manual ops bottlenecks, spreadsheet-heavy reporting, and asks for automation help with a real budget signal.",
    reason:
      "Strong hiring intent, high pain-signal density, and clear implementation scope around reporting automation.",
  },
  {
    id: "lead-r-startups-2",
    title: "Looking for someone to build a lightweight client portal",
    source: "r/startups",
    platform: "Reddit",
    score: 72,
    confidence: 77,
    status: "interesting",
    action: "review",
    publishedAt: "5 hours ago",
    location: "EU",
    canonicalUrl: "https://reddit.com/r/startups",
    summary:
      "Startup operator asks for a small client-facing portal with document uploads, notifications, and admin review flow.",
    reason:
      "Good build relevance and strong delivery scope, but budget signal is weaker than top-tier leads.",
  },
  {
    id: "lead-r-entrepreneur-3",
    title: "Hiring help to connect CRM, forms, and follow-up messaging",
    source: "r/Entrepreneur",
    platform: "Reddit",
    score: 68,
    confidence: 74,
    status: "watch",
    action: "notion",
    publishedAt: "11 hours ago",
    location: "Middle East",
    canonicalUrl: "https://reddit.com/r/Entrepreneur",
    summary:
      "Business owner describes a fragmented lead pipeline and wants automation between intake forms, CRM, and follow-up.",
    reason:
      "Good workflow-fit language and pain-point density, but still needs human validation on seriousness.",
  },
];

export const sources = [
  {
    id: "source-smallbusiness",
    name: "r/smallbusiness",
    state: "evergreen",
    monitoringMode: "always_scanned",
    confidence: 93,
    lastSeen: "1h ago",
    lastRun: "Success",
  },
  {
    id: "source-startups",
    name: "r/startups",
    state: "validated",
    monitoringMode: "scanned",
    confidence: 78,
    lastSeen: "3h ago",
    lastRun: "Success",
  },
  {
    id: "source-entrepreneur",
    name: "r/Entrepreneur",
    state: "candidate",
    monitoringMode: "monitored",
    confidence: 61,
    lastSeen: "8h ago",
    lastRun: "Warning",
  },
];

export const runs = [
  {
    id: "run-2026-03-08-01",
    name: "Opportunity Radar System",
    status: "succeeded",
    trigger: "scheduled",
    startedAt: "00:00",
    duration: "43s",
    itemsOut: 12,
  },
  {
    id: "run-2026-03-08-02",
    name: "Opportunity Radar System",
    status: "partially_failed",
    trigger: "scheduled",
    startedAt: "03:00",
    duration: "58s",
    itemsOut: 9,
  },
  {
    id: "run-2026-03-08-03",
    name: "Opportunity Radar System",
    status: "succeeded",
    trigger: "manual",
    startedAt: "09:21",
    duration: "31s",
    itemsOut: 5,
  },
];

export const accessRequests = [
  {
    id: "request-1",
    name: "Ahmed B.",
    email: "ahmed@example.com",
    status: "pending",
    requestedAt: "Today, 10:14",
  },
  {
    id: "request-2",
    name: "Sami K.",
    email: "sami@example.com",
    status: "active",
    requestedAt: "2 days ago",
  },
];

export const reviews = [
  {
    id: "review-1",
    title: "Need an automation engineer to reduce manual reporting",
    from: "new",
    to: "qualified",
    owner: "Owner Preview",
    note: "Strong fit for workflow + reporting automation.",
  },
  {
    id: "review-2",
    title: "Looking for someone to build a lightweight client portal",
    from: "new",
    to: "interesting",
    owner: "Owner Preview",
    note: "Worth tracking, but pricing seriousness still unclear.",
  },
];
