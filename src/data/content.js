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
    summary: "A quick view of your score, learning streak, progress and upcoming payments.",
    highlights: ["Credit score and progress", "Knowledge streak", "Upcoming payments"],
  },
  {
    id: "calendar",
    title: "Calendar",
    image: "assets/product/calendar.png",
    alt: "SpendSense mobile calendar with monthly budget summary, calendar dates, and payment list.",
    summary: "See how your monthly budget and scheduled payments fit together.",
    highlights: ["Monthly budget summary", "Paid, due and missed totals", "Dated payment activity"],
  },
  {
    id: "simulation",
    title: "Simulation",
    image: "assets/product/simulation.png",
    alt: "SpendSense simulated month screen with a daily agenda and upcoming fictional obligations.",
    summary: "Practice a fictional month and see how daily choices affect your money goals.",
    highlights: ["A 30-day money challenge", "Daily agenda and obligations", "Progress and score feedback"],
  },
  {
    id: "quests",
    title: "Quests",
    image: "assets/product/quests.png",
    alt: "SpendSense quests screen showing the learning path, daily quiz, streak, and topic progress.",
    summary: "Build money knowledge through quizzes, streaks and guided topics.",
    highlights: ["Daily quiz challenges", "XP and learning streaks", "Progress through topics"],
  },
  {
    id: "friends",
    title: "Friends",
    image: "assets/product/friends.png",
    alt: "SpendSense Friends Hub with friends, a friend request, leaderboard, and challenge options.",
    summary: "Connect with friends, compare progress and take on money habit challenges.",
    highlights: ["Friends and requests", "Leaderboards", "Shared challenges and wagers"],
  },
  {
    id: "mascot",
    title: "Mascot",
    image: "assets/product/mascot.png",
    alt: "SpendSense mascot home with Spendy wearing overalls and a sweatband.",
    summary: "Follow Spendy’s progress and personalize your mascot experience.",
    highlights: ["Mascot level and coins", "Room and wardrobe", "Rewards and shop"],
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

// Source: closed issues and milestones in COS301-SE-2026/SpendSense. Periods are
// when the milestone's issues were closed, not official demo dates. `shots` are
// ids from productScreenshots; closedIssues are the GitHub milestone totals.
export const journey = [
  {
    id: "demo-1",
    tab: "Demo 1",
    number: "01",
    title: "Foundations",
    period: "May 2026",
    tagline: "From a blank repository to a working way to track what you owe.",
    summary: "The team set up the repository, designed the brand and wireframes, and built the first end-to-end flow: sign up, add an obligation, and log a payment.",
    issues: 143,
    shots: [],
    built: [
      "Requirements, architecture, ERD and API contract documents",
      "Brand guide, mobile wireframes and reusable UI components",
      "Signup and login with Supabase and a JWT-guarded API",
      "Obligations: create, list and generate payment schedules",
      "Payment timeline with paid, late and overdue states",
      "Payment logging with simulated late fees and interest",
      "Score, streaks, coins and badges triggered by payments",
      "Demo seed data and a clean-clone Docker walkthrough",
    ],
    challenge: null,
    tags: ["NestJS", "Prisma", "Supabase", "React"],
  },
  {
    id: "demo-2",
    tab: "Demo 2",
    number: "02",
    title: "Making it smart",
    period: "Jul – Aug 2026",
    tagline: "A live credit score, daily learning, and reminders that nudge you in time.",
    summary: "SpendSense moved from tracking to guiding: a score built on real payment behaviour, a financial-literacy quiz, insights from your own stats, and scheduled reminders.",
    issues: 105,
    shots: ["dashboard", "quests"],
    built: [
      "Credit score with breakdown, risk caps and confidence",
      "Daily financial-literacy quiz with topics and knowledge streaks",
      "Stats-based insights page and dashboard summary",
      "Notifications inbox and due-payment reminders",
      "Scheduler for pending, overdue and missed payments",
      "Profile hub, settings, help menu and data export",
    ],
    challenge: {
      title: "One reward path for payments and quizzes",
      text: "Quizzes needed to pay out coins and streaks like payments do, so the team pulled the payment reward logic into a shared reward service instead of duplicating it.",
    },
    tags: ["Credit scoring", "Quiz", "Notifications", "Scheduler"],
  },
  {
    id: "demo-3",
    tab: "Demo 3",
    number: "03",
    title: "Going social",
    period: "Aug – Sep 2026",
    tagline: "Friends, wagers, a mascot to care for, and a Wrapped of your month.",
    summary: "The social and playful layer arrived, alongside production hardening so the live app stays healthy as more people use it.",
    issues: 73,
    shots: ["friends", "mascot"],
    built: [
      "Friends, requests, leaderboard and coin wagers",
      "Spendy the mascot with moods, a cosmetics shop and equipment",
      "Monthly Wrapped with swipeable story cards and sharing",
      "Health checks, automatic rollback and monitoring on deployment",
      "Reworked dashboard and hand-drawn mascot emotions and accessories",
    ],
    challenge: {
      title: "Recovering a production incident",
      text: "The live EC2 server had an incident, so the team recovered it, kept the evidence, then added health checks, automatic rollback and monitoring. They also tested a move to a managed RDS database behind a go/no-go gate.",
    },
    tags: ["Friends", "Wagers", "Mascot", "Wrapped", "CI/CD"],
  },
  {
    id: "demo-4",
    tab: "Demo 4",
    number: "04",
    title: "Practice and polish",
    period: "Sep – Oct 2026",
    tagline: "A simulated month to practise on, receipt scanning, and a mascot that guides you.",
    summary: "The final demo focused on learning by doing: play through a fictional month, scan receipts into expenses, and let Spendy walk you through the app.",
    issues: 46,
    shots: ["simulation", "calendar"],
    built: [
      "Simulated month: briefing, budgeting, surprise events and score breakdown",
      "Receipt OCR and partial payments",
      "Mascot guidance with a guided walkthrough and daily tips",
      "End-to-end tests across simulation and guidance flows",
    ],
    challenge: {
      title: "A month you can pause and resume",
      text: "The simulated month had to survive refreshes, exits and repeated taps, so the frontend was built around idempotent requests, deadline refetching and recovery of unfinished results.",
    },
    tags: ["Simulation", "Receipt OCR", "Mascot guidance", "Playwright"],
  },
  {
    id: "project-day",
    tab: "Day",
    number: "05",
    label: "Project Day",
    title: "Project Day",
    period: "30 Oct 2026",
    tagline: "Four demos of work, shown to everyone.",
    summary: "SpendSense is presented at Project Day alongside the rest of the capstone teams.",
    issues: 0,
    shots: [],
    built: [],
    challenge: null,
    tags: [],
  },
];

// Partner logos are copied from the SpendSense repository's own README assets.
export const partners = [
  { name: "Team MARK2", image: "assets/partners/mark2.png", note: "Capstone project group" },
  { name: "EPI-USE Labs & Advance", image: "assets/partners/epiuse-advance.webp", note: "Our clients" },
  { name: "University of Pretoria", image: "assets/partners/up.webp", note: "COS 301 Capstone" },
];
