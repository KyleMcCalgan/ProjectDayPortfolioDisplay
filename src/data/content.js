import { members } from "./teamProfiles.js";
export { members };

/**
 * Shared public site content. Team-specific profile data is loaded from the
 * key-value files in team-members/ during the static build.
 */
export const site = {
  name: "SpendSense",
  title: "The SpendSense Team",
  description:
    "Meet the five developers behind SpendSense, then explore the real product screens and mascot.",
  repositoryUrl: "",
  applicationUrl: "https://www.spendsense.co.za/",
};

// User-supplied screenshots from the SpendSense app, shown as product references.
export const productScreenshots = [
  {
    id: "dashboard",
    title: "Home",
    image: "assets/product/dashboard.png",
    alt: "SpendSense mobile dashboard with credit score, knowledge streak, progress cards, and upcoming payments.",
  },
  {
    id: "calendar",
    title: "Calendar",
    image: "assets/product/calendar.png",
    alt: "SpendSense mobile calendar with monthly budget summary, calendar dates, and payment list.",
  },
  {
    id: "simulation",
    title: "Simulation",
    image: "assets/product/simulation.png",
    alt: "SpendSense simulated month screen with a daily agenda and upcoming fictional obligations.",
  },
  {
    id: "quests",
    title: "Quests",
    image: "assets/product/quests.png",
    alt: "SpendSense quests screen showing the learning path, daily quiz, streak, and topic progress.",
  },
  {
    id: "friends",
    title: "Friends",
    image: "assets/product/friends.png",
    alt: "SpendSense Friends Hub with friends, a friend request, leaderboard, and challenge options.",
  },
  {
    id: "mascot",
    title: "Mascot",
    image: "assets/product/mascot.png",
    alt: "SpendSense mascot home with Spendy wearing overalls and a sweatband.",
  },
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

for (const member of members) {
  for (const contribution of member.contributions) {
    const feature = features.find((entry) => entry.id === contribution.featureId);
    if (!feature) throw new Error(`Unknown feature "${contribution.featureId}" in ${member.name}'s profile.`);
    feature.contributions.push({
      memberId: member.id,
      title: contribution.title,
      role: contribution.role,
      detail: contribution.detail,
    });
  }
  delete member.contributions;
  delete member.order;
}

// Example headings from the plan, shown as a replaceable scaffold rather than project history.
export const milestones = [
  { id: "discovery", title: "Problem discovery", note: "Replace with the confirmed moment and context." },
  { id: "prototype", title: "First prototype", note: "Add the approved prototype description or image." },
  { id: "working-demo", title: "Working demo", note: "Describe a verified implementation milestone." },
  { id: "refinement", title: "Integration & refinement", note: "Add confirmed testing or integration details." },
  { id: "project-day", title: "Project Day", note: "Add the event date and final approved summary." },
];
