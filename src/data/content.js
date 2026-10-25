/**
 * Public site content. Replace placeholders only with information approved by
 * the SpendSense team. Feature ownership is intentionally empty until confirmed.
 */
export const site = {
  name: "SpendSense",
  title: "SpendSense — Project Day Team Hub",
  description:
    "Explore the SpendSense personal finance project and meet the five developers behind it.",
  repositoryUrl: "",
  applicationUrl: "",
};

function placeholderMember(number) {
  const suffix = String(number).padStart(2, "0");
  return {
    id: `member-${suffix}`,
    slug: `team-member-${suffix}`,
    name: `Team member ${suffix}`,
    headline: "Role pending team approval",
    bio: "This profile is ready for the developer’s approved introduction, experience and portfolio details.",
    isPlaceholder: true,
    portrait: "",
    skills: [],
    projects: [],
    links: { github: "", linkedin: "", website: "", email: "" },
    cvPdf: "",
  };
}

export const members = [
  placeholderMember(1),
  placeholderMember(2),
  placeholderMember(3),
  placeholderMember(4),
  placeholderMember(5),
];

// These are topics suggested by the implementation brief, not confirmed product features.
export const features = [
  {
    id: "credit-profile",
    title: "Credit profile",
    category: "Concept to confirm",
    summary: "Explore how a simulated credit profile could make financial events easier to understand.",
    detail: "The project brief suggests a simulated credit profile. Confirm the released flow, language and screenshots before describing it as a delivered feature.",
    technologies: [],
    screenshots: [],
    contributions: [],
  },
  {
    id: "obligations",
    title: "Obligations calendar",
    category: "Concept to confirm",
    summary: "A proposed place to understand upcoming obligations and payment tracking.",
    detail: "The implementation plan names an obligations calendar and payment tracking as areas to check against the current app.",
    technologies: [],
    screenshots: [],
    contributions: [],
  },
  {
    id: "challenges",
    title: "Challenges & rewards",
    category: "Concept to confirm",
    summary: "A proposed way to connect helpful money habits with gameful progress.",
    detail: "Challenges, achievements and rewards appear as possible concepts in the brief. Verify which parts are implemented before publishing a product claim.",
    technologies: [],
    screenshots: [],
    contributions: [],
  },
  {
    id: "progress",
    title: "Progress & learning",
    category: "Concept to confirm",
    summary: "A proposed path for tracking personal progress and building financial knowledge.",
    detail: "The plan mentions user progression, a mascot and learning streaks as possible areas. Confirm each item and its final name with the team.",
    technologies: [],
    screenshots: [],
    contributions: [],
  },
  {
    id: "social",
    title: "Friends & social challenges",
    category: "Concept to confirm",
    summary: "A possible social layer for shared challenges and friendly accountability.",
    detail: "Social challenges and wagers are explicitly conditional in the plan. Keep this topic hidden or update it if it is not part of the final application.",
    technologies: [],
    screenshots: [],
    contributions: [],
  },
];

// Example headings from the plan, shown as a replaceable scaffold rather than project history.
export const milestones = [
  { id: "discovery", title: "Problem discovery", note: "Replace with the confirmed moment and context." },
  { id: "prototype", title: "First prototype", note: "Add the approved prototype description or image." },
  { id: "working-demo", title: "Working demo", note: "Describe a verified implementation milestone." },
  { id: "refinement", title: "Integration & refinement", note: "Add confirmed testing or integration details." },
  { id: "project-day", title: "Project Day", note: "Add the event date and final approved summary." },
];
