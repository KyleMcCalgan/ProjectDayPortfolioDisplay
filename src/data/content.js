/**
 * Public site content. Replace placeholders only with information approved by
 * the SpendSense team. Feature ownership is intentionally empty until confirmed.
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
    heading: "Your progress hub",
    description: "A quick look at score, streaks, payments coming up, and the next step in the app.",
    image: "assets/product/dashboard.png",
    alt: "SpendSense mobile dashboard with credit score, knowledge streak, progress cards, and upcoming payments.",
  },
  {
    id: "calendar",
    title: "Calendar",
    heading: "Your money calendar",
    description: "A month view that brings budgets, paid items, upcoming obligations, and missed payments together.",
    image: "assets/product/calendar.png",
    alt: "SpendSense mobile calendar with monthly budget summary, calendar dates, and payment list.",
  },
  {
    id: "simulation",
    title: "Simulation",
    heading: "Practise with a simulated month",
    description: "A 30-day money challenge with a day-by-day agenda and fictional obligations.",
    image: "assets/product/simulation.png",
    alt: "SpendSense simulated month screen with a daily agenda and upcoming fictional obligations.",
  },
  {
    id: "quests",
    title: "Quests",
    heading: "Learn through small quests",
    description: "Daily quiz and topic paths pair money learning with progress and rewards.",
    image: "assets/product/quests.png",
    alt: "SpendSense quests screen showing the learning path, daily quiz, streak, and topic progress.",
  },
  {
    id: "friends",
    title: "Friends",
    heading: "Build money habits together",
    description: "The Friends Hub brings together friend requests, a leaderboard, and shared challenges.",
    image: "assets/product/friends.png",
    alt: "SpendSense Friends Hub with friends, a friend request, leaderboard, and challenge options.",
  },
  {
    id: "mascot",
    title: "Mascot",
    heading: "Meet Spendy",
    description: "The mascot home brings the character, outfits, and progress into one playful space.",
    image: "assets/product/mascot.png",
    alt: "SpendSense mascot home with Spendy wearing overalls and a sweatband.",
  },
];

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
